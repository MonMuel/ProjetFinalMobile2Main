
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
        ('iPhone 15', 'Smartphone Apple dernière génération', 1199.99, 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-1.jpg'),
        ('Samsung Galaxy S24', 'Smartphone Android haut de gamme', 999.99, 'https://stg-images.samsung.com/is/image/samsung/assets/ca/smartphones/galaxy-s24-ultra/images/hotfix4/galaxy-s24-ultra-highlights-color-titanium-green-back-mo.jpg?imbypass=true'),
        ('MacBook Pro', 'Ordinateur portable Apple M3', 2499.99, 'https://www.apple.com/newsroom/images/product/mac/standard/Apple-MacBook-Pro-M2-Pro-and-M2-Max-hero-230117.jpg.og.jpg?202602260727'),
        ('AirPods Pro', 'Écouteurs sans fil avec réduction de bruit', 299.99, 'https://www.apple.com/v/airpods-pro/r/images/overview/product-viewer/closer_look_initial__cksqga5hm77m_large.jpg'),
        ('iPad Air', 'Tablette Apple polyvalente', 749.99, 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-air-finish-select-gallery-202405-13inch-blue-wifi?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=SzlUeW5ITUpKK1FKdDdNS0xNUVhmM3hxSU9Rc1hENld5ZlZGbisxZU9hWGJrbFd6ZHBvVk05L3d0WWlJMkh3MEU1V0hVSjZLVHJGenZsOFVicTBNclV1ZnhKeHNGWFhISWx4Q0lTRXA4dkY5Q2drLzhtOFgzejV4MENrZ0JFZVBwak9PMXpaSGlQNVErR3pISzM5NVpB&traceId=1'),
        ('Sony WH-1000XM5', 'Casque audio premium sans fil', 379.99, 'https://media.ldlc.com/r1600/ld/products/00/06/19/52/LD0006195210.jpg'),
        ('Dell XPS 15', 'Ordinateur portable Windows performant', 1899.99, 'https://m.media-amazon.com/images/I/719CAihgtTL.jpg');
    `);
  }

  // Corrige les anciennes URLs cassées dans les bases déjà créées.
  await db.runAsync(
    `UPDATE Produit
     SET image = ?
     WHERE nom = 'iPhone 15'
       AND (
         image IS NULL
         OR TRIM(image) = ''
         OR image = 'https://www.wireless.walmart.ca/wp-content/uploads/2024/01/iPhone-15.jpg'
         OR image = 'https://upload.wikimedia.org/wikipedia/commons/6/67/IPhone_15_Blue.svg'
         OR image LIKE 'https://via.placeholder.com/%'
       );`,
    ['https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-1.jpg']
  );

  await db.runAsync(
    `UPDATE Produit
     SET image = ?
     WHERE nom = 'Samsung Galaxy S24'
       AND (
         image IS NULL
         OR TRIM(image) = ''
         OR image LIKE 'https://via.placeholder.com/%'
         OR image LIKE 'https://placehold.co/%'
       );`,
    ['https://stg-images.samsung.com/is/image/samsung/assets/ca/smartphones/galaxy-s24-ultra/images/hotfix4/galaxy-s24-ultra-highlights-color-titanium-green-back-mo.jpg?imbypass=true']
  );

  await db.runAsync(
    `UPDATE Produit
     SET image = ?
     WHERE nom = 'MacBook Pro'
       AND (
         image IS NULL
         OR TRIM(image) = ''
         OR image LIKE 'https://via.placeholder.com/%'
         OR image LIKE 'https://placehold.co/%'
       );`,
    ['https://www.apple.com/newsroom/images/product/mac/standard/Apple-MacBook-Pro-M2-Pro-and-M2-Max-hero-230117.jpg.og.jpg?202602260727']
  );

  await db.runAsync(
    `UPDATE Produit
     SET image = ?
     WHERE nom = 'AirPods Pro'
       AND (
         image IS NULL
         OR TRIM(image) = ''
         OR image = 'https://placehold.co/300x300/png?text=AirPods+Pro'
         OR image LIKE 'https://via.placeholder.com/%'
       );`,
    ['https://www.apple.com/v/airpods-pro/r/images/overview/product-viewer/closer_look_initial__cksqga5hm77m_large.jpg']
  );

  await db.runAsync(
    `UPDATE Produit
     SET image = ?
     WHERE nom = 'iPad Air'
       AND (
         image IS NULL
         OR TRIM(image) = ''
         OR image = 'https://fdn2.gsmarena.com/vv/pics/apple/apple-ipad-air-1.jpg'
         OR image LIKE 'https://via.placeholder.com/%'
       );`,
    ['https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-air-finish-select-gallery-202405-13inch-blue-wifi?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=SzlUeW5ITUpKK1FKdDdNS0xNUVhmM3hxSU9Rc1hENld5ZlZGbisxZU9hWGJrbFd6ZHBvVk05L3d0WWlJMkh3MEU1V0hVSjZLVHJGenZsOFVicTBNclV1ZnhKeHNGWFhISWx4Q0lTRXA4dkY5Q2drLzhtOFgzejV4MENrZ0JFZVBwak9PMXpaSGlQNVErR3pISzM5NVpB&traceId=1']
  );

  await db.runAsync(
    `UPDATE Produit
     SET image = ?
     WHERE nom = 'Sony WH-1000XM5'
       AND (
         image IS NULL
         OR TRIM(image) = ''
         OR image = 'https://fdn2.gsmarena.com/vv/pics/sony/sony-wh-1000xm5-1.jpg'
         OR image = 'https://placehold.co/300x300/png?text=Sony+WH-1000XM5'
         OR image LIKE 'https://via.placeholder.com/%'
       );`,
    ['https://media.ldlc.com/r1600/ld/products/00/06/19/52/LD0006195210.jpg']
  );

  await db.runAsync(
    `UPDATE Produit
     SET image = ?
     WHERE nom = 'Dell XPS 15'
       AND (
         image IS NULL
         OR TRIM(image) = ''
         OR image = 'https://fdn2.gsmarena.com/vv/pics/dell/dell-xps-15-1.jpg'
         OR image = 'https://placehold.co/300x300/png?text=Dell+XPS+15'
         OR image LIKE 'https://via.placeholder.com/%'
       );`,
    ['https://m.media-amazon.com/images/I/719CAihgtTL.jpg']
  );

  const clientCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM Client');
  if (clientCount.count === 0) {
    await db.runAsync(`
      INSERT INTO Client (nom, mdp, admin, adresse, langue_preferee) VALUES
        ('Admin', '1234', 1, '123 Rue Principale', 'fr'),
        ('Client Test', '1234', 0, '456 Avenue du Client', 'fr');
    `);
  }
}
