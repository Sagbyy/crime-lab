export interface Individu {
  id: string;
  nom: string;
  prenom: string;
  date_naissance: Date;
}


export interface Call {
  Date: {
    year: { low: number; high: number };
    month: { low: number; high: number };
    day: { low: number; high: number };
    hour: { low: number; high: number };
    minute: { low: number; high: number };
  };
  Duree: { low: number; high: number };
  Source: { id: string; prenom: string };
  Destination: { id: string; prenom: string };
  Loacalsiation_Relais: {
    idAntenne: string;
    adresse: string;
    localisation: {
      srid: { low: number; high: number };
      x: number;
      y: number;
    };
  };
}
