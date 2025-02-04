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


//Récupérer tous les appels sortant d'un individu
fastify.get('/appel/:id', async (req, reply) => {

  try{
    const { id } = req.params;
    const result = await session.run(`
      MATCH (ind: Individu {id: $id})-[apl:A_APPELE]->(a:Appel)-[u:UTILISE_ANTENNE]->(ant: Antenne)
      MATCH (a)-[:APPEL_RECU]->(ind2 : Individu)
      RETURN ind.id AS sourceId, ind.prenom AS sourceName, a.date AS date,a.duree As duree,
             ind2.id as destinationId, ind2.prenom AS destinationName,
             ant.id AS idAntenne, ant.adresse AS adresse, ant.coordinates AS localisation


      `,{ id }); // Passer l'ID comme paramètre pour sécuriser la requête 

     if(result.records.length === 0){
        reply.status(404).send('Auncun appel trouvé pour cette individus');
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
      Loacalsiation_Relais: {
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
    const { reference, date, type, description, statut, lieu_id, temoignages, individus_impliques } = req.body;

    const nouvelleAffaire = {
      reference,
      date,
      type,
      description,
      statut,
      lieu_id,
      temoignages,
      individus_impliques
    };

    const result = await collection.insertOne(nouvelleAffaire);
    reply.status(201).send({ id: result.insertedId });
  } catch (error) {
    reply.status(500).send('Erreur lors de l\'ajout de l\'affaire');
  }
});



// Route pour ajouter un individu dans Neo4j
fastify.post('/individu', async (req, reply) => {
  try {
    const { id, nom, prenom, date_naissance, statut } = req.body;

    // Ajout de l'individu
    const result = await session.run(
      'CREATE (i:Individu {id: $id, nom: $nom, prenom: $prenom, date_naissance: $date_naissance, statut: $statut}) RETURN i',
      { id, nom, prenom, date_naissance, statut }
    );

    return reply.status(201).send({ message: 'Individu ajouté', individu: result.records[0].get('i').properties });
  } catch (error) {
    reply.status(500).send('Erreur lors de l\'ajout de l\'individu');
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
