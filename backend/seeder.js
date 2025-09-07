import pool from './db.js';

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
  const connection = await pool.getConnection();
  try {
    console.log('Starting data import...');

    // Clear existing data
    console.log('Clearing existing products and order items...');
    // We need to delete from order_items first due to foreign key constraints
    await connection.query('DELETE FROM order_items');
    await connection.query('DELETE FROM products');
    console.log('Existing data cleared.');

    // Insert new products
    console.log('Inserting 100 sample products...');
    const productValues = sampleProducts.map(p => [
      p.name,
      p.image,
      p.description,
      p.brand,
      p.category,
      p.price,
      p.count_in_stock,
    ]);

    const sql = 'INSERT INTO products (name, image, description, brand, category, price, count_in_stock) VALUES ?';
    await connection.query(sql, [productValues]);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error during data import: ${error}`);
    process.exit(1);
  } finally {
    connection.release();
  }
};

const destroyData = async () => {
  const connection = await pool.getConnection();
  try {
    console.log('Starting data destruction...');

    // Clear existing data
    console.log('Clearing existing products and order items...');
    await connection.query('DELETE FROM order_items');
    await connection.query('DELETE FROM products');
    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error during data destruction: ${error}`);
    process.exit(1);
  } finally {
    connection.release();
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}