import mongoose from "mongoose";

// Added 'export' before 'const'
export const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log('✅ MongoDB connected');
    })

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/food-del`)
    } catch (error) {
        console.log("❌ DB Connection Error:", error);
    }
}