import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("CONNECTED TO DATABASE SUCCESSFULLY")
        })
        .catch((err)=>{
            console.log(`database error : ${err}`)
        })

const app = express()


const port = 3000
app.listen(port,()=>{
    console.log(`server is listening on port ${port}`)
})