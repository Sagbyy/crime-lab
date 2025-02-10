const fastify = require('fastify')();
const { MongoClient, ObjectId } = require('mongodb');
const neo4j = require('neo4j-driver');


// Configuration MongoDB
const mongoUrl = 'mongodb://mongodb:27017';  // Nom du service MongoDB dans Docker
const dbName = 'crimelab';
let mongoClient;

// Connexion à MongoDB
async function connectMongoDB() {
  mongoClient = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  await mongoClient.connect();
  console.log('MongoDB connecté');
}

// Configuration Neo4j
const neo4jUri = 'bolt://neo4j:7687';  // Nom du service Neo4j dans Docker
const neo4jUser = 'neo4j';
const neo4jPassword = 'password';
const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPassword));
let session;

// Connexion à Neo4j
async function connectNeo4j() {
  session = driver.session();
  console.log('Neo4j connecté');
}

/*MES ENDPOINT EN GET POUR INTERAGIR AVEC LES BASES MONGO*/ 

// Route pour récupérer les affaires depuis MongoDB
fastify.get('/affaires', async (request, reply) => {
  try {
    const db = mongoClient.db(dbName);
    const collection = db.collection('affaire');
    const affaires = await collection.find().toArray();
    return affaires;
  } catch (error) {
    console.log(error);
    reply.status(500).send('Erreur lors de la récupération des affaires');
  }
});

// Route pour récupérer une affaire par id depuis MongoDB
fastify.get('/affaire/:id', async (req , reply) => {
  try {
    const { id } = req.params;
    const db = mongoClient.db(dbName);
    const collection = db.collection('affaire');
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { reference: id };
    const affaire = await collection.findOne(query);

    if (!affaire) {
      return reply.status(404).send("Affaire non trouvée");
    }
    return reply.send(affaire);
  } catch (error) {
    reply.status(500).send('Erreur lors de la récupération de l\'affaire');
  }
});

//Route pour récuérer tous les individus depuis NEO4J
fastify.get('/individus', async (request, reply) => {
  try {
    
    const result = await session.run('Match (n: Individu) RETURN n');
    const individus = result.records.map(record => record.get('n').properties);

    if(result.records.length === 0){
      reply.status(404).send("aucun individus trouvée");
    }

    return reply.send(individus);

  } catch (error) {
    console.log(error);
    reply.status(500).send('Erreur lors de la récupération des individus!!');
  }
});

//pour récupérer un individu à partir de son ID
fastify.get('/individu/:id', async (req, reply) => {

  try{

    const { id } = req.params;
    const result = await session.run('MATCH (ind: Individu {id : $id}) RETURN ind', {id});
    const individu = result.records.map(record => record.get('ind').properties);

    if(result.records.length === 0){
      reply.status(404).send("aucun individus trouvée");
    }

    reply.send(individu);

  }catch(error){
    reply.status(500).send("Erreur lors de la récupéartion d'un individu par son id");
  }
});


//Récupérer tous les appels sortant d'un individu (pour les fadettes)
fastify.get('/appelS/:id', async (req, reply) => {

  try{
    const { id } = req.params;
    const result = await session.run(`
    MATCH (ind: Individu {id: $id})-[aplS:A_APPELE]->(a:Appel)-[u:UTILISE_ANTENNE]->(ant: Antenne)
    MATCH (a)-[aplE:APPEL_RECU]->(ind2 : Individu)//destinataire

    RETURN ind.id AS sourceId, 
          ind.prenom AS sourceName,
          a.date AS date,
          a.duree As duree,
          ind2.id as destinationId,
          ind2.prenom AS destinationName,
          ant.id AS idAntenne, 
          ant.adresse AS adresse, 
          ant.coordinates AS localisation
            `,{ id }); // Passer l'ID comme paramètre pour sécuriser la requête 

     if(result.records.length === 0){
        return reply.status(404).send('Auncun appel trouvé pour cet individus');
     } 

    const appels = result.records.map(record => ({
      Date : record.get('date'),
      Duree: record.get('duree'),

      Source : {
        id : record.get('sourceId'),
        prenom:record.get('sourceName')
      },
      Destination: {
        id: record.get('destinationId'),
        prenom: record.get('destinationName')
      },
      Type_appel : {
        type : "FR-APP-SORT"
      },
      Localsiation_Relais: {
        idAntenne : record.get('idAntenne'),
        adresse : record.get('adresse'),
        localisation: record.get('localisation')
      }

    }));


  reply.send(appels);  
  }catch(error){
    console.log(error);
    reply.status(500).send('Erreur lors de la récupérations des appels entrants');
  }
});






//Récupérer tous les appels entran d'un individu (pour les fadettes)
fastify.get('/appelE/:id', async (req, reply) => {

  try{
    const { id } = req.params;
    const result = await session.run(`
    MATCH (ind: Individu {id: $id})<-[aplE:APPEL_RECU]-(a:Appel)-[u:UTILISE_ANTENNE]->(ant: Antenne)//appel entrant 
    MATCH (a)<-[aplS:A_APPELE]-(ind2 : Individu)//source

    RETURN ind.id AS destinationId, 
          ind.prenom AS destinationName,
          a.date AS date,
          a.duree As duree,
          ind2.id as sourceId,
          ind2.prenom AS sourceName,
          ant.id AS idAntenne, 
          ant.adresse AS adresse, 
          ant.coordinates AS localisation
       `,{ id }); // Passer l'ID comme paramètre pour sécuriser la requête 

     if(result.records.length === 0){
        return reply.status(404).send('Auncun appel entrant trouvé pour cet individus');
     } 

    const appels = result.records.map(record => ({
      Date : record.get('date'),
      Duree: record.get('duree'),

      Source : {
        id : record.get('sourceId'),
        prenom:record.get('sourceName')
      },
      Destination: {
        id: record.get('destinationId'),
        prenom: record.get('destinationName')
      },
      Type_appel : {
        type : "FR-APP-ENTR"
      },
      Localsiation_Relais: {
        idAntenne : record.get('idAntenne'),
        adresse : record.get('adresse'),
        localisation: record.get('localisation')
      }

    }));


  reply.send(appels);  
  }catch(error){
    console.log(error);
    reply.status(500).send('Erreur lors de la récupérations des appels entrants');
  }
});





//pour récupérer tous les suspect liée à une affaires
fastify.get('/suspectsAffaire/:id', async (req, reply) => {

  try{
    const { id } = req.params;

    const db = mongoClient.db(dbName);
    const collection = db.collection('affaire');
    const suspects = await collection.find({ _id: new ObjectId(id) }, { projection: { individus: 1, _id: 0 } }).toArray();

  
    if(!suspects){
      reply.status(404).send('Auncun suspect trouvée');
    }

    return reply.send(suspects);

  }catch(error){
    console.log(error);
    reply.status(500).send('erreur lors de la récupération des suspects dans une affaire');
  }
});






// // Route pour récupérer les lieux visités par un individu
// fastify.get('/lieux/:id', async (req, reply) => {
//   try {
//     const { id } = req.params; // Récupère l'ID de l'individu depuis les paramètres

//     // Requête Cypher pour trouver tous les lieux où l'individu a été présent
//     const result = await session.run(
//       `
//       MATCH (ind:Individu {id: $id})-[p:PRESENT_A]->(l:Lieu)
//       RETURN l.id AS lieu_id, l.adresse AS adresse, l.type AS type, l.coordinates AS coordinates
//       `,
//       { id } // Paramètre sécurisé
//     );

//     const lieux = result.records.map(record => ({
//       lieu_id: record.get('lieu_id'),
//       type: record.get('type'),
//       adresse: record.get('adresse'),
//       coordinates: record.get('coordinates')
//     }));

//     if (lieux.length === 0) {
//       return reply.status(404).send({ message: "Aucun lieu trouvé pour cet individu" });
//     }

//     return reply.send(lieux); // Retourne la liste des lieux
//   } catch (error) {
//     console.error("Erreur lors de la récupération des lieux :", error);
//     return reply.status(500).send({ message: "Erreur serveur" });
//   }
// });



/*MES ENDPOINT POST POUR INTERAGIR AVEC MA BASE MONGO*/ 

// Route pour ajouter une nouvelle affaire dans MongoDB
fastify.post('/affaire', async (req, reply) => {
  try {
    const db = mongoClient.db(dbName);
    const collection = db.collection('affaire');

    const { description, individus, temoignages, lieux } = req.body;

    // Vérification des champs obligatoires
    if (!description || !individus || !temoignages || !lieux) {
      return reply.status(400).send({ error: "Tous les champs obligatoires doivent être fournis." });
    }

    const nouvelleAffaire = {
      description,
      individus,
      temoignages,
      lieux
    };

    const result = await collection.insertOne(nouvelleAffaire);
    reply.status(201).send({ id: result.insertedId });

  } catch (error) {
    console.error("Erreur lors de l'ajout de l'affaire :", error);
    reply.status(500).send({ error: "Erreur serveur" });
  }
});



// Route pour ajouter un individu dans Neo4j
// Route pour ajouter un individu dans Neo4j
fastify.post('/individu', async (req, reply) => {

  try {
    const { id, nom, prenom, date_naissance} = req.body;

    // Vérification des champs obligatoires
    if (!id || !nom || !prenom || !date_naissance) {
      return reply.status(400).send({ error: "Les champs id, nom, prenom et date_naissance sont obligatoires." });
    }

    // Exécution de la requête Cypher
    const result = await session.run(
      `CREATE (i:Individu {
        id: $id, 
        nom: $nom, 
        prenom: $prenom, 
        date_naissance: date($date_naissance)
      }) RETURN i`,
      { id, nom, prenom, date_naissance }
    );

    // Vérification de l'ajout réussi
    if (result.records.length === 0) {
      return reply.status(500).send({ error: "Erreur lors de la création de l'individu" });
    }

    // Récupération des propriétés de l'individu créé
    const individu = result.records[0].get('i').properties;

    return reply.status(201).send({ message: 'Individu ajouté avec succès', individu });

  } catch (error) {
    console.error("Erreur lors de l'ajout de l'individu :", error);
    return reply.status(500).send({ error: "Erreur serveur" });
  } 
});


// Route pour ajouter un appel
fastify.post('/appel', async (req, reply) => {

  try {
    const { id, date, duree } = req.body;

    // Vérification des champs obligatoires
    if (!id || !date || duree === undefined) {
      return reply.status(400).send({ error: "Les champs id, date et duree sont obligatoires." });
    }

    // Création de l'appel dans Neo4j
    const result = await session.run(
      `CREATE (a:Appel {
        id: $id,
        date: datetime($date),
        duree: $duree
      }) RETURN a`,
      { id, date, duree }
    );

    // Vérification que l'insertion a bien eu lieu
    if (result.records.length === 0) {
      return reply.status(500).send({ error: "Erreur lors de la création de l'appel" });
    }

    const appel = result.records[0].get('a').properties;
    return reply.status(201).send({ message: "Appel ajouté avec succès", appel });

  } catch (error) {
    console.error("Erreur lors de l'ajout de l'appel :", error);
    return reply.status(500).send({ error: "Erreur serveur" });
  } 
});

// Route pour ajouter une antenne
fastify.post('/antenne', async (req, reply) => {


  try {
    const { id, adresse, latitude, longitude, type } = req.body;

    // Vérification des champs obligatoires
    if (!id || !adresse || latitude === undefined || longitude === undefined || !type) {
      return reply.status(400).send({ error: "Les champs id, adresse, latitude, longitude et type sont obligatoires." });
    }

    // Création de l'antenne dans Neo4j
    const result = await session.run(
      `CREATE (ant:Antenne {
        id: $id,
        adresse: $adresse,
        coordinates: point({latitude: $latitude, longitude: $longitude}),
        type: $type
      }) RETURN ant`,
      { id, adresse, latitude, longitude, type }
    );

    // Vérification de l'ajout réussi
    if (result.records.length === 0) {
      return reply.status(500).send({ error: "Erreur lors de la création de l'antenne" });
    }

    const antenne = result.records[0].get('ant').properties;
    return reply.status(201).send({ message: "Antenne ajoutée avec succès", antenne });

  } catch (error) {
    console.error("Erreur lors de l'ajout de l'antenne :", error);
    return reply.status(500).send({ error: "Erreur serveur" });
  } 
});








// Lancer Fastify et les connexions MongoDB & Neo4j
fastify.listen({ port: 3000, host: '0.0.0.0' }, async (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  await connectMongoDB();
  await connectNeo4j();
  console.log(`Server listening at ${address}`);
});
