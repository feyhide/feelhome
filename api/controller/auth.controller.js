import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js"
import jwt from 'jsonwebtoken'

export const signup = async (req,res,next) => {
    const {username,email,password} = req.body
    const hashedPassword = bcryptjs.hashSync(password,10)
    const newUser = new User({username,email,password:hashedPassword})
    try {
        await newUser.save()
        res.status(201).json(`user added successfully`)    
    } catch (error) {
       next(error)
    }

}  

export const signin = async (req,res,next) => {
    const {email,password} = req.body
    try {
        const validUser = await User.findOne({email})
        if(!validUser) return next(errorHandler(404,'user not found'))
        const validPassword = bcryptjs.compareSync(password,validUser.password)
        if(!validPassword) return next(errorHandler(401,'invalid credential'))
        
        const token = jwt.sign({id: validUser._id},process.env.JWT_SECRET)
        const {password:pass, ...rest} = validUser._doc
        res.cookie('access_token',token,{httpOnly:true,expiresIn: Date.now()+24*60}).status(200).json(rest)
    } catch (error) {
        next(error)        
    }
}

export const google = async (req, res, next) => {
    const { name, email, photo } = req.body;
    console.log(req.body)
    try {
        let validUser = await User.findOne({ email });
        if (validUser) {
            const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = validUser._doc;
            res.cookie('access_token', token, { httpOnly: true, expiresIn: Date.now() + 24 * 60 }).status(200).json(rest);
        } else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
            let newName = name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
            const newUser = new User({ username: newName, email: email, password: hashedPassword, avatar: photo });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('access_token', token, { httpOnly: true, expiresIn: Date.now() + 24 * 60 }).status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }
}

    