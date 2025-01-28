CREATE (ind1:Individu {id: "1", nom: "Dupont", prenom: "Jean", statut: "suspect"})
CREATE (ind2:Individu {id: "2", nom: "Martin", prenom: "Lucie", statut: "temoin"})
CREATE (ind3:Individu {id: "3", nom: "Lemoine", prenom: "Paul", statut: "suspect"})
CREATE (ind4:Individu {id: "4", nom: "Garnier", prenom: "Alice", statut: "temoin"})

CREATE (lieu1:Lieu {id: "1", adresse: "123 rue de la Paix, Paris", coordinates: point({latitude: 48.8566, longitude: 2.3522}), type: "parking"})
CREATE (lieu2:Lieu {id: "2", adresse: "456 avenue des Champs-Élysées, Paris", coordinates: point({latitude: 48.8700, longitude: 2.3050}), type: "magasin"})

CREATE (affaire1:Affaire {id: "1", reference: "AFF-2024-001", date: date("2024-01-28"), type: "cambriolage", description: "Cambriolage d'une voiture dans un parking", statut: "en_cours"})
CREATE (affaire2:Affaire {id: "2", reference: "AFF-2024-002", date: date("2024-01-29"), type: "vol", description: "Vol dans un magasin", statut: "en_cours"})
CREATE (affaire3:Affaire {id: "3", reference: "AFF-2024-003", date: date("2024-02-01"), type: "agression", description: "Agression en rue", statut: "en_cours"})
CREATE (affaire4:Affaire {id: "4", reference: "AFF-2024-004", date: date("2024-02-05"), type: "incendie", description: "Incendie suspect", statut: "en_cours"})
CREATE (affaire5:Affaire {id: "5", reference: "AFF-2024-005", date: date("2024-02-10"), type: "escroquerie", description: "Escroquerie par téléphone", statut: "en_cours"})

CREATE (temoignage1:Temoignage {id: "1", date: date("2024-01-28"), contenu: "J'ai vu un homme en noir près de la voiture", fiabilite: 0.8})
CREATE (temoignage2:Temoignage {id: "2", date: date("2024-01-29"), contenu: "Un homme a pris des objets dans le magasin", fiabilite: 0.9})

CREATE (ind1)-[:SUSPECTE_DANS {depuis: date("2024-01-28")}]->(affaire1)
CREATE (ind2)-[:TEMOIN_DANS {date: date("2024-01-28")}]->(affaire1)
CREATE (ind3)-[:SUSPECTE_DANS {depuis: date("2024-01-29")}]->(affaire2)
CREATE (ind4)-[:TEMOIN_DANS {date: date("2024-01-29")}]->(affaire2)

CREATE (ind1)-[:A_APPELE {date: date("2024-01-28"), duree: 120}]->(ind3)
CREATE (ind2)-[:A_APPELE {date: date("2024-01-29"), duree: 90}]->(ind4)

CREATE (ind1)-[:PRESENT_A {date: date("2024-01-28")}]->(lieu1)
CREATE (ind3)-[:PRESENT_A {date: date("2024-01-29")}]->(lieu2)

CREATE (affaire1)-[:SE_DEROULE_A {date: date("2024-01-28")}]->(lieu1)
CREATE (affaire2)-[:SE_DEROULE_A {date: date("2024-01-29")}]->(lieu2)

CREATE (ind1)-[:A_TEMOIGNE {date: date("2024-01-28")}]->(temoignage1)
CREATE (ind2)-[:A_TEMOIGNE {date: date("2024-01-29")}]->(temoignage2)

CREATE (temoignage1)-[:CONCERNE]->(affaire1)
CREATE (temoignage2)-[:CONCERNE]->(affaire2)
