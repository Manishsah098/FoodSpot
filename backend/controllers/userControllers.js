import userModel from '../models/userModels.js'
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// Helper function to create JWT
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
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
            // FIXED: Changed user_id to user._id
            const token = createToken(user._id);
            res.json({ success: true, message: "Login successful", token })
        }
        else {
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

        // Check if user already exists
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        // Validate email format & strong password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email address" })
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password" })
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name, 
            email, 
            password: hashedPassword
        })

        const user = await newUser.save()

        // Create token using the saved user's ID
        const token = createToken(user._id);
        res.json({ success: true, message: "Account created successfully", token })

    } catch (error) {
        console.log(error);
        // ADDED: Send error response so the client doesn't hang
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body

        if(email == process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({success:true, token})
        } else{
            res.json({success:false, message: 'Invalid login details'})
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export { loginUser, registerUser, adminLogin }