db = db.getSiblingDB("crimelab");

const affaires = [
  {
    description: "Braquage d'une bijouterie",
    individus: ["i1", "i3"],
    temoignages: [
      {
        auteur: "Marie Curie",
        date: "2024-02-01",
        recit: "J'ai vu deux hommes s'enfuir en voiture après le braquage.",
      },
      {
        auteur: "Albert Einstein",
        date: "2024-02-01",
        recit: "Ils portaient des vêtements sombres et des gants.",
      },
    ],
    lieux: [
      {
        ville: "Paris",
        adresse: "Rue de la Paix",
        code_postal: "75002",
        coordonnees: { lat: 48.8698, lon: 2.3076 },
      },
    ],
  },
  {
    description: "Disparition mystérieuse",
    individus: ["i1"],
    temoignages: [
      {
        auteur: "Isaac Newton",
        date: "2024-01-20",
        recit: "La dernière fois que je l'ai vu, il se promenait au parc.",
      },
    ],
    lieux: [
      {
        ville: "Paris",
        adresse: "Parc Monceau",
        code_postal: "75008",
        coordonnees: { lat: 48.8799, lon: 2.3091 },
      },
    ],
  },
  {
    description: "Vol dans une épicerie",
    individus: ["i2", "i4"],
    temoignages: [
      {
        auteur: "Charles Darwin",
        date: "2024-02-03",
        recit: "J'ai vu un individu sortir précipitamment avec des sacs remplis d'articles.",
      },
    ],
    lieux: [
      {
        ville: "Lyon",
        adresse: "16 Rue de la République",
        code_postal: "69002",
        coordonnees: { lat: 45.7570, lon: 4.8320 },
      },
    ],
  },
  {
    description: "Incendie suspect",
    individus: ["i5"],
    temoignages: [
      {
        auteur: "Marie Curie",
        date: "2024-01-25",
        recit: "J'ai remarqué des fumées inhabituelles venant de l'immeuble.",
      },
    ],
    lieux: [
      {
        ville: "Paris",
        adresse: "10 Rue de la Victoire",
        code_postal: "75009",
        coordonnees: { lat: 48.8722, lon: 2.3315 },
      },
    ],
  },
  {
    description: "Agression dans une rue",
    individus: ["i3", "i6"],
    temoignages: [
      {
        auteur: "Sigmund Freud",
        date: "2024-02-01",
        recit: "J'ai vu un homme se faire frapper par un autre sous un lampadaire.",
      },
    ],
    lieux: [
      {
        ville: "Paris",
        adresse: "30 Boulevard de Montparnasse",
        code_postal: "75014",
        coordonnees: { lat: 48.8445, lon: 2.3270 },
      },
    ],
  },
  {
    description: "Fraude bancaire",
    individus: ["i7", "i8"],
    temoignages: [
      {
        auteur: "Niels Bohr",
        date: "2024-01-28",
        recit: "Il y a eu une transaction suspecte à une heure tardive sur le compte.",
      },
    ],
    lieux: [
      {
        ville: "Paris",
        adresse: "50 Rue de la Banque",
        code_postal: "75002",
        coordonnees: { lat: 48.8712, lon: 2.3314 },
      },
    ],
  },
  {
    description: "Escroquerie en ligne",
    individus: ["i9", "i10"],
    temoignages: [
      {
        auteur: "Albert Einstein",
        date: "2024-02-02",
        recit: "J'ai reçu un email suspect me demandant de transférer des fonds.",
      },
    ],
    lieux: [
      {
        ville: "Paris",
        adresse: "3 Place de l'Opéra",
        code_postal: "75009",
        coordonnees: { lat: 48.8708, lon: 2.3315 },
      },
    ],
  },
  {
    description: "Disparition d'une personne âgée",
    individus: ["i11"],
    temoignages: [
      {
        auteur: "Marie Curie",
        date: "2024-02-03",
        recit: "Elle a disparu après être allée faire ses courses, personne ne l'a revue depuis.",
      },
    ],
    lieux: [
      {
        ville: "Paris",
        adresse: "20 Rue du Faubourg Saint-Antoine",
        code_postal: "75011",
        coordonnees: { lat: 48.8523, lon: 2.3787 },
      },
    ],
  },
  {
    description: "Collision automobile",
    individus: ["i4", "i12"],
    temoignages: [
      {
        auteur: "Leonard de Vinci",
        date: "2024-01-18",
        recit: "J'ai vu une voiture rouler trop vite et percuter un autre véhicule.",
      },
    ],
    lieux: [
      {
        ville: "Paris",
        adresse: "5 Avenue de la Grande Armée",
        code_postal: "75016",
        coordonnees: { lat: 48.8730, lon: 2.2955 },
      },
    ],
  },
  {
    description: "Attentat à la bombe",
    individus: ["i13", "i14"],
    temoignages: [
      {
        auteur: "Isaac Newton",
        date: "2024-01-15",
        recit: "Il y a eu une explosion dans un café près de la place centrale.",
      },
    ],
    lieux: [
      {
        ville: "Paris",
        adresse: "Place de la Concorde",
        code_postal: "75008",
        coordonnees: { lat: 48.8650, lon: 2.3210 },
      },
    ],
  }
];

db.affaire.insertMany(affaires);
