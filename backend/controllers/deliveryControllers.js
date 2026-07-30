import jwt from 'jsonwebtoken';

// Delivery boy login using ID + password stored in .env
const deliveryLogin = async (req, res) => {
  try {
    const { deliveryId, password } = req.body;

    // Delivery partners stored as JSON in .env
    const partners = JSON.parse(process.env.DELIVERY_PARTNERS || '[]');
    const partner = partners.find(
      (p) => p.id === deliveryId && p.password === password
    );

    if (!partner) {
      return res.json({ success: false, message: 'Invalid Delivery ID or password' });
    }

    // Create token with delivery role
    const token = jwt.sign(
      { id: partner.id, role: 'delivery', name: partner.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      partner: {
        id: partner.id,
        name: partner.name,
        phone: partner.phone,
        vehicle: partner.vehicle,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { deliveryLogin };
