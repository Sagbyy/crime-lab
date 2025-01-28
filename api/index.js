const fastify = require('fastify')();
const { MongoClient } = require('mongodb');
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

// Route pour récupérer les affaires depuis MongoDB
fastify.get('/affaires', async (request, reply) => {
  const db = mongoClient.db(dbName);
  const collection = db.collection('affaires');
  const affaires = await collection.find().toArray();
  return affaires;
});

// Route pour récupérer les suspects depuis Neo4j
fastify.get('/suspects', async (request, reply) => {
  const result = await session.run('MATCH (n:Individu) WHERE n.role = "Suspect" RETURN n');
  const suspects = result.records.map(record => record.get('n').properties);
  return suspects;
});

// Lancer Fastify et les connexions MongoDB & Neo4j
fastify.listen(3000, async (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  await connectMongoDB();
  await connectNeo4j();
  console.log(`Server listening at ${address}`);
});
