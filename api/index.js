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

/*MES ENDPOINT EN GET POUR LES BASES MONGO*/ 

// Route pour récupérer les affaires depuis MongoDB
fastify.get('/affaires', async (request, reply) => {
  try {
    const db = mongoClient.db(dbName);
    const collection = db.collection('affaire');
    const affaires = await collection.find().toArray();
    return affaires;
  } catch (error) {
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

//Route pour récuérer tous les individus depuis MongoDB
fastify.get('/individus', async (request, reply) => {
  try {
    const db = mongoClient.db(dbName);
    const collection = db.collection('individu');
    const individus = await collection.find().toArray();
    return individus;
  } catch (error) {
    reply.status(500).send('Erreur lors de la récupération des individus');
  }
});

//route pour récupérer les individus par id depuis MongoDB
fastify.get('/individu/:id', async (req, reply) => {
  try {
    const { id } = req.params;
    const db = mongoClient.db(dbName);
    const collection = db.collection('individu');
    const individu = await collection.findOne( {_id: id } );

    if (!individu) {
      return reply.status(404).send("Individu non trouvé");
    }
    return reply.send(individu);
  } catch (error) {
    reply.status(500).send('Erreur lors de la récupération de l\'individu');
  }
});


//por récupérer tous les lieux depuis ma base mongo
fastify.get('/lieux', async (req, reply)=> {

  try{
    const db = mongoClient.db(dbName);
    const collection =db.collection('lieu');
    const lieux = await collection.find().toArray();
    return lieux;
  }catch(error){
    reply.status(404).send('erreur lors de la récupération des lieux depuis mongo : '+ error);
  }

});







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

// Route pour récupérer les suspects depuis Neo4j
fastify.get('/suspects', async (request, reply) => {
  try {
    const result = await session.run('MATCH (n:Individu) WHERE n.statut = "suspect" RETURN n');
    const suspects = result.records.map(record => record.get('n').properties);
    return suspects;
  } catch (error) {
    reply.status(500).send('Erreur lors de la récupération des suspects');
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
