import asyncHandler from '../middleware/asyncHandler.js';
import db from '../db.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, totalPrice, shippingAddress } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  try {
    // In a real app, you would wrap these in a transaction.
    // For simplicity with the current db setup, we'll execute them sequentially.
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, total_price, shipping_address, shipping_city, shipping_postal_code, shipping_country) VALUES (?, ?, ?, ?, ?, ?)',
      [
        req.user.id,
        totalPrice,
        shippingAddress.address,
        shippingAddress.city,
        shippingAddress.postalCode,
        shippingAddress.country,
      ]
    );
    const orderId = orderResult.insertId;

    const orderItemsData = orderItems.map((item) => [
      orderId,
      item.id,
      item.name,
      item.quantity,
      item.price,
      item.image,
    ]);

    await db.query(
      'INSERT INTO order_items (order_id, product_id, name, quantity, price, image) VALUES ?',
      [orderItemsData]
    );
    
    const [newOrder] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    res.status(201).json(newOrder[0]);

  } catch (error) {
    // In a real app with transactions, you would rollback here.
    res.status(500);
    throw new Error('Error creating order: ' + error.message);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const [orders] = await db.query(
      `SELECT o.*, u.username, u.email 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?`,
      [req.params.id]
    );

    if (orders.length > 0) {
      // Check if the user is an admin or the owner of the order
      if (orders[0].user_id !== req.user.id && !req.user.isAdmin) {
        res.status(403);
        throw new Error('Not authorized to view this order');
      }
      const [orderItems] = await db.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [req.params.id]
      );
      res.json({ ...orders[0], orderItems });
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);

    if (orders.length > 0) {
      // In a real app, you'd verify payment here
      await db.query(
        'UPDATE orders SET is_paid = 1, paid_at = NOW(), payment_method = ? WHERE id = ?',
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
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(orders);
});

// --- ADMIN CONTROLLERS ---

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const [orders] = await db.query(`
      SELECT o.*, u.username 
      FROM orders o 
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
});

// @desc    Update order to delivered (Admin)
// @route   PUT /api/admin/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    await db.query(
      'UPDATE orders SET is_delivered = 1, delivered_at = NOW() WHERE id = ?',
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
