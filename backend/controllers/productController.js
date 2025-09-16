import asyncHandler from 'express-async-handler';
import db from '../db.js';

const PRODUCTS_PER_PAGE = 8;

// @desc    Fetch all products with pagination and search
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.pageNumber) || 1;
  const keyword = req.query.keyword ? `%${req.query.keyword}%` : null;
  const category = req.query.category || '';
  const isPostgres = !!process.env.DATABASE_URL;

  let countQuery = 'SELECT COUNT(*) as count FROM products';
  let productsQuery = 'SELECT * FROM products';
  const queryParams = [];
  const countQueryParams = [];
  let whereClauses = [];

  if (keyword) {
    whereClauses.push(isPostgres ? `name ILIKE $${queryParams.length + 1}` : 'name LIKE ?');
    queryParams.push(keyword);
    countQueryParams.push(keyword);
  }

  if (category) {
    whereClauses.push(isPostgres ? `category = $${queryParams.length + 1}` : 'category = ?');
    queryParams.push(category);
    countQueryParams.push(category);
  }

  if (whereClauses.length > 0) {
    const whereString = ' WHERE ' + whereClauses.join(' AND ');
    countQuery += whereString;
    productsQuery += whereString;
  }

  const countResult = await db.query(countQuery, countQueryParams);
  const count = isPostgres ? parseInt(countResult.rows[0].count, 10) : countResult[0][0].count;
  const pages = Math.ceil(count / PRODUCTS_PER_PAGE);

  productsQuery += ` ORDER BY created_at DESC LIMIT ${isPostgres ? `$${queryParams.length + 1}` : '?'} OFFSET ${isPostgres ? `$${queryParams.length + 2}` : '?'}`;
  const offset = (page - 1) * PRODUCTS_PER_PAGE;
  queryParams.push(PRODUCTS_PER_PAGE, offset);

  const productsResult = await db.query(productsQuery, queryParams);
  const products = isPostgres ? productsResult.rows : productsResult[0];

  res.json({ products, page, pages });
});

// @desc    Get top products for home page
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const isPostgres = !!process.env.DATABASE_URL;
  // Fetch 4 most recently created products as our "featured" products
  const result = await db.query(
    'SELECT * FROM products ORDER BY created_at DESC LIMIT 4'
  );
  const products = isPostgres ? result.rows : result[0];
  res.json(products);
});

// @desc    Fetch all unique categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const isPostgres = !!process.env.DATABASE_URL;
  const result = await db.query(
    'SELECT DISTINCT category FROM products ORDER BY category ASC'
  );
  const categories = isPostgres ? result.rows : result[0];
  res.json(categories.map((c) => c.category));
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const isPostgres = !!process.env.DATABASE_URL;
  const result = await db.query(`SELECT * FROM products WHERE id = ${isPostgres ? '$1' : '?'}`, [
    req.params.id,
  ]);
  const product = isPostgres ? result.rows : result[0];
  if (product.length > 0) {
    res.json(product[0]);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, count_in_stock } =
    req.body;
  const isPostgres = !!process.env.DATABASE_URL;
  const query = isPostgres
    ? 'INSERT INTO products (name, price, user_id, image, brand, category, count_in_stock, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id'
    : 'INSERT INTO products (name, price, user_id, image, brand, category, count_in_stock, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  const result = await db.query(
    query,
    [
      name,
      price,
      req.user.id, // Comes from 'protect' middleware
      image || '/images/sample.jpg', // Default image
      brand,
      category,
      count_in_stock,
      description,
    ]
  );
  const newProductId = isPostgres ? result.rows[0].id : result[0].insertId;
  const newProductResult = await db.query(`SELECT * FROM products WHERE id = ${isPostgres ? '$1' : '?'}`, [
    newProductId,
  ]);
  const newProduct = isPostgres ? newProductResult.rows[0] : newProductResult[0][0];
  res.status(201).json(newProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, count_in_stock } =
    req.body;
  const isPostgres = !!process.env.DATABASE_URL;
  const result = await db.query(`SELECT * FROM products WHERE id = ${isPostgres ? '$1' : '?'}`, [
    req.params.id,
  ]);
  const product = isPostgres ? result.rows : result[0];

  if (product.length > 0) {
    const query = isPostgres
      ? 'UPDATE products SET name = $1, price = $2, description = $3, image = $4, brand = $5, category = $6, count_in_stock = $7 WHERE id = $8'
      : 'UPDATE products SET name = ?, price = ?, description = ?, image = ?, brand = ?, category = ?, count_in_stock = ? WHERE id = ?';
    await db.query(
      query,
      [
        name,
        price,
        description,
        image,
        brand,
        category,
        count_in_stock,
        req.params.id,
      ]
    );
    const updatedResult = await db.query(
      `SELECT * FROM products WHERE id = ${isPostgres ? '$1' : '?'}`,
      [req.params.id]
    );
    const updatedProduct = isPostgres ? updatedResult.rows[0] : updatedResult[0][0];
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const isPostgres = !!process.env.DATABASE_URL;
  const result = await db.query(`SELECT * FROM products WHERE id = ${isPostgres ? '$1' : '?'}`, [
    req.params.id,
  ]);
  const product = isPostgres ? result.rows : result[0];

  if (product.length > 0) {
    await db.query(`DELETE FROM products WHERE id = ${isPostgres ? '$1' : '?'}`, [req.params.id]);
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getTopProducts,
};
