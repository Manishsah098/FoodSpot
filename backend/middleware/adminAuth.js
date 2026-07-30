import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.json({ success: false, message: 'Not authorized. Admin login required.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Admin token encodes email+password string as payload
    if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({ success: false, message: 'Not authorized. Invalid admin token.' });
    }
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default adminAuth;