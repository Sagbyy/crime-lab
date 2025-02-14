const fastify = require("fastify")();
const { MongoClient, ObjectId } = require("mongodb");
const neo4j = require("neo4j-driver");

// Configuration MongoDB
const mongoUrl = "mongodb://mongodb:27017"; // Nom du service MongoDB dans Docker
const dbName = "crimelab";
let mongoClient;

// CORS
fastify.register(require("@fastify/cors"), {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
console.log("CORS enregistré");

// Connexion à MongoDB
async function connectMongoDB() {
  mongoClient = new MongoClient(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await mongoClient
    .connect()
    .then(() => {
      console.log("MongoDB connecté");
    })
    .catch((err) => {
      console.error("Erreur lors de la connexion à MongoDB:", err);
    });
}

// Configuration Neo4j
const neo4jUri = "bolt://neo4j:7687"; // Nom du service Neo4j dans Docker
const neo4jUser = "neo4j";
const neo4jPassword = "password";
const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
);

async function executeNeo4jQuery(cypher, params = {}) {
  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result;
  } finally {
    await session.close();
  }
}

/*MES ENDPOINT EN GET POUR INTERAGIR AVEC LES BASES MONGO*/

// Route pour récupérer les affaires depuis MongoDB
fastify.get("/affaires", async (request, reply) => {
  try {
    const db = mongoClient.db(dbName);
    const collection = db.collection("affaire");
    const affaires = await collection.find().toArray();
    return affaires;
  } catch (error) {
    console.log(error);
    reply.status(500).send("Erreur lors de la récupération des affaires");
  }
});

// Route pour récupérer une affaire par id depuis MongoDB
fastify.get("/affaire/:id", async (req, reply) => {
  try {
    const { id } = req.params;
    const db = mongoClient.db(dbName);
    const collection = db.collection("affaire");
    const query = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { reference: id };
    const affaire = await collection.findOne(query);

    if (!affaire) {
      return reply.status(404).send("Affaire non trouvée");
    }
    return reply.send(affaire);
  } catch (error) {
    reply.status(500).send("Erreur lors de la récupération de l'affaire");
  }
});

//Route pour récuérer tous les individus depuis NEO4J
fastify.get("/individus", async (request, reply) => {
  try {
    const result = await executeNeo4jQuery("MATCH (n: Individu) RETURN n");
    const individus = result.records.map(
      (record) => record.get("n").properties
    );

    if (result.records.length === 0) {
      reply.status(404).send("aucun individus trouvée");
    }

    return reply.send(individus);
  } catch (error) {
    console.log(error);
    reply.status(500).send("Erreur lors de la récupération des individus!!");
  }
});

//pour récupérer un individu à partir de son ID
fastify.get("/individu/:id", async (req, reply) => {
  try {
    const { id } = req.params;
    const result = await executeNeo4jQuery(
      "MATCH (ind: Individu {id : $id}) RETURN ind",
      { id }
    );
    const individu = result.records.map(
      (record) => record.get("ind").properties
    );

    if (result.records.length === 0) {
      reply.status(404).send("aucun individus trouvée");
    }

    reply.send(individu);
  } catch (error) {
    reply
      .status(500)
      .send("Erreur lors de la récupéartion d'un individu par son id");
  }
});

//Récupérer tous les appels sortant d'un individu (pour les fadettes)
fastify.get("/appel/:id", async (req, reply) => {
  try {
    const { id } = req.params;
    const result = await executeNeo4jQuery(
      `
      MATCH (ind: Individu {id: $id})-[apl:A_APPELE]->(a:Appel)-[u:UTILISE_ANTENNE]->(ant: Antenne)
      MATCH (a)-[:APPEL_RECU]->(ind2 : Individu)
      RETURN ind.id AS sourceId, ind.prenom AS sourceName, a.date AS date,a.duree As duree,
             ind2.id as destinationId, ind2.prenom AS destinationName,
             ant.id AS idAntenne, ant.adresse AS adresse, ant.coordinates AS localisation
      `,
      { id }
    );

    if (result.records.length === 0) {
      reply.status(404).send("Auncun appel trouvé pour cette individus");
    }

    const appels = result.records.map((record) => ({
      Date: record.get("date"),
      Duree: record.get("duree"),

      Source: {
        id: record.get("sourceId"),
        prenom: record.get("sourceName"),
      },
      Destination: {
        id: record.get("destinationId"),
        prenom: record.get("destinationName"),
      },
      Loacalsiation_Relais: {
        idAntenne: record.get("idAntenne"),
        adresse: record.get("adresse"),
        localisation: record.get("localisation"),
      },
    }));

    reply.send(appels);
  } catch (error) {
    console.log(error);
    reply
      .status(500)
      .send("Erreur lors de la récupérations des appels entrants");
  }
});

/*MES ENDPOINT POST POUR INTERAGIR AVEC MA BASE MONGO*/

// Route pour ajouter une nouvelle affaire dans MongoDB
fastify.post("/affaire", async (req, reply) => {
  try {
    const db = mongoClient.db(dbName);
    const collection = db.collection("affaire");
    const { description, individus, temoignages, lieux } = req.body;

    const nouvelleAffaire = {
      description,
      individus,
      temoignages,
      lieux,
    };

    const result = await collection.insertOne(nouvelleAffaire);
    reply.status(201).send({ id: result.insertedId });
  } catch (error) {
    reply.status(500).send("Erreur lors de l'ajout de l'affaire");
  }
});

// Route pour ajouter un individu dans Neo4j
fastify.post("/individu", async (req, reply) => {
  try {
    const { nom, prenom, date_naissance } = req.body;

    // Get the highest existing ID and increment by 1 for the new ID
    let id;
    try {
      const idResult = await executeNeo4jQuery(
        "MATCH (i:Individu) WITH i.id AS id, toInteger(substring(i.id, 1)) AS numeric_id ORDER BY numeric_id DESC LIMIT 1 RETURN id;"
      );

      if (idResult.records.length === 0) {
        throw new Error("No existing IDs found");
      }
      id =
        "i" +
        (parseInt(String(idResult.records[0].get("id")).substring(1)) + 1);
    } catch (error) {
      console.error("Error getting next ID:", error);
      throw new Error("Failed to generate ID for new individual");
    }

    const result = await executeNeo4jQuery(
      "CREATE (i:Individu {id: $id, nom: $nom, prenom: $prenom, date_naissance: $date_naissance}) RETURN i",
      { id, nom, prenom, date_naissance }
    );

    console.log("Individu ajouté avec succès");
    return reply.status(201).send({
      message: "Individu ajouté",
      individu: result.records[0].get("i").properties,
    });
  } catch (error) {
    console.log(error);
    reply.status(500).send("Erreur lors de l'ajout de l'individu");
  }
});

// Lancer Fastify et les connexions MongoDB & Neo4j
fastify.listen({ port: 3000, host: "0.0.0.0" }, async (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  await connectMongoDB();
  // Remove the connectNeo4j call since we're not using a global session anymore
  console.log(`Server listening at ${address}`);
});

// Add cleanup on server shutdown
process.on("SIGINT", async () => {
  await driver.close();
  await mongoClient.close();
  process.exit(0);
});
