import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Mailgen from "mailgen";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.USER, // Your email address
        pass: process.env.PASS  // Your email password or app password
    }
});

// Setup Mailgen
const mailgenerator = new Mailgen({
    theme: "default",
    product: {
        name: "FeelHome",
        link: "https://feelhome.com/"
    }
});

const response = {
    body: {
        intro: "OTP VERIFICATION FOR 'feelhome'"
    }
};

// Signup endpoint
export const signup = async (req, res, next) => {
    console.log('Email:', process.env.USER);
    console.log('Password:', process.env.PASS);

    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const otp = generateOTP();

    const mailOptions = {
        from: process.env.USER, // Use environment variable for sender
        to: email,
        subject: 'OTP for Account Verification',
        text: `Your OTP for account verification is ${otp}. It expires in 1 minute.`
    };

    // Generate email content using Mailgen
    const mailOptionsHtml = {
        ...mailOptions,
    };

    try {
        await transporter.sendMail(mailOptionsHtml);

        const otpTimeout = 60000; // 1 minute
        const otpExpiration = Date.now() + otpTimeout;

        req.session.username = username;
        req.session.email = email;
        req.session.hashedPassword = hashedPassword;
        req.session.otp = otp;
        req.session.otpExpiration = otpExpiration;

        req.session.save();

        res.status(200).json({ message: `Please enter OTP sent to ${email} within 1 minute.` });

        setTimeout(() => {
            if (req.session && req.session.otpExpiration && Date.now() > req.session.otpExpiration) {
                req.session.destroy();
                console.log('OTP expired');
            }
        }, otpTimeout);

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
};

// Verify OTP endpoint
export const verifyOTP = async (req, res, next) => {
    const { otp } = req.body;
    console.log("otp", otp);
    console.log("session data", req.session);

    try {
        if (req.session && req.session.otp === otp && Date.now() <= req.session.otpExpiration) {
            const { username, email, hashedPassword } = req.session;

            const newUser = new User({
                username,
                email,
                password: hashedPassword
            });

            await newUser.save();
            req.session.destroy(); 
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '365d' }); // Token expires in 365 days
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }).status(200).json(rest);
            res.status(201).json({ message: 'User added successfully' });
        } else {
            res.status(400).json({ error: 'Invalid or expired OTP' });
        }
    } catch (error) {
        next(error);
    }
};

// Signin endpoint
export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found'));
        
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Invalid credentials'));
        
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '365d' }); // Token expires in 365 days
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }).status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

// Google Signin endpoint
export const google = async (req, res, next) => {
    console.log('hello')
    const { name, email, photo } = req.body;
    console.log(req.body);
    try {
        let validUser = await User.findOne({ email });
        if (validUser) {
            const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '365d' }); // Token expires in 365 days
            const { password: pass, ...rest } = validUser._doc;
            res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }).status(200).json(rest);
        } else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
            const newName = name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
            const newUser = new User({ username: newName, email: email, password: hashedPassword, avatar: photo });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '365d' }); // Token expires in 365 days
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }).status(200).json(rest);
        }
    } catch (error) {
        console.log(error)
        next(error);
    }
};

export const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out');
    } catch (error) {
        console.log('signout error:', error);
        next(error);
    }
};
