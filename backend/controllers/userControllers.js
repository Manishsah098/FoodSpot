import userModel from '../models/userModels.js'
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// Helper function to create JWT
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({
                success: true,
                message: "Login successful",
                token,
                user: { name: user.name, email: user.email }
            })
        } else {
            res.json({ success: false, message: "Incorrect password" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email address" })
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password (min 8 chars)" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({ name, email, password: hashedPassword })
        const user = await newUser.save()

        const token = createToken(user._id);
        res.json({
            success: true,
            message: "Account created successfully",
            token,
            user: { name: user.name, email: user.email }
        })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login — FIXED
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: 'Invalid admin credentials' })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Google OAuth — create/find user from Google profile data
const googleLogin = async (req, res) => {
    try {
        const { name, email, googleId } = req.body;

        if (!email || !googleId) {
            return res.json({ success: false, message: 'Invalid Google credentials' });
        }

        let user = await userModel.findOne({ email });

        if (!user) {
            // Create new user without password (Google auth)
            user = new userModel({
                name: name || email.split('@')[0],
                email,
                password: `google_${googleId}`, // placeholder, not used for login
            });
            await user.save();
        }

        const token = createToken(user._id);
        res.json({
            success: true,
            token,
            user: { name: user.name, email: user.email }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { loginUser, registerUser, adminLogin, googleLogin }