db = db.getSiblingDB('mydb'); // Crée ou se connecte à la base de données 'mydb'

// Insère des données dans la collection "users"
db.users.insertMany([
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Doe', email: 'jane@example.com' }
]);

// Ajoute d'autres collections ou données ici si nécessaire
