import express from "express";
import dotenv from 'dotenv'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'

//user defined imports
import { connectDB } from "./src/config/db.js";
import authRoute from './src/routes/auth.route.js'
import productRoute from './src/routes/product.route.js'
import cartRoute from './src/routes/cart.route.js'
import couponRoute from './src/routes/coupon.route.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))

app.use(cookieParser())

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome To E-Commerce Backend API 💸"
    })
})

app.use("/api/auth", authRoute)
app.use("/api/product", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/coupon", couponRoute);

app.listen(PORT, () => {
    console.log(`server is listen on http://localhost:${PORT}`)
    connectDB()
})

