import express from "express";
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001


app.listen(PORT, () => {
    console.log(`server is listen on http://localhost:${PORT}`)
})

