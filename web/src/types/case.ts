type Case = {
  _id: string;
  description: string;
  individus: string[];
  temoignages: {
    auteur: string;
    date: string;
    recit: string;
  }[];
  lieux: {
    ville: string;
    adresse: string;
  }[];
};

export default Case;
