// Clear database
MATCH (n) DETACH DELETE n;

// Individus
CREATE (i1:Individu {
  id: 'i1',
  nom: 'Doe',
  prenom: 'John',
  date_naissance: date('1980-01-01')
})
CREATE (i2:Individu {
  id: 'i2',
  nom: 'Doe',
  prenom: 'Jane',
  date_naissance: date('1985-01-01')
})
CREATE (i3:Individu {
  id: 'i3',
  nom: 'Doe',
  prenom: 'Jack',
  date_naissance: date('1990-01-01')
})
CREATE (i4:Individu {
  id: 'i4',
  nom: 'Doe',
  prenom: 'Jill',
  date_naissance: date('1995-01-01')
})
CREATE (i5: Individu {
    id: 'i5',
    nom: 'Doe',
    prenom: 'James',
    date_naissance: date('2000-01-01')
})
CREATE (i6:Individu {
    id: 'i6',
    nom: 'Smith',
    prenom: 'Anna',
    date_naissance: date('1998-02-15')
})
CREATE (i7:Individu {
    id: 'i7',
    nom: 'Brown',
    prenom: 'Michael',
    date_naissance: date('1978-07-22')
})
CREATE (i8:Individu {
    id: 'i8',
    nom: 'Taylor',
    prenom: 'Sarah',
    date_naissance: date('1989-04-09')
})
CREATE (i9:Individu {
    id: 'i9',
    nom: 'Johnson',
    prenom: 'Robert',
    date_naissance: date('1993-03-30')
})
CREATE (i10:Individu {
    id: 'i10',
    nom: 'Miller',
    prenom: 'Linda',
    date_naissance: date('2001-06-14')
})
CREATE (i11:Individu {
    id: 'i11',
    nom: 'Wilson',
    prenom: 'David',
    date_naissance: date('1995-09-12')
})
CREATE (i12:Individu {
    id: 'i12',
    nom: 'Moore',
    prenom: 'Laura',
    date_naissance: date('1987-11-01')
})
CREATE (i13:Individu {
    id: 'i13',
    nom: 'Jackson',
    prenom: 'William',
    date_naissance: date('1982-08-30')
})
CREATE (i14:Individu {
    id: 'i14',
    nom: 'Harris',
    prenom: 'Elizabeth',
    date_naissance: date('2000-01-01')
})

// Appels
CREATE (a1:Appel {
    id: 'a1',
    date: datetime('2020-01-01T10:00:00Z'),
    duree: 60
})
CREATE (a2:Appel {
    id: 'a2',
    date: datetime('2020-01-01T11:00:00Z'),
    duree: 30
})
CREATE (a3:Appel {
    id: 'a3',
    date: datetime('2020-01-01T12:00:00Z'),
    duree: 45
})
CREATE (a4:Appel {
    id: 'a4',
    date: datetime('2020-01-01T13:00:00Z'),
    duree: 15
})
CREATE (a5:Appel {
    id: 'a5',
    date: datetime('2020-01-01T14:00:00Z'),
    duree: 20
})
CREATE (a6:Appel {
    id: 'a6',
    date: datetime('2020-01-01T15:00:00Z'),
    duree: 35
})
CREATE (a7:Appel {
    id: 'a7',
    date: datetime('2020-01-01T16:00:00Z'),
    duree: 40
})
CREATE (a8:Appel {
    id: 'a8',
    date: datetime('2020-01-01T17:00:00Z'),
    duree: 50
})
CREATE (a9:Appel {
    id: 'a9',
    date: datetime('2020-01-01T18:00:00Z'),
    duree: 30
})
CREATE (a10:Appel {
    id: 'a10',
    date: datetime('2020-01-01T19:00:00Z'),
    duree: 25
})


// Antennes
CREATE (ant1:Antenne {
    id: 'ant1',
    adresse: '1 rue de la Paix, Paris',
    coordinates: point({latitude: 48.869860, longitude: 2.331470}),
    type: 'VoLTE'
})
CREATE (ant2:Antenne {
    id: 'ant2',
    adresse: '2 rue de la Paix, Paris',
    coordinates: point({latitude: 48.869860, longitude: 2.331470}),
    type: 'GSM'
})
CREATE (ant3:Antenne {
    id: 'ant3',
    adresse: '7 avenue des Tulipes, Lyon',
    coordinates: point({latitude: 48.869860, longitude: 2.331470}),
    type: '5G'
})

// Relations
CREATE (i1)-[:A_APPELE]->(a1)-[:APPEL_RECU]->(i2)
CREATE (i1)-[:A_APPELE]->(a2)-[:APPEL_RECU]->(i3)
CREATE (i1)-[:A_APPELE]->(a3)-[:APPEL_RECU]->(i4)
CREATE (i4)-[:A_APPELE]->(a4)-[:APPEL_RECU]->(i5)
CREATE (i5)-[:A_APPELE]->(a5)-[:APPEL_RECU]->(i14)
CREATE (i6)-[:A_APPELE]->(a6)-[:APPEL_RECU]->(i2)
CREATE (i6)-[:A_APPELE]->(a7)-[:APPEL_RECU]->(i3)
CREATE (i13)-[:A_APPELE]->(a8)-[:APPEL_RECU]->(i4)
CREATE (i8)-[:A_APPELE]->(a9)-[:APPEL_RECU]->(i9)
CREATE (i11)-[:A_APPELE]->(a1)-[:APPEL_RECU]->(i10)
CREATE (i12)-[:A_APPELE]->(a10)-[:APPEL_RECU]->(i11)

CREATE (a1)-[:UTILISE_ANTENNE]->(ant1)
CREATE (a2)-[:UTILISE_ANTENNE]->(ant1)
CREATE (a3)-[:UTILISE_ANTENNE]->(ant2)
CREATE (a4)-[:UTILISE_ANTENNE]->(ant2)
CREATE (a5)-[:UTILISE_ANTENNE]->(ant1)
CREATE (a6)-[:UTILISE_ANTENNE]->(ant1)
CREATE (a7)-[:UTILISE_ANTENNE]->(ant2)
CREATE (a8)-[:UTILISE_ANTENNE]->(ant2)
CREATE (a9)-[:UTILISE_ANTENNE]->(ant3)
CREATE (a10)-[:UTILISE_ANTENNE]->(ant3)
