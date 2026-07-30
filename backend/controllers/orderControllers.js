import orderModel from '../models/orderModel.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const DELIVERY_FEE = 15;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Place COD order
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      amount: amount + DELIVERY_FEE,
      address,
      paymentMethod: 'cod',
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();
    res.json({ success: true, message: 'Order placed successfully', orderId: newOrder._id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Place Stripe order
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      amount: amount + DELIVERY_FEE,
      address,
      paymentMethod: 'stripe',
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Build Stripe line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: 'inr',
        product_data: { name: 'Delivery Fee' },
        unit_amount: DELIVERY_FEE * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${FRONTEND_URL}/orders?orderId=${newOrder._id}&success=true`,
      cancel_url: `${FRONTEND_URL}/checkout?cancelled=true`,
      metadata: { orderId: newOrder._id.toString() },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Stripe payment via webhook or success redirect
const verifyStripe = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === 'true') {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: 'Payment verified' });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: 'Payment failed, order removed' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all orders (admin)
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get orders for a specific user
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order status (admin or delivery)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Assign delivery boy (admin)
const assignDelivery = async (req, res) => {
  try {
    const { orderId, deliveryBoy } = req.body;
    await orderModel.findByIdAndUpdate(orderId, {
      assignedDeliveryBoy: deliveryBoy,
      status: 'Verified by Admin',
    });
    res.json({ success: true, message: 'Delivery partner assigned' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { placeOrder, placeOrderStripe, verifyStripe, listOrders, userOrders, updateStatus, assignDelivery };
