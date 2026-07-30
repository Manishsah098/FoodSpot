import express from 'express';
import { deliveryLogin } from '../controllers/deliveryControllers.js';
import orderModel from '../models/orderModel.js';
import jwt from 'jsonwebtoken';

const deliveryRouter = express.Router();

// Delivery boy login
deliveryRouter.post('/login', deliveryLogin);

// Get orders assigned to this delivery partner (protected)
deliveryRouter.get('/orders', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.json({ success: false, message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'delivery') return res.json({ success: false, message: 'Access denied' });

    const orders = await orderModel.find({
      'assignedDeliveryBoy.id': decoded.id,
      status: { $in: ['Verified by Admin', 'Out for Delivery'] },
    }).sort({ date: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
});

// Update delivery status
deliveryRouter.post('/updatestatus', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.json({ success: false, message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'delivery') return res.json({ success: false, message: 'Access denied' });

    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
});

export default deliveryRouter;
