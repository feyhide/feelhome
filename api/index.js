import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './route/user.route.js';
import authRouter from './route/auth.route.js';
import listingRouter from './route/listing.route.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("CONNECTED TO DATABASE SUCCESSFULLY");
    })
    .catch((err) => {
        console.log(`database error : ${err}`);
    });

const port = 3000;

const Mongodbstore = MongoDBStore(session);
const store = new Mongodbstore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
});

store.on('error', function (error) {
    console.log(error);
});

app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { maxAge: 60000 } 
}));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/listing', listingRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'INTERNAL SERVER ERROR';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    });
});

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});
