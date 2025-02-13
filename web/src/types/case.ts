interface Testimony {
  auteur: string;
  date: string;
  recit: string;
}

interface Location {
  ville: string;
  adresse: string;
  code_postal: string;
  coordonnees: {
    lat: number;
    lon: number;
  };
}

interface Case {
  _id: string;
  description: string;
  individus: string[];
  temoignages: Testimony[];
  lieux: Location[];
}

export default Case;
