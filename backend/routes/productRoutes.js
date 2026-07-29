import express from 'express'
import { addProduct, listProduct, removeProduct, singleProduct } from '../controllers/productControllers.js'
import upload from '../middleware/multer.js'

const productRouter = express.Router();

productRouter.post('/add', upload.single("image"), addProduct)
productRouter.get('/list', listProduct)
productRouter.post('/remove', removeProduct)
productRouter.get('/single', singleProduct)

export default productRouter