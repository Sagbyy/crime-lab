db = db.getSiblingDB("crimelab");

const affaires = [
  {
    reference: "AFF-2024-001",
    date: "2024-01-28T10:00:00Z",
    type: "cambriolage",
    description: "Cambriolage d'une voiture dans un parking",
    statut: "en_cours",
    lieu_id: "507f1f77bcf86cd799439012",
    temoignages: [
      {
        date: "2024-01-28T10:30:00Z",
        contenu: "J'ai vu un homme en noir près de la voiture",
        individu_id: "507f1f77bcf86cd799439013",
        fiabilite: 0.8,
      },
    ],
    individus_impliques: [
      {
        individu_id: "507f1f77bcf86cd799439014",
        role: "suspect",
      },
    ],
  },
  {
    reference: "AFF-2024-002",
    date: "2024-01-29T14:00:00Z",
    type: "cambriolage",
    description: "Cambriolage dans une maison",
    statut: "en_cours",
    lieu_id: "507f1f77bcf86cd799439015",
    temoignages: [
      {
        date: "2024-01-29T14:30:00Z",
        contenu: "Une personne masquée est entrée par la fenêtre",
        individu_id: "507f1f77bcf86cd799439016",
        fiabilite: 0.9,
      },
    ],
    individus_impliques: [
      {
        individu_id: "507f1f77bcf86cd799439017",
        role: "suspect",
      },
    ],
  },
  {
    reference: "AFF-2024-003",
    date: "2024-01-30T16:00:00Z",
    type: "agression",
    description: "Agression dans un parc",
    statut: "en_cours",
    lieu_id: "507f1f77bcf86cd799439018",
    temoignages: [
      {
        date: "2024-01-30T16:30:00Z",
        contenu: "J'ai vu une personne attaquer une autre avec un couteau",
        individu_id: "507f1f77bcf86cd799439019",
        fiabilite: 0.85,
      },
    ],
    individus_impliques: [
      {
        individu_id: "507f1f77bcf86cd799439020",
        role: "suspect",
      },
    ],
  },
  {
    reference: "AFF-2024-004",
    date: "2024-02-01T08:00:00Z",
    type: "vol",
    description: "Vol de sacs à main dans un métro",
    statut: "en_cours",
    lieu_id: "507f1f77bcf86cd799439021",
    temoignages: [
      {
        date: "2024-02-01T08:15:00Z",
        contenu: "Une personne a volé un sac dans le wagon",
        individu_id: "507f1f77bcf86cd799439022",
        fiabilite: 0.7,
      },
    ],
    individus_impliques: [
      {
        individu_id: "507f1f77bcf86cd799439023",
        role: "suspect",
      },
    ],
  },
  {
    reference: "AFF-2024-005",
    date: "2024-02-03T18:00:00Z",
    type: "agression",
    description: "Agression avec vol à l'arraché",
    statut: "en_cours",
    lieu_id: "507f1f77bcf86cd799439024",
    temoignages: [
      {
        date: "2024-02-03T18:30:00Z",
        contenu: "L'agresseur a arraché le sac et s'est enfui",
        individu_id: "507f1f77bcf86cd799439025",
        fiabilite: 0.75,
      },
    ],
    individus_impliques: [
      {
        individu_id: "507f1f77bcf86cd799439026",
        role: "suspect",
      },
    ],
  },
  {
    reference: "AFF-2024-006",
    date: "2024-02-05T12:00:00Z",
    type: "cambriolage",
    description: "Cambriolage dans un appartement",
    statut: "en_cours",
    lieu_id: "507f1f77bcf86cd799439027",
    temoignages: [
      {
        date: "2024-02-05T12:30:00Z",
        contenu: "Une personne est entrée par la porte d'entrée",
        individu_id: "507f1f77bcf86cd799439028",
        fiabilite: 0.85,
      },
    ],
    individus_impliques: [
      {
        individu_id: "507f1f77bcf86cd799439029",
        role: "suspect",
      },
    ],
  },
  {
    reference: "AFF-2024-007",
    date: "2024-02-07T09:00:00Z",
    type: "agression",
    description: "Agression dans un supermarché",
    statut: "en_cours",
    lieu_id: "507f1f77bcf86cd799439030",
    temoignages: [
      {
        date: "2024-02-07T09:30:00Z",
        contenu: "Une personne a frappé un employé pour voler de l'argent",
        individu_id: "507f1f77bcf86cd799439031",
        fiabilite: 0.78,
      },
    ],
    individus_impliques: [
      {
        individu_id: "507f1f77bcf86cd799439032",
        role: "suspect",
      },
    ],
  },
  {
    reference: "AFF-2024-008",
    date: "2024-02-10T14:00:00Z",
    type: "vol",
    description: "Vol dans un centre commercial",
    statut: "en_cours",
    lieu_id: "507f1f77bcf86cd799439033",
    temoignages: [
      {
        date: "2024-02-10T14:30:00Z",
        contenu: "Une personne a volé des vêtements dans une boutique",
        individu_id: "507f1f77bcf86cd799439034",
        fiabilite: 0.8,
      },
    ],
    individus_impliques: [
      {
        individu_id: "507f1f77bcf86cd799439035",
        role: "suspect",
      },
    ],
  },
  {
    reference: "AFF-2024-009",
    date: "2024-02-12T19:00:00Z",
    type: "cambriolage",
    description: "Cambriolage d'un restaurant",
    statut: "en_cours",
    lieu_id: "507f1f77bcf86cd799439036",
    temoignages: [
      {
        date: "2024-02-12T19:30:00Z",
        contenu: "J'ai vu un individu qui se cachait près de l'entrée",
        individu_id: "507f1f77bcf86cd799439037",
        fiabilite: 0.76,
      },
    ],
    individus_impliques: [
      {
        individu_id: "507f1f77bcf86cd799439038",
        role: "suspect",
      },
    ],
  },
];

const individus = [
  {
    _id: 1,
    nom: "Dupont",
    prenom: "Jean",
    date_naissance: "1980-01-01T00:00:00Z",
    contacts: [
      {
        type: "telephone",
        valeur: "+33612345678",
      },
    ],
    statut: "suspect",
    informations_complementaires: {
      antecedents: ["vol à l'étalage 2023"],
      fiabilite: 0.7,
    },
  },
  {
    _id: 2,
    nom: "Martin",
    prenom: "Paul",
    date_naissance: "1992-05-10T00:00:00Z",
    contacts: [
      {
        type: "email",
        valeur: "paul.martin@example.com",
      },
    ],
    statut: "suspect",
    informations_complementaires: {
      antecedents: ["vol de voiture 2020"],
      fiabilite: 0.8,
    },
  },
  {
    _id: 3,
    nom: "Durand",
    prenom: "Sophie",
    date_naissance: "1985-11-23T00:00:00Z",
    contacts: [
      {
        type: "telephone",
        valeur: "+33712345679",
      },
    ],
    statut: "victime",
    informations_complementaires: {
      fiabilite: 0.9,
    },
  },
  {
    _id: 4,
    nom: "Lemoine",
    prenom: "Luc",
    date_naissance: "1977-04-05T00:00:00Z",
    contacts: [
      {
        type: "telephone",
        valeur: "+33812345680",
      },
    ],
    statut: "temoin",
    informations_complementaires: {
      fiabilite: 0.85,
    },
  },
  {
    _id: 5,
    nom: "Benoit",
    prenom: "Claire",
    date_naissance: "1990-02-19T00:00:00Z",
    contacts: [
      {
        type: "telephone",
        valeur: "+33698765432",
      },
    ],
    statut: "suspect",
    informations_complementaires: {
      antecedents: ["agression 2021"],
      fiabilite: 0.6,
    },
  },
  {
    nom: "Dubois",
    prenom: "Marc",
    date_naissance: "1982-08-11T00:00:00Z",
    contacts: [
      {
        type: "email",
        valeur: "marc.dubois@example.com",
      },
    ],
    statut: "victime",
    informations_complementaires: {
      fiabilite: 0.75,
    },
  },
  {
    nom: "Lemoine",
    prenom: "Anna",
    date_naissance: "1995-12-09T00:00:00Z",
    contacts: [
      {
        type: "telephone",
        valeur: "+33723456789",
      },
    ],
    statut: "temoin",
    informations_complementaires: {
      fiabilite: 0.95,
    },
  },
  {
    nom: "Gerard",
    prenom: "Louis",
    date_naissance: "1971-06-12T00:00:00Z",
    contacts: [
      {
        type: "telephone",
        valeur: "+33634567890",
      },
    ],
    statut: "suspect",
    informations_complementaires: {
      antecedents: ["vol à main armée 2019"],
      fiabilite: 0.7,
    },
  },
  {
    nom: "Robert",
    prenom: "Alice",
    date_naissance: "1987-07-25T00:00:00Z",
    contacts: [
      {
        type: "telephone",
        valeur: "+33665432101",
      },
    ],
    statut: "victime",
    informations_complementaires: {
      fiabilite: 0.8,
    },
  },
  {
    nom: "Fournier",
    prenom: "Antoine",
    date_naissance: "1980-03-17T00:00:00Z",
    contacts: [
      {
        type: "email",
        valeur: "antoine.fournier@example.com",
      },
    ],
    statut: "suspect",
    informations_complementaires: {
      antecedents: ["agression 2022"],
      fiabilite: 0.6,
    },
  },
];

const lieux = [
  {
    adresse: "123 rue de la Paix",
    ville: "Paris",
    code_postal: "75001",
    pays: "France",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    type: "parking",
  },
  {
    adresse: "56 avenue des Champs-Élysées",
    ville: "Paris",
    code_postal: "75008",
    pays: "France",
    coordinates: { lat: 48.8698, lng: 2.3075 },
    type: "maison",
  },
  {
    adresse: "12 rue du Faubourg Saint-Antoine",
    ville: "Paris",
    code_postal: "75011",
    pays: "France",
    coordinates: { lat: 48.8532, lng: 2.376 },
    type: "parc",
  },
  {
    adresse: "45 boulevard Haussmann",
    ville: "Paris",
    code_postal: "75009",
    pays: "France",
    coordinates: { lat: 48.8742, lng: 2.3293 },
    type: "supermarché",
  },
  {
    adresse: "78 rue de Rivoli",
    ville: "Paris",
    code_postal: "75001",
    pays: "France",
    coordinates: { lat: 48.8606, lng: 2.3376 },
    type: "restaurant",
  },
  {
    adresse: "33 rue Montmartre",
    ville: "Paris",
    code_postal: "75002",
    pays: "France",
    coordinates: { lat: 48.8669, lng: 2.3469 },
    type: "centre commercial",
  },
  {
    adresse: "98 rue du Bac",
    ville: "Paris",
    code_postal: "75007",
    pays: "France",
    coordinates: { lat: 48.8569, lng: 2.3232 },
    type: "station de métro",
  },
  {
    adresse: "54 rue de la République",
    ville: "Paris",
    code_postal: "75003",
    pays: "France",
    coordinates: { lat: 48.86, lng: 2.3554 },
    type: "bureau",
  },
  {
    adresse: "23 rue des Martyrs",
    ville: "Paris",
    code_postal: "75009",
    pays: "France",
    coordinates: { lat: 48.8775, lng: 2.3401 },
    type: "hôpital",
  },
  {
    adresse: "17 rue de la Concorde",
    ville: "Paris",
    code_postal: "75008",
    pays: "France",
    coordinates: { lat: 48.8661, lng: 2.3217 },
    type: "école",
  },
];

const appels = [
  {
    appelant_id: "507f1f77bcf86cd799439013",
    recepteur_id: "507f1f77bcf86cd799439014",
    date_debut: "2024-01-28T11:00:00Z",
    duree: 120,
    type: "entrant",
    metadonnees: {
      operateur: "Orange",
      localisation_appelant: {
        lat: 48.8566,
        lng: 2.3522,
      },
    },
  },
  {
    appelant_id: "507f1f77bcf86cd799439015",
    recepteur_id: "507f1f77bcf86cd799439016",
    date_debut: "2024-01-28T15:00:00Z",
    duree: 150,
    type: "sortant",
    metadonnees: {
      operateur: "SFR",
      localisation_appelant: {
        lat: 48.8606,
        lng: 2.3376,
      },
    },
  },
  {
    appelant_id: "507f1f77bcf86cd799439017",
    recepteur_id: "507f1f77bcf86cd799439018",
    date_debut: "2024-01-29T08:00:00Z",
    duree: 180,
    type: "entrant",
    metadonnees: {
      operateur: "Bouygues",
      localisation_appelant: {
        lat: 48.8532,
        lng: 2.376,
      },
    },
  },
  {
    appelant_id: "507f1f77bcf86cd799439019",
    recepteur_id: "507f1f77bcf86cd799439020",
    date_debut: "2024-01-29T10:00:00Z",
    duree: 90,
    type: "entrant",
    metadonnees: {
      operateur: "Free",
      localisation_appelant: {
        lat: 48.8698,
        lng: 2.3075,
      },
    },
  },
  {
    appelant_id: "507f1f77bcf86cd799439021",
    recepteur_id: "507f1f77bcf86cd799439022",
    date_debut: "2024-01-30T16:00:00Z",
    duree: 60,
    type: "sortant",
    metadonnees: {
      operateur: "Orange",
      localisation_appelant: {
        lat: 48.8569,
        lng: 2.3232,
      },
    },
  },
  {
    appelant_id: "507f1f77bcf86cd799439023",
    recepteur_id: "507f1f77bcf86cd799439024",
    date_debut: "2024-02-01T18:00:00Z",
    duree: 200,
    type: "entrant",
    metadonnees: {
      operateur: "SFR",
      localisation_appelant: {
        lat: 48.86,
        lng: 2.3554,
      },
    },
  },
];

db.affaire.insertMany(affaires);
db.individu.insertMany(individus);
db.lieu.insertMany(lieux);
db.appel.insertMany(appels);
