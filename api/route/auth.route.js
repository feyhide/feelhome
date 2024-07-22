import express from 'express'
import { google, signin, signout, signup, verifyOTP } from '../controller/auth.controller.js'

const router = express.Router()

router.post("/signup",signup)
router.post("/signin",signin)
router.post("/verifyOTP",verifyOTP)
router.post("/google",google)
router.get("/signout",signout)

export default router