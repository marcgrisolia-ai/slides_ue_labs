// Data-only localization payload for certification content; layout remains in HTML/CSS.
const CERTIFICATIONS_I18N = {
  en: {
    locale: "en",
    languageLabel: "English",
    copy: {
      kicker: "Certification scope",
      title: "Standards & Certification Scope",
      subtitle: "Original standards rebuilt as a capability matrix by lab.",
      scopeCard: {
        kicker: "UL CTDP",
        title: "Capellades Lab has been CTDP-recognized by UL since 1999, file DA307.",
        body:
          "Tests according to UL standards can be performed with full autonomy and direct recognition by Underwriters Laboratories Inc.",
        emphasis: "UL / CSA recognition remains attached to KP in the matrix.",
      },
      capellades: {
        kicker: "KP validation scope",
        title: "PanelSeT Steel validation and certification",
        body:
          "Capellades Lab supports metal enclosure production verification with UL CTDP recognition for qualified testing autonomy.",
        validationLabel: "Validated in Capellades",
        validationNote: "PanelSeT Steel verification and UL CTDP certification capability.",
        productKicker: "3D product family",
        productCaption: "3D PanelSeT Steel example",
        certificateKicker: "Certification capability",
        certificateCaption: "UL CTDP recognition, file DA307.",
      },
      matrix: {
        labs: {
          su: { code: "SU", name: "Sarre-Union" },
          ml: { code: "ML", name: "Molins de Rei" },
          kp: { code: "KP", name: "Capellades" },
        },
        rows: {
          iec: "IEC",
          iso: "ISO",
          en: "EN",
          ulCsa: "UL / CSA",
        },
        cells: {
          su: {
            iec: ["IEC 62208", "IEC 60079-0"],
            iso: ["ISO 12944-6", "ISO 4624"],
            en: ["EN 61386-1"],
            ulCsa: [],
          },
          ml: {
            iec: ["IEC 62208", "IEC 61439-1", "IEC 61439-5"],
            iso: [],
            en: [],
            ulCsa: [],
          },
          kp: {
            iec: ["IEC 62208"],
            iso: ["ISO 12944-6"],
            en: [],
            ulCsa: ["UL 50 / CSA C22.2 N° 94.1", "UL 50E / CSA C22.2 N° 94.2", "UL 746 C"],
          },
        },
      },
      footer: {
        confidentiality: "© 2026 Schneider Electric, All Rights Reserved | Confidential Property of Schneider Electric",
        page: "Page 10",
      },
    },
    ariaLabels: {
      section: "Certification scope slide",
      scopeCard: "UL CTDP certification capability for Capellades Lab",
      certificateImage: "Certificate of Participation issued by UL LLC to Schneider Electric Espana S A",
      capelladesModel: "PanelSeT Steel enclosure family 3D model",
      capelladesFacts: "Capellades Lab focus areas",
      capelladesScope: "Capellades Lab validation and certification scope",
      matrix: "Certification standards by lab",
      labs: {
        su: "Sarre-Union Lab standards column",
        ml: "Molins de Rei Lab standards column",
        kp: "Capellades Lab standards column",
      },
      rows: {
        iec: "IEC standards row",
        iso: "ISO standards row",
        en: "EN standards row",
        ulCsa: "UL and CSA standards row",
      },
      cells: {
        suIec: "IEC standards for Sarre-Union Lab: IEC 62208 and IEC 60079-0",
        suIso: "ISO standards for Sarre-Union Lab: ISO 12944-6 and ISO 4624",
        suEn: "EN standard for Sarre-Union Lab: EN 61386-1",
        suUlCsa: "No UL or CSA standards listed for Sarre-Union Lab",
        mlIec: "IEC standards for Molins de Rei Lab: IEC 62208, IEC 61439-1 and IEC 61439-5",
        mlIso: "No ISO standards listed for Molins de Rei Lab",
        mlEn: "No EN standards listed for Molins de Rei Lab",
        mlUlCsa: "No UL or CSA standards listed for Molins de Rei Lab",
        kpIec: "IEC standard for Capellades Lab: IEC 62208",
        kpIso: "ISO standard for Capellades Lab: ISO 12944-6",
        kpEn: "No EN standards listed for Capellades Lab",
        kpUlCsa:
          "UL and CSA standards for Capellades Lab: UL 50 / CSA C22.2 N° 94.1, UL 50E / CSA C22.2 N° 94.2 and UL 746 C",
      },
      standardLogos: {
        iec: "IEC logo",
        iso: "ISO logo",
        en: "EN standards logo",
        ul: "UL logo",
        csa: "CSA logo",
      },
    },
    tooltips: {
      matrix: "Codes are grouped by laboratory and standards family; full descriptions are preserved in the notes.",
      ctdp: "Client Test Data Program: UL recognition for qualified testing performed by Capellades Lab.",
      da307: "UL file number DA307 identifies the Capellades CTDP recognition.",
      ulCsaRecognition: "The visible matrix keeps UL / CSA capability linked to KP, the Capellades Lab.",
      labs: {
        su: "Sarre-Union Lab: PanelSeT and enclosure validation scope.",
        ml: "Molins de Rei Lab: ClimaSys and thermal management validation scope.",
        kp: "Capellades Lab: PanelSeT Steel verification and UL CTDP capability.",
      },
      rows: {
        iec: "International Electrotechnical Commission standards.",
        iso: "International Organization for Standardization standards.",
        en: "European standard reference.",
        ulCsa: "UL and CSA certification standards for electrical enclosures and polymeric materials.",
      },
      standards: {
        "IEC 62208":
          "Empty enclosures for low-voltage switchgear and controlgear assemblies - General requirements.",
        "IEC 60079-0": "Explosive atmospheres - Part 0: Equipment - General requirements.",
        "IEC 61439-1":
          "Low-voltage switchgear and controlgear assemblies - Part 1: General rules.",
        "IEC 61439-5":
          "Low-voltage switchgear and controlgear assemblies - Part 5: Assemblies for power distribution in public networks.",
        "ISO 12944-6":
          "Paints and varnishes - Corrosion protection of steel structures by protective paint systems - Part 6: Laboratory performance test methods.",
        "ISO 4624": "Paints and varnishes - Pull-off test for adhesion.",
        "EN 61386-1": "Conduit systems for cable management - Part 1: General requirements.",
        "UL 50 / CSA C22.2 N° 94.1":
          "Enclosures for Electrical Equipment, Non-Environmental Considerations.",
        "UL 50E / CSA C22.2 N° 94.2":
          "Enclosures for Electrical Equipment, Environmental Considerations.",
        "UL 746 C": "Polymeric Materials - Use in Electrical Equipment Evaluations.",
      },
    },
    notesTexts: {
      title: "Speaker notes - standards scope",
      summary:
        "The slide keeps the certification scope readable by showing standard codes in a lab matrix. These notes preserve the full standard descriptions and the UL CTDP context.",
      sections: [
        {
          id: "su",
          title: "Sarre-Union Lab (SU)",
          items: [
            "IEC 62208 - Empty enclosures for low-voltage switchgear and controlgear assemblies - General requirements.",
            "ISO 12944-6 - Paints and varnishes - Corrosion protection of steel structures by protective paint systems - Part 6: Laboratory performance test methods.",
            "ISO 4624 - Paints and varnishes - Pull-off test for adhesion.",
            "IEC 60079-0 - Explosive atmospheres - Part 0: Equipment - General requirements.",
            "EN 61386-1 - Conduit systems for cable management - Part 1: General requirements.",
          ],
        },
        {
          id: "ml",
          title: "Molins de Rei Lab (ML)",
          items: [
            "IEC 62208 - Empty enclosures for low-voltage switchgear and controlgear assemblies - General requirements.",
            "IEC 61439-1 - Low-voltage switchgear and controlgear assemblies - Part 1: General rules.",
            "IEC 61439-5 - Low-voltage switchgear and controlgear assemblies - Part 5: Assemblies for power distribution in public networks.",
          ],
        },
        {
          id: "kp",
          title: "Capellades Lab (KP)",
          items: [
            "IEC 62208 - Empty enclosures for low-voltage switchgear and controlgear assemblies - General requirements.",
            "ISO 12944-6 - Paints and varnishes - Corrosion protection of steel structures by protective paint systems - Part 6: Laboratory performance test methods.",
            "UL 50 / CSA C22.2 N° 94.1 - Enclosures for Electrical Equipment, Non-Environmental Considerations.",
            "UL 50E / CSA C22.2 N° 94.2 - Enclosures for Electrical Equipment, Environmental Considerations.",
            "UL 746 C - Polymeric Materials - Use in Electrical Equipment Evaluations.",
            "Capellades Lab has been CTDP-recognized by UL since 1999, file DA307. Tests according to UL standards can be performed with full autonomy and direct recognition by Underwriters Laboratories Inc.",
          ],
        },
      ],
    },
  },
  fr: {
    locale: "fr-FR",
    languageLabel: "Français",
    copy: {
      kicker: "Périmètre de certification",
      title: "Périmètre des normes et certifications",
      subtitle: "Normes d'origine réorganisées sous forme de matrice de capacités par laboratoire.",
      scopeCard: {
        kicker: "UL CTDP",
        title: "Capellades Lab est reconnu CTDP par UL depuis 1999, numéro de dossier DA307.",
        body:
          "Les essais conformes aux normes UL peuvent être réalisés en autonomie complète, avec reconnaissance directe par Underwriters Laboratories Inc.",
        emphasis: "La reconnaissance UL / CSA reste associée à KP dans la matrice.",
      },
      capellades: {
        kicker: "Périmètre de validation KP",
        title: "Validation et certification PanelSeT Steel",
        body:
          "Capellades Lab prend en charge la vérification de production des coffrets métalliques avec une reconnaissance UL CTDP pour une autonomie d'essais qualifiée.",
        validationLabel: "Validé à Capellades",
        validationNote: "Vérification PanelSeT Steel et capacité de certification UL CTDP.",
        productKicker: "Famille produit 3D",
        productCaption: "Exemple 3D PanelSeT Steel",
        certificateKicker: "Capacité de certification",
        certificateCaption: "Reconnaissance UL CTDP, numéro de dossier DA307.",
      },
      matrix: {
        labs: {
          su: { code: "SU", name: "Sarre-Union" },
          ml: { code: "ML", name: "Molins de Rei" },
          kp: { code: "KP", name: "Capellades" },
        },
        rows: {
          iec: "IEC",
          iso: "ISO",
          en: "EN",
          ulCsa: "UL / CSA",
        },
        cells: {
          su: {
            iec: ["IEC 62208", "IEC 60079-0"],
            iso: ["ISO 12944-6", "ISO 4624"],
            en: ["EN 61386-1"],
            ulCsa: [],
          },
          ml: {
            iec: ["IEC 62208", "IEC 61439-1", "IEC 61439-5"],
            iso: [],
            en: [],
            ulCsa: [],
          },
          kp: {
            iec: ["IEC 62208"],
            iso: ["ISO 12944-6"],
            en: [],
            ulCsa: ["UL 50 / CSA C22.2 N° 94.1", "UL 50E / CSA C22.2 N° 94.2", "UL 746 C"],
          },
        },
      },
      footer: {
        confidentiality:
          "© 2026 Schneider Electric. Tous droits réservés | Propriété confidentielle de Schneider Electric",
        page: "Page 10",
      },
    },
    ariaLabels: {
      section: "Diapositive du périmètre de certification",
      scopeCard: "Capacité de certification UL CTDP du Capellades Lab",
      certificateImage: "Certificate of Participation délivré par UL LLC à Schneider Electric Espana S A",
      capelladesModel: "Modèle 3D de la famille de coffrets PanelSeT Steel",
      capelladesFacts: "Domaines de spécialisation du Capellades Lab",
      capelladesScope: "Périmètre de validation et de certification du Capellades Lab",
      matrix: "Normes de certification par laboratoire",
      labs: {
        su: "Colonne des normes du Sarre-Union Lab",
        ml: "Colonne des normes du Molins de Rei Lab",
        kp: "Colonne des normes du Capellades Lab",
      },
      rows: {
        iec: "Ligne des normes IEC",
        iso: "Ligne des normes ISO",
        en: "Ligne des normes EN",
        ulCsa: "Ligne des normes UL et CSA",
      },
      cells: {
        suIec: "Normes IEC du Sarre-Union Lab : IEC 62208 et IEC 60079-0",
        suIso: "Normes ISO du Sarre-Union Lab : ISO 12944-6 et ISO 4624",
        suEn: "Norme EN du Sarre-Union Lab : EN 61386-1",
        suUlCsa: "Aucune norme UL ou CSA listée pour le Sarre-Union Lab",
        mlIec: "Normes IEC du Molins de Rei Lab : IEC 62208, IEC 61439-1 et IEC 61439-5",
        mlIso: "Aucune norme ISO listée pour le Molins de Rei Lab",
        mlEn: "Aucune norme EN listée pour le Molins de Rei Lab",
        mlUlCsa: "Aucune norme UL ou CSA listée pour le Molins de Rei Lab",
        kpIec: "Norme IEC du Capellades Lab : IEC 62208",
        kpIso: "Norme ISO du Capellades Lab : ISO 12944-6",
        kpEn: "Aucune norme EN listée pour le Capellades Lab",
        kpUlCsa:
          "Normes UL et CSA du Capellades Lab : UL 50 / CSA C22.2 N° 94.1, UL 50E / CSA C22.2 N° 94.2 et UL 746 C",
      },
      standardLogos: {
        iec: "Logo IEC",
        iso: "Logo ISO",
        en: "Logo des normes EN",
        ul: "Logo UL",
        csa: "Logo CSA",
      },
    },
    tooltips: {
      matrix:
        "Les codes sont regroupés par laboratoire et par famille de normes ; les descriptions complètes sont conservées dans les notes.",
      ctdp:
        "Client Test Data Program : reconnaissance UL permettant au Capellades Lab de réaliser des essais qualifiés.",
      da307: "Le numéro de dossier UL DA307 identifie la reconnaissance CTDP de Capellades.",
      ulCsaRecognition: "La matrice visible maintient la capacité UL / CSA rattachée à KP, le Capellades Lab.",
      labs: {
        su: "Sarre-Union Lab : périmètre de validation PanelSeT et coffrets.",
        ml: "Molins de Rei Lab : périmètre de validation ClimaSys et gestion thermique.",
        kp: "Capellades Lab : vérification PanelSeT Steel et capacité UL CTDP.",
      },
      rows: {
        iec: "Normes de l'International Electrotechnical Commission.",
        iso: "Normes de l'International Organization for Standardization.",
        en: "Référence de norme européenne.",
        ulCsa: "Normes UL et CSA pour enveloppes électriques et matériaux polymères.",
      },
      standards: {
        "IEC 62208":
          "Enveloppes vides destinées aux ensembles d'appareillage à basse tension - Exigences générales.",
        "IEC 60079-0": "Atmosphères explosives - Partie 0 : Matériel - Exigences générales.",
        "IEC 61439-1":
          "Ensembles d'appareillage à basse tension - Partie 1 : Règles générales.",
        "IEC 61439-5":
          "Ensembles d'appareillage à basse tension - Partie 5 : Ensembles pour réseaux de distribution publique.",
        "ISO 12944-6":
          "Peintures et vernis - Anticorrosion des structures en acier par systèmes de peinture - Partie 6 : Essais de performance en laboratoire.",
        "ISO 4624": "Peintures et vernis - Essai de traction, utilisé pour déterminer l'adhérence.",
        "EN 61386-1": "Systèmes de conduits pour la gestion du câblage - Partie 1 : Exigences générales.",
        "UL 50 / CSA C22.2 N° 94.1":
          "Enveloppes pour équipements électriques - considérations non environnementales.",
        "UL 50E / CSA C22.2 N° 94.2":
          "Enveloppes pour équipements électriques - considérations environnementales.",
        "UL 746 C":
          "Matériaux polymères - utilisation dans les évaluations d'équipements électriques.",
      },
    },
    notesTexts: {
      title: "Notes orateur - périmètre des normes",
      summary:
        "La diapositive conserve la lisibilité du périmètre de certification en affichant les codes normatifs dans une matrice par laboratoire. Ces notes conservent les descriptions complètes des normes et le contexte UL CTDP.",
      sections: [
        {
          id: "su",
          title: "Sarre-Union Lab (SU)",
          items: [
            "IEC 62208 - Enveloppes vides destinées aux ensembles d'appareillage à basse tension - Exigences générales.",
            "ISO 12944-6 - Peintures et vernis - Anticorrosion des structures en acier par systèmes de peinture - Partie 6 : Essais de performance en laboratoire.",
            "ISO 4624 - Peintures et vernis - Essai de traction pour déterminer l'adhérence.",
            "IEC 60079-0 - Atmosphères explosives - Partie 0 : Matériel - Exigences générales.",
            "EN 61386-1 - Systèmes de conduits pour la gestion du câblage - Partie 1 : Exigences générales.",
          ],
        },
        {
          id: "ml",
          title: "Molins de Rei Lab (ML)",
          items: [
            "IEC 62208 - Enveloppes vides destinées aux ensembles d'appareillage à basse tension - Exigences générales.",
            "IEC 61439-1 - Ensembles d'appareillage à basse tension - Partie 1 : Règles générales.",
            "IEC 61439-5 - Ensembles d'appareillage à basse tension - Partie 5 : Ensembles pour réseaux de distribution publique.",
          ],
        },
        {
          id: "kp",
          title: "Capellades Lab (KP)",
          items: [
            "IEC 62208 - Enveloppes vides destinées aux ensembles d'appareillage à basse tension - Exigences générales.",
            "ISO 12944-6 - Peintures et vernis - Anticorrosion des structures en acier par systèmes de peinture - Partie 6 : Essais de performance en laboratoire.",
            "UL 50 / CSA C22.2 N° 94.1 - Enveloppes pour équipements électriques, considérations non environnementales.",
            "UL 50E / CSA C22.2 N° 94.2 - Enveloppes pour équipements électriques, considérations environnementales.",
            "UL 746 C - Matériaux polymères - utilisation dans les évaluations d'équipements électriques.",
            "Capellades Lab est reconnu CTDP par UL depuis 1999, numéro de dossier DA307. Les essais conformes aux normes UL peuvent être réalisés en autonomie complète, avec reconnaissance directe par Underwriters Laboratories Inc.",
          ],
        },
      ],
    },
  },
};

if (typeof globalThis !== "undefined") {
  globalThis.CERTIFICATIONS_I18N = CERTIFICATIONS_I18N;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = CERTIFICATIONS_I18N;
}
