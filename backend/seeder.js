import fs from 'fs';
import path from 'path';
import db from './db.js'; // Use the improved, safer db module
import colors from 'colors';

const categories = [
  'Electronics',
  'Computers',
  'Clothing',
  'Footwear',
  'Mobile Phones',
];

const sampleProducts = Array.from({ length: 100 }, (_, i) => {
  const category = categories[i % categories.length];
  const price = (Math.random() * 1000 + 50).toFixed(2);
  const countInStock = Math.floor(Math.random() * 100);

  return {
    name: `${category} Product ${i + 1}`,
    image: `https://placehold.co/600x400?text=${category.replace(' ', '+')}+${i + 1}`,
    description: `This is a sample description for ${category} Product ${i + 1}. It is a high-quality item designed to meet your needs.`,
    brand: `Brand ${String.fromCharCode(65 + (i % 10))}`, // Brand A, Brand B, etc.
    category: category,
    price: price,
    count_in_stock: countInStock,
  };
});

const importData = async () => {
  try {
    console.log('Starting data import...'.yellow.bold);
    const isPostgres = !!process.env.DATABASE_URL;

    // On Render (PostgreSQL), we need to create the schema first.
    if (isPostgres) {
      console.log('Running schema setup for PostgreSQL...'.cyan);
      try {
        const schemaPath = path.join(path.resolve(), 'backend', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        // The 'pg' driver can execute multiple statements at once.
        await db.query(schemaSql);
        console.log('Schema created successfully.'.green);
      } catch (schemaError) {
        console.error(`Error creating schema: ${schemaError}`.red.inverse);
        // Don't exit, maybe the schema already exists. Log and continue.
        console.log('Continuing with data seeding...'.yellow);
      }
    }

    // Clear existing data
    console.log('Clearing existing products and order items...'.cyan);
    // We need to delete from order_items first due to foreign key constraints
    await db.query('DELETE FROM "order_items"');
    await db.query('DELETE FROM "products"');
    console.log('Existing data cleared.'.green);

    // Insert new products
    console.log('Inserting 100 sample products...'.cyan);

    if (isPostgres) {
      // PostgreSQL does not support the `VALUES ?` syntax for batch inserts with `pg`
      for (const p of sampleProducts) {
        await db.query(
          'INSERT INTO "products" (name, image, description, brand, category, price, count_in_stock) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [p.name, p.image, p.description, p.brand, p.category, p.price, p.count_in_stock]
        );
      }
    } else {
      // MySQL supports batch inserts
      const productValues = sampleProducts.map((p) => [
        p.name, p.image, p.description, p.brand, p.category, p.price, p.count_in_stock
      ]);
      const sql =
        'INSERT INTO "products" (name, image, description, brand, category, price, count_in_stock) VALUES ?';
      await db.query(sql, [productValues]);
    }

    console.log('Data Imported Successfully!'.green.bold);
    process.exit();
  } catch (error) {
    console.error(`Error during data import: ${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    console.log('Starting data destruction...'.red.bold);

    // Clear existing data
    console.log('Clearing existing products and order items...'.cyan);
    await db.query('DELETE FROM "order_items"');
    await db.query('DELETE FROM "products"');
    console.log('Data Destroyed Successfully!'.green.bold);
    process.exit();
  } catch (error) {
    console.error(`Error during data destruction: ${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}