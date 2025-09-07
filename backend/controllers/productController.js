import asyncHandler from 'express-async-handler';
import pool from '../db.js';

const PRODUCTS_PER_PAGE = 8;

// @desc    Fetch all products with pagination and search
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.pageNumber) || 1;
  const keyword = req.query.keyword ? `%${req.query.keyword}%` : '%';
  const category = req.query.category || '';

  let countQuery = 'SELECT COUNT(*) as count FROM products WHERE name LIKE ?';
  let productsQuery = 'SELECT * FROM products WHERE name LIKE ?';
  const queryParams = [keyword];
  const countQueryParams = [keyword];

  if (category) {
    countQuery += ' AND category = ?';
    productsQuery += ' AND category = ?';
    queryParams.push(category);
    countQueryParams.push(category);
  }

  const [countResult] = await pool.query(countQuery, countQueryParams);
  const count = countResult[0].count;
  const pages = Math.ceil(count / PRODUCTS_PER_PAGE);

  productsQuery += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  const offset = (page - 1) * PRODUCTS_PER_PAGE;
  queryParams.push(PRODUCTS_PER_PAGE, offset);

  const [products] = await pool.query(productsQuery, queryParams);

  res.json({ products, page, pages });
});

// @desc    Get top products for home page
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  // Fetch 4 most recently created products as our "featured" products
  const [products] = await pool.query(
    'SELECT * FROM products ORDER BY created_at DESC LIMIT 4'
  );
  res.json(products);
});

// @desc    Fetch all unique categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const [categories] = await pool.query(
    'SELECT DISTINCT category FROM products ORDER BY category ASC'
  );
  res.json(categories.map((c) => c.category));
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [
    req.params.id,
  ]);
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
  const [result] = await pool.query(
    'INSERT INTO products (name, price, user_id, image, brand, category, count_in_stock, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
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
  const [newProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [
    result.insertId,
  ]);
  res.status(201).json(newProduct[0]);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, count_in_stock } =
    req.body;
  const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [
    req.params.id,
  ]);

  if (product.length > 0) {
    await pool.query(
      'UPDATE products SET name = ?, price = ?, description = ?, image = ?, brand = ?, category = ?, count_in_stock = ? WHERE id = ?',
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
    const [updatedProduct] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );
    res.json(updatedProduct[0]);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [
    req.params.id,
  ]);

  if (product.length > 0) {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
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
