
export async function migrateDB(db) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Produit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      description TEXT,
      prix REAL NOT NULL,
      image TEXT
    );
  `);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Client (
      nom TEXT NOT NULL,
      mdp TEXT NOT NULL,
      admin INTEGER NOT NULL DEFAULT 0 CHECK (admin IN (0, 1)),
      adresse TEXT,
      langue_preferee TEXT
    );
  `);
  // Insérer les produits seulement s'ils n'existent pas encore
  const count = await db.getFirstAsync('SELECT COUNT(*) as count FROM Produit');
  if (count.count === 0) {
    await db.runAsync(`
      INSERT INTO Produit (nom, description, prix, image) VALUES
        ('iPhone 15', 'Smartphone Apple dernière génération', 1199.99, 'https://via.placeholder.com/150'),
        ('Samsung Galaxy S24', 'Smartphone Android haut de gamme', 999.99, 'https://via.placeholder.com/150'),
        ('MacBook Pro', 'Ordinateur portable Apple M3', 2499.99, 'https://via.placeholder.com/150'),
        ('AirPods Pro', 'Écouteurs sans fil avec réduction de bruit', 299.99, 'https://via.placeholder.com/150'),
        ('iPad Air', 'Tablette Apple polyvalente', 749.99, 'https://via.placeholder.com/150'),
        ('Sony WH-1000XM5', 'Casque audio premium sans fil', 379.99, 'https://via.placeholder.com/150'),
        ('Dell XPS 15', 'Ordinateur portable Windows performant', 1899.99, 'https://via.placeholder.com/150');
    `);
  }
  const clientCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM Client');
  if (clientCount.count === 0) {
    await db.runAsync(`
      INSERT INTO Client (nom, mdp, admin, adresse, langue_preferee) VALUES
        ('Admin', '1234', 1, '123 Rue Principale', 'fr'),
        ('Client Test', '1234', 0, '456 Avenue du Client', 'fr');
    `);
  }
}
