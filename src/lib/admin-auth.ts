import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { createClient } from "@supabase/supabase-js";

/**
 * Authentification de l'espace admin (côté serveur uniquement).
 *
 * - Tant que la table `admin_credentials` est vide, les identifiants sont ceux de .env.local
 *   (ADMIN_EMAIL / ADMIN_PASSWORD).
 * - Dès que le mot de passe est changé depuis l'admin, il est stocké haché (scrypt) dans cette table,
 *   que la clé publique ne peut pas lire.
 * - Le cookie de session vaut « ADMIN_TOKEN.version » : changer le mot de passe augmente la version,
 *   ce qui déconnecte tous les autres appareils.
 */

export const SESSION_COOKIE = "admin_auth";
export const MIN_PASSWORD_LENGTH = 10;

const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

type Credentials = { email: string; password_hash: string; session_version: number };

function serviceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}

/** Identifiants enregistrés en base, ou null s'il n'y en a pas encore (ou si la table n'existe pas). */
export async function getStoredCredentials(): Promise<Credentials | null> {
  const { data, error } = await serviceClient()
    .from("admin_credentials")
    .select("email, password_hash, session_version")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return null;
  return data as Credentials;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

async function verifyHash(password: string, stored: string): Promise<boolean> {
  const [algo, saltHex, hashHex] = stored.split("$");
  if (algo !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scryptAsync(password, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Comparaison à durée constante pour les identifiants de .env.local. */
function sameText(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * Vérifie un couple e-mail / mot de passe.
 * Renvoie la version de session à mettre dans le cookie, ou null si les identifiants sont faux.
 */
export async function checkCredentials(email: string, password: string): Promise<number | null> {
  const stored = await getStoredCredentials();
  const mail = email.trim().toLowerCase();
  if (stored) {
    const ok = mail === stored.email.toLowerCase() && (await verifyHash(password, stored.password_hash));
    return ok ? stored.session_version : null;
  }
  const envEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!envEmail || !envPassword) return null;
  return mail === envEmail && sameText(password, envPassword) ? 0 : null;
}

export const sessionValue = (version: number) => `${process.env.ADMIN_TOKEN}.${version}`;

/** Le cookie est-il celui d'une session admin encore valable ? */
export async function isValidSession(cookie: string | undefined): Promise<boolean> {
  const token = process.env.ADMIN_TOKEN;
  if (!cookie || !token) return false;
  const dot = cookie.lastIndexOf(".");
  if (dot < 0 || !sameText(cookie.slice(0, dot), token)) return false;
  const stored = await getStoredCredentials();
  return Number(cookie.slice(dot + 1)) === (stored?.session_version ?? 0);
}

/** E-mail de connexion actuel (base, sinon .env.local). */
export async function currentAdminEmail(): Promise<string> {
  return (await getStoredCredentials())?.email ?? process.env.ADMIN_EMAIL ?? "";
}

/**
 * Enregistre de nouveaux identifiants et augmente la version de session.
 * Renvoie la nouvelle version, à poser dans le cookie de l'appareil courant.
 */
export async function storeCredentials(email: string, password: string): Promise<{ version?: number; error?: string }> {
  const stored = await getStoredCredentials();
  const version = (stored?.session_version ?? 0) + 1;
  const { error } = await serviceClient()
    .from("admin_credentials")
    .upsert({
      id: 1,
      email: email.trim().toLowerCase(),
      password_hash: await hashPassword(password),
      session_version: version,
      updated_at: new Date().toISOString(),
    });
  if (error) return { error: error.message };
  return { version };
}
