import express from 'express'
import { createListing, deleteListing, updateListing,getListing, getAll } from '../controller/listing.controller.js'
import { verifyToken } from '../utils/verifyuser.js'
const router = express.Router()

router.post("/create",verifyToken,createListing)
router.delete("/delete/:id",verifyToken,deleteListing)
router.patch("/update/:id",verifyToken,updateListing)
router.get("/get/:id",getListing)
router.get("/get",getAll)

export default router