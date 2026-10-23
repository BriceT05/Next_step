/**
 * Textes par défaut des pages légales (repris tels quels des pages de mai 2025).
 * Modifiables dans Admin > Pages légales ; format : voir components/RichText.tsx
 * (## intertitre, - liste, [texte](lien)).
 */

export type LegalPage = { updated: string; body: string };

export const DEFAULT_MENTIONS: LegalPage = {
  updated: "mai 2025",
  body: `## 1. Éditeur du site

- Nom : Next Step.sn
- Nature : Organisation de jeunesse à but non lucratif
- Siège social : Dakar, Sénégal
- E-mail : nextstep2k25@gmail.com
- Téléphone : +221 71 050 65 88 / +221 77 860 51 82
- Année de création : 2025

## 2. Hébergement

- Hébergeur : Vercel Inc.
- Adresse : 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis
- Site : [vercel.com](https://vercel.com)

## 3. Propriété intellectuelle

L'ensemble du contenu de ce site (textes, images, logos, graphismes, vidéos) est la propriété exclusive de Next Step.sn, sauf mention contraire. Toute reproduction, distribution ou utilisation sans autorisation écrite préalable est strictement interdite.

Les logos des partenaires affichés sur ce site restent la propriété de leurs organisations respectives et sont utilisés avec leur accord.

## 4. Responsabilité

Next Step.sn s'efforce de maintenir les informations de ce site à jour et exactes. Cependant, nous ne pouvons garantir l'exactitude, l'exhaustivité ou l'actualité des informations diffusées.

Next Step.sn ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ce site ou de l'impossibilité d'y accéder.

## 5. Liens externes

Ce site peut contenir des liens vers des sites tiers. Next Step.sn n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leurs pratiques en matière de confidentialité.

## 6. Données personnelles

Le traitement de vos données personnelles est décrit dans notre [Politique de confidentialité](/politique-de-confidentialite).

## 7. Droit applicable

Les présentes mentions légales sont régies par le droit sénégalais. Tout litige relatif à l'utilisation de ce site sera soumis à la compétence exclusive des tribunaux de Dakar, Sénégal.`,
};

export const DEFAULT_PRIVACY: LegalPage = {
  updated: "mai 2025",
  body: `## 1. Présentation

Next Step.sn est une organisation de jeunesse basée à Dakar, Sénégal, engagée dans l'accompagnement, la formation et la valorisation des jeunes leaders, entrepreneurs et innovateurs africains.

La présente politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos données personnelles lorsque vous utilisez notre site web nextstep.sn.

## 2. Données collectées

Nous collectons uniquement les informations que vous nous fournissez volontairement :

- Nom et prénom (formulaire d'inscription)
- Adresse email (formulaire d'inscription et newsletter)
- Numéro de téléphone (facultatif)
- Message libre (formulaire de contact)

Nous ne collectons aucune donnée de navigation, cookie de traçage ou donnée sensible.

## 3. Utilisation des données

Les informations collectées sont utilisées exclusivement pour :

- Traiter votre demande d'adhésion ou de participation
- Vous envoyer des informations sur nos activités et événements
- Vous recontacter suite à votre demande de partenariat
- Gérer notre newsletter

## 4. Conservation et sécurité

Vos données sont conservées le temps nécessaire à la finalité pour laquelle elles ont été collectées, et au maximum 3 ans après votre dernier contact avec notre organisation.

Nous prenons toutes les mesures raisonnables pour protéger vos informations contre tout accès non autorisé, modification, divulgation ou destruction.

## 5. Partage des données

Next Step.sn ne vend, ne loue et ne partage pas vos données personnelles avec des tiers, sauf obligation légale ou avec votre consentement explicite.

## 6. Vos droits

Conformément aux réglementations applicables, vous disposez des droits suivants :

- Droit d'accès à vos données personnelles
- Droit de rectification en cas d'inexactitude
- Droit de suppression (droit à l'oubli)
- Droit d'opposition au traitement de vos données
- Droit à la portabilité de vos données

Pour exercer ces droits, contactez-nous à : nextstep2k25@gmail.com

## 7. Contact

- Next Step.sn
- Dakar, Sénégal
- Email : nextstep2k25@gmail.com
- Tél : +221 71 050 65 88 / +221 77 860 51 82`,
};
