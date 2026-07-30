import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js'
import orderRouter from './routes/orderRoutes.js'
import deliveryRouter from './routes/deliveryRoutes.js'

const app = express()
const port = process.env.PORT || 4000

connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
}))

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/order', orderRouter)
app.use('/api/delivery', deliveryRouter)

app.get('/', (req, res) => {
  res.send("FoodSpot API Working ✅")
})

app.listen(port, () => console.log('server started on port: ' + port))