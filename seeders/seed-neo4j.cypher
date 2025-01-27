// seed.cypher
CREATE (:User {name: 'Salah Ad-Din Bouhdjeur', age: 30});
CREATE (:User {name: 'Ali', age: 25});
CREATE (:User {name: 'Khadija', age: 28});
CREATE (:Product {name: 'Laptop', price: 1200});
CREATE (:Product {name: 'Phone', price: 800});
CREATE (:Order {id: 1, total: 2000});

MATCH (u:User {name: 'Salah Ad-Din Bouhdjeur'}), (p:Product {name: 'Laptop'})
CREATE (u)-[:PURCHASED]->(p);

