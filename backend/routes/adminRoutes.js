import express from 'express';
import { getUsers } from '../controllers/userController.js';
import { getOrders, getOrderById, updateOrderToDelivered } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.route('/users').get(protect, admin, getUsers);

// We will implement the delete user feature in a later step
// router.route('/users/:id').delete(protect, admin, deleteUser);

// Order routes
router.route('/orders').get(protect, admin, getOrders);
router.route('/orders/:id').get(protect, admin, getOrderById);
router.route('/orders/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;
