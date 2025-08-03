import express from "express";
import dotenv from 'dotenv'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'

//user defined imports
import { connectDB } from "./src/config/db.js";


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



app.listen(PORT, () => {
    console.log(`server is listen on http://localhost:${PORT}`)
    connectDB()
})

