(:Individu {
  id: String,
  nom: String,
  prenom: String,
  date_naissance: Date,
  statut: String
})

(:Affaire {
  id: String,
  reference: String,
  date: Date,
  type: String,
  description: String,
  statut: String
})

(:Lieu {
  id: String,
  adresse: String,
  coordinates: Point,
  type: String
})

(:Temoignage {
  id: String,
  date: Date,
  contenu: String,
  fiabilite: Float
})

// Relations
(i:Individu)-[:SUSPECTE_DANS {depuis: Date}]->(a:Affaire)
(i:Individu)-[:TEMOIN_DANS {date: Date}]->(a:Affaire)
(i:Individu)-[:A_APPELE {date: Date, duree: Int}]->(i2:Individu)
(i:Individu)-[:PRESENT_A {date: Date}]->(l:Lieu)
(a:Affaire)-[:SE_DEROULE_A {date: Date}]->(l:Lieu)
(i:Individu)-[:A_TEMOIGNE {date: Date}]->(t:Temoignage)
(t:Temoignage)-[:CONCERNE]->(a:Affaire)