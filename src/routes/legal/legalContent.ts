import type { Language } from '../../lib/i18n/translations';

export type LegalDoc = 'privacy' | 'terms' | 'notice';

interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalPageContent {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

const PORTFOLIO = 'https://moussandou.github.io/Portfolio/';
export const AUTHOR = 'Mroivili Moussandou';
export const PORTFOLIO_URL = PORTFOLIO;
const UPDATED = 'June 2026';
const UPDATED_FR = 'juin 2026';

export const legalContent: Record<LegalDoc, Record<Language, LegalPageContent>> = {
  privacy: {
    en: {
      title: 'Privacy Policy',
      updated: UPDATED,
      intro:
        'Scanron is a fan-made tool that generates Dragon Ball Legends search codes. This page explains what data it handles and how.',
      sections: [
        {
          heading: 'Data stored on your device',
          body: [
            "By default Scanron runs in local mode. Your accounts, friend codes, language and clock-offset settings are saved in your browser's local storage and never leave your device.",
            'Clearing your browser data removes all of it.',
          ],
        },
        {
          heading: 'Optional cloud sync',
          body: [
            'If you sign in with Google or Discord, your accounts, friend codes and notification settings are stored in Google Firebase (Firestore) so they sync across your devices.',
            'Authentication is handled by Firebase Authentication. We never see or store your password.',
          ],
        },
        {
          heading: 'Discord notifications',
          body: [
            'If you enable Discord notifications, the webhook URL you provide is saved with your settings and used only to post codes to the channel you chose. You can remove it at any time.',
          ],
        },
        {
          heading: 'What we do not do',
          body: [
            'No analytics, no advertising, no tracking cookies, and we never sell or share your data. QR generation runs entirely in your browser.',
          ],
        },
        {
          heading: 'Your control',
          body: [
            'You can export or import your data from Settings, and delete an account — with its codes — at any time. Clearing local storage wipes everything stored on the device.',
          ],
        },
        {
          heading: 'Contact',
          body: ['Questions about privacy? Reach the author via the portfolio linked in the footer.'],
        },
      ],
    },
    fr: {
      title: 'Politique de confidentialité',
      updated: UPDATED_FR,
      intro:
        "Scanron est un outil créé par des fans qui génère des codes de recherche pour Dragon Ball Legends. Cette page explique quelles données il traite et comment.",
      sections: [
        {
          heading: 'Données stockées sur votre appareil',
          body: [
            "Par défaut, Scanron fonctionne en mode local. Vos comptes, codes d'ami, langue et réglage de décalage d'horloge sont enregistrés dans le stockage local de votre navigateur et ne quittent jamais votre appareil.",
            'Effacer les données de votre navigateur les supprime entièrement.',
          ],
        },
        {
          heading: 'Synchronisation cloud optionnelle',
          body: [
            "Si vous vous connectez avec Google ou Discord, vos comptes, codes d'ami et préférences de notification sont stockés dans Google Firebase (Firestore) pour être synchronisés entre vos appareils.",
            "L'authentification est gérée par Firebase Authentication. Nous ne voyons ni ne stockons jamais votre mot de passe.",
          ],
        },
        {
          heading: 'Notifications Discord',
          body: [
            "Si vous activez les notifications Discord, l'URL du webhook que vous fournissez est enregistrée avec vos réglages et utilisée uniquement pour publier des codes dans le salon choisi. Vous pouvez la retirer à tout moment.",
          ],
        },
        {
          heading: 'Ce que nous ne faisons pas',
          body: [
            "Aucune analyse d'audience, aucune publicité, aucun cookie de pistage, et nous ne vendons ni ne partageons jamais vos données. La génération des QR se fait entièrement dans votre navigateur.",
          ],
        },
        {
          heading: 'Votre contrôle',
          body: [
            "Vous pouvez exporter ou importer vos données depuis les Réglages, et supprimer un compte — avec ses codes — à tout moment. Effacer le stockage local supprime tout ce qui est enregistré sur l'appareil.",
          ],
        },
        {
          heading: 'Contact',
          body: ["Des questions sur la confidentialité ? Contactez l'auteur via le portfolio en pied de page."],
        },
      ],
    },
  },
  terms: {
    en: {
      title: 'Terms of Use',
      updated: UPDATED,
      intro: 'By using Scanron you agree to these terms.',
      sections: [
        {
          heading: 'The service',
          body: [
            'Scanron is a free, fan-made utility that computes Dragon Ball Legends search codes and QR images locally in your browser. It does not connect to the game or to any game account.',
          ],
        },
        {
          heading: 'No affiliation',
          body: [
            'Scanron is not affiliated with, endorsed by, or associated with Bandai Namco Entertainment or the Dragon Ball Legends franchise. All trademarks belong to their respective owners.',
          ],
        },
        {
          heading: 'Provided as is',
          body: [
            "The tool is provided 'as is', without warranty of any kind. Generated codes depend on your device clock and the game's rules, so we cannot guarantee they will always be accepted.",
          ],
        },
        {
          heading: 'Acceptable use',
          body: [
            'Use Scanron for your own legitimate play. Do not use it to abuse, disrupt, or violate the terms of service of Dragon Ball Legends or any third-party service.',
          ],
        },
        {
          heading: 'Changes',
          body: ['These terms may change as the tool evolves. Continued use means you accept the current version.'],
        },
      ],
    },
    fr: {
      title: "Conditions d'utilisation",
      updated: UPDATED_FR,
      intro: 'En utilisant Scanron, vous acceptez ces conditions.',
      sections: [
        {
          heading: 'Le service',
          body: [
            "Scanron est un utilitaire gratuit, créé par des fans, qui calcule des codes de recherche et des images QR de Dragon Ball Legends localement dans votre navigateur. Il ne se connecte ni au jeu ni à aucun compte de jeu.",
          ],
        },
        {
          heading: 'Aucune affiliation',
          body: [
            "Scanron n'est ni affilié, ni approuvé, ni associé à Bandai Namco Entertainment ou à la franchise Dragon Ball Legends. Toutes les marques appartiennent à leurs propriétaires respectifs.",
          ],
        },
        {
          heading: 'Fourni « tel quel »',
          body: [
            "L'outil est fourni « tel quel », sans garantie d'aucune sorte. Les codes générés dépendent de l'horloge de votre appareil et des règles du jeu ; nous ne pouvons pas garantir qu'ils seront toujours acceptés.",
          ],
        },
        {
          heading: 'Usage acceptable',
          body: [
            "Utilisez Scanron pour votre propre jeu légitime. Ne l'utilisez pas pour abuser, perturber ou enfreindre les conditions d'utilisation de Dragon Ball Legends ou de tout service tiers.",
          ],
        },
        {
          heading: 'Modifications',
          body: ["Ces conditions peuvent évoluer avec l'outil. Continuer à l'utiliser vaut acceptation de la version en vigueur."],
        },
      ],
    },
  },
  notice: {
    en: {
      title: 'Legal Notice',
      updated: UPDATED,
      intro: 'Publication details for this site.',
      sections: [
        {
          heading: 'Publisher',
          body: [`Scanron is published by ${AUTHOR} as a personal, non-commercial fan project.`],
        },
        {
          heading: 'Contact',
          body: ["Via the author's portfolio linked in the footer."],
        },
        {
          heading: 'Hosting',
          body: [
            'This site is a static web application. Optional backend services (authentication and sync) are provided by Google Firebase.',
          ],
        },
        {
          heading: 'Intellectual property',
          body: [
            'Dragon Ball, Dragon Ball Legends and related names and logos are trademarks of their respective owners. Scanron claims no ownership over them and is a fan-made, non-commercial tool.',
          ],
        },
      ],
    },
    fr: {
      title: 'Mentions légales',
      updated: UPDATED_FR,
      intro: 'Informations de publication de ce site.',
      sections: [
        {
          heading: 'Éditeur',
          body: [`Scanron est édité par ${AUTHOR} dans le cadre d'un projet de fan personnel et non commercial.`],
        },
        {
          heading: 'Contact',
          body: ["Via le portfolio de l'auteur, en pied de page."],
        },
        {
          heading: 'Hébergement',
          body: [
            "Ce site est une application web statique. Les services optionnels (authentification et synchronisation) sont fournis par Google Firebase.",
          ],
        },
        {
          heading: 'Propriété intellectuelle',
          body: [
            "Dragon Ball, Dragon Ball Legends ainsi que les noms et logos associés sont des marques de leurs propriétaires respectifs. Scanron ne revendique aucun droit sur ceux-ci et reste un outil de fans, non commercial.",
          ],
        },
      ],
    },
  },
};
