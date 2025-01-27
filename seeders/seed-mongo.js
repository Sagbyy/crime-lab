db = db.getSiblingDB("crimelab");

db.affaire.insertMany([
  {
    affaire_id: "affaire_001",
    description:
      "Affaire concernant un réseau criminel actif dans le centre-ville.",
    individus: ["individu_001", "individu_002", "individu_003"],
    temoignage: [
      {
        temoin: "temoin_001",
        declaration:
          "J'ai vu un homme quitter les lieux en courant vers 15h30.",
        date: "2025-01-15T15:30:00Z",
      },
      {
        temoin: "temoin_002",
        declaration:
          "La voiture suspecte était garée près de l'antenne téléphonique principale.",
        date: "2025-01-15T15:45:00Z",
      },
    ],
    lieux: [
      {
        adresse: "123 Rue des Lilas, Ville A",
        coordonnees: {
          latitude: 48.8566,
          longitude: 2.3522,
        },
      },
      {
        adresse: "Antenne téléphonique - Quartier Sud",
        coordonnees: {
          latitude: 48.853,
          longitude: 2.35,
        },
      },
    ],
  },
  {
    affaire_id: "affaire_002",
    description: "Affaire impliquant des fraudes téléphoniques.",
    individus: ["individu_004", "individu_005"],
    temoignages: [
      {
        temoin: "temoin_003",
        declaration:
          "J'ai reçu plusieurs appels étranges provenant du même numéro.",
        date: "2025-01-16T18:00:00Z",
      },
    ],
    lieux: [
      {
        adresse: "45 Avenue des Champs, Ville B",
        coordonnees: {
          latitude: 48.8708,
          longitude: 2.3075,
        },
      },
    ],
  },
  {
    affaire_id: "affaire_003",
    description: "Affaire concernant un delit de fuite avec violence aggravé sur agent depositaire de l'autorité publique",
    individus: ["individu_002","individu_006"],
    temoignages: [
      {
        temoin : "temoin_004",
        declaration: "on a un jeune de type magrhebin qui faisait du cross foncé vers un agent de l'asvp",
        date:'2025-01-16T18:00:00Z ',
      },
    ],
    lieux: [
      {
        adresse: "15 avenue du chenay",
        coordonnees: {
          latitude: 48.8708,
          longitude: 2.3075,
        },
      },
    ],
  },

]);
