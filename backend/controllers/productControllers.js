import productModel from "../models/productModels.js";
import { v2 as cloudinary } from 'cloudinary';

const addProduct = async (req, res) => {
    try {
        // FIX 1: Use {} for Object destructuring, not []
        const { name, price, description, category } = req.body;
        
        // multer puts the file in req.file
        const image = req.file;

        if (!image) {
            return res.json({ success: false, message: "please upload an image" });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });

        const productData = {
            name,
            description,
            category,
            price: Number(price), // Converts string price to a number
            image: result.secure_url,
            date: Date.now()
        };

        // FIX 2: Corrected spelling from 'conslole' to 'console'
        console.log(productData);

        // FIX 3: Changed 'productsModel' to 'productModel' to match your import at the top
        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product added successfully" });

    } catch (error) {
        // Log the actual error to your terminal for debugging
        console.error("Error adding product:", error);
        
        // Return the actual error message to help you identify any further issues
        res.json({ success: false, message: error.message });
    }
}

const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addProduct, listProduct, removeProduct, singleProduct };