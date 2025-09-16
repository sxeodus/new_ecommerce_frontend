import asyncHandler from '../middleware/asyncHandler.js';
import db from '../db.js'; // Use the improved, safer db module

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, totalPrice, shippingAddress } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const isPostgres = !!process.env.DATABASE_URL;
  const connection = await db.getConnection(); // Works for both pg and mysql

  try {
    await connection.beginTransaction();

    const orderQuery = isPostgres
      ? 'INSERT INTO orders (user_id, total_price, shipping_address, shipping_city, shipping_postal_code, shipping_country) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id'
      : 'INSERT INTO orders (user_id, total_price, shipping_address, shipping_city, shipping_postal_code, shipping_country) VALUES (?, ?, ?, ?, ?, ?)';

    const orderParams = [
      req.user.id,
      totalPrice,
      shippingAddress.address,
      shippingAddress.city,
      shippingAddress.postalCode,
      shippingAddress.country,
    ];

    const orderResult = await connection.query(orderQuery, orderParams);
    const orderId = isPostgres ? orderResult.rows[0].id : orderResult[0].insertId;

    const orderItemsValues = orderItems.map((item) => [
      orderId,
      item.id,
      item.name,
      item.quantity,
      item.price,
      item.image,
    ]);

    // pg driver doesn't support batch insert with `?`, so we build the query string
    if (isPostgres) {
      for (const item of orderItemsValues) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, name, quantity, price, image) VALUES ($1, $2, $3, $4, $5, $6)',
          item
        );
      }
    } else {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, name, quantity, price, image) VALUES ?',
        [orderItemsValues]
      );
    }
    
    const [newOrderResult] = isPostgres ? (await connection.query('SELECT * FROM orders WHERE id = $1', [orderId])).rows : (await connection.query('SELECT * FROM orders WHERE id = ?', [orderId]))[0];
    await connection.commit();
    res.status(201).json(newOrderResult);
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error while creating order.' });
  } finally {
    if (connection) connection.release();
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const isPostgres = !!process.env.DATABASE_URL;
    const result = await db.query(
      `SELECT o.*, u.username, u.email 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.id = ${isPostgres ? '$1' : '?'}`,
      [req.params.id]
    );

    if (orders.length > 0) {
      // Check if the user is an admin or the owner of the order
      if (orders[0].user_id !== req.user.id && !req.user.isAdmin) {
        res.status(403);
        throw new Error('Not authorized to view this order');
      }
      const itemsResult = await db.query(
        `SELECT * FROM order_items WHERE order_id = ${isPostgres ? '$1' : '?'}`,
        [req.params.id]
      );
      res.json({ ...orders[0], orderItems: isPostgres ? itemsResult.rows : itemsResult[0] });
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const isPostgres = !!process.env.DATABASE_URL;
    const { rows: orders } = await db.query(`SELECT * FROM orders WHERE id = ${isPostgres ? '$1' : '?'}`, [req.params.id]);

    if (orders.length > 0) {
      // In a real app, you'd verify payment here
      await db.query(
        `UPDATE orders SET is_paid = 1, paid_at = NOW(), payment_method = ${isPostgres ? '$1' : '?'} WHERE id = ${isPostgres ? '$2' : '?'}`,
        ['MockGateway', req.params.id]
      );
      res.json({ message: 'Order paid successfully' });
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const isPostgres = !!process.env.DATABASE_URL;
    const { rows: orders } = await db.query(
      `SELECT * FROM orders WHERE user_id = ${isPostgres ? '$1' : '?'} ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(isPostgres ? orders : orders[0]);
});

// --- ADMIN CONTROLLERS ---

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const isPostgres = !!process.env.DATABASE_URL;
    const { rows: orders } = await db.query(`
      SELECT o.*, u.username 
      FROM orders o 
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json(isPostgres ? orders : orders[0]);
});

// @desc    Update order to delivered (Admin)
// @route   PUT /api/admin/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const isPostgres = !!process.env.DATABASE_URL;
    await db.query(
      `UPDATE orders SET is_delivered = 1, delivered_at = NOW() WHERE id = ${isPostgres ? '$1' : '?'}`,
      [req.params.id]
    );
    res.json({ message: 'Order marked as delivered' });
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
};
