"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

const roles = [
  { value: "membre", label: "Membre", desc: "Rejoindre la communauté NS" },
  { value: "benevole", label: "Bénévole", desc: "Contribuer à nos activités" },
  { value: "partenaire", label: "Partenaire", desc: "Collaborer avec nous" },
  { value: "participant", label: "Participant", desc: "S'inscrire à un événement" },
];

const WHATSAPP_NUMBERS = [
  { label: "Contact 1", number: "221710506588" },
  { label: "Contact 2", number: "221778605182" },
];

export default function Join() {
  const [role, setRole] = useState("membre");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [waMessage, setWaMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roleLabel = roles.find((r) => r.value === role)?.label ?? role;
    const text = [
      "Nouvelle candidature — Next Step.sn",
      "",
      `Rôle : ${roleLabel}`,
      `Nom : ${name}`,
      `Email : ${email}`,
      phone ? `Téléphone : ${phone}` : null,
      message ? `Message : ${message}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    setWaMessage(encodeURIComponent(text));
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setRole("membre");
    setWaMessage("");
  };

  return (
    <section id="join" className="py-24 relative section-divider overflow-hidden bg-[#182426]">
      <Image src="/bg-boat.jpg" alt="" fill className="object-cover object-center" sizes="100vw" />
      <div className="absolute inset-0 bg-[#182426]/80" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[#D9A657] text-sm font-semibold tracking-widest uppercase">
              Faites partie de l&apos;aventure
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-6">
              Rejoindre{" "}
              <span className="gradient-text">Next Step.sn</span>
            </h2>
            <p className="text-white/75 text-lg leading-relaxed mb-8">
              Que vous soyez entrepreneur, étudiant, professionnel ou institution,
              il y a une place pour vous au sein de Next Step.sn. Ensemble, bâtissons
              l&apos;Afrique de demain.
            </p>

            <div className="space-y-4">
              {[
                { icon: "✅", text: "Accès à un réseau de leaders africains" },
                { icon: "✅", text: "Formations et ateliers exclusifs" },
                { icon: "✅", text: "Opportunités de financement et mentorat" },
                { icon: "✅", text: "Participation à nos événements phares" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-3 text-white/90">
                  <span className="text-[#12A89D]">{b.icon}</span>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-[#182426] mb-2">Candidature prête !</h3>
                  <p className="text-[#5A6A70] mb-8">
                    Clique sur un bouton ci-dessous pour envoyer ta candidature via WhatsApp.
                  </p>
                  <div className="flex flex-col gap-3">
                    {WHATSAPP_NUMBERS.map((c) => (
                      <a
                        key={c.number}
                        href={`https://wa.me/${c.number}?text=${waMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-xl font-bold text-base hover:bg-[#1ebe5d] transition-all shadow-lg shadow-[#25D366]/20"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Envoyer via WhatsApp — {c.label}
                      </a>
                    ))}
                  </div>
                  <button
                    onClick={resetForm}
                    className="mt-5 text-gray-400 text-sm hover:text-gray-600 transition-colors underline"
                  >
                    Nouvelle candidature
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Role selection */}
                  <div>
                    <label className="text-[#5A6A70] text-sm font-medium mb-3 block">
                      Je souhaite rejoindre en tant que
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {roles.map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setRole(r.value)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            role === r.value
                              ? "border-[#D9A657] bg-[#D9A657]/10"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className={`text-sm font-bold ${
                              role === r.value ? "text-[#D9A657]" : "text-[#182426]"
                            }`}
                          >
                            {r.label}
                          </div>
                          <div className="text-gray-500 text-xs mt-0.5">{r.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#5A6A70] text-sm mb-1.5 block">Prénom & Nom *</label>
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Votre nom complet"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#182426] text-sm placeholder-gray-400 focus:outline-none focus:border-[#12A89D]/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[#5A6A70] text-sm mb-1.5 block">Email *</label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#182426] text-sm placeholder-gray-400 focus:outline-none focus:border-[#12A89D]/60 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-1.5 block">Téléphone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+221 77 XXX XX XX"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#182426] text-sm placeholder-gray-400 focus:outline-none focus:border-[#12A89D]/60 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-1.5 block">Message</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Présentez-vous et dites-nous pourquoi vous souhaitez rejoindre Next Step.sn..."
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#182426] text-sm placeholder-gray-400 focus:outline-none focus:border-[#12A89D]/60 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#D9A657] to-[#c49040] text-[#182426] py-4 rounded-xl font-bold text-base hover:scale-[1.02] transition-all shadow-lg shadow-[#D9A657]/20"
                  >
                    Envoyer ma candidature
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
