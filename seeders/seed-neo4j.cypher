// Crée des nœuds pour des utilisateurs
CREATE (u1:User {name: 'John Doe', email: 'john@example.com'})
CREATE (u2:User {name: 'Jane Doe', email: 'jane@example.com'})

// Crée une relation entre les utilisateurs
MATCH (u1:User {name: 'John Doe'}), (u2:User {name: 'Jane Doe'})
CREATE (u1)-[:FRIEND]->(u2)
