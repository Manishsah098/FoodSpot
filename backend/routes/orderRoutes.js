import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import {
  placeOrder, placeOrderStripe, verifyStripe,
  listOrders, userOrders, updateStatus, assignDelivery
} from '../controllers/orderControllers.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Customer routes
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/verifyStripe', verifyStripe);
orderRouter.post('/userorders', authUser, userOrders);

// Admin routes
orderRouter.get('/list', adminAuth, listOrders);
orderRouter.post('/status', adminAuth, updateStatus);
orderRouter.post('/assign', adminAuth, assignDelivery);

export default orderRouter;
