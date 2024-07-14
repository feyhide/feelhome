import listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js"

export const createListing = async (req,res,next) => {
    try {
        const listingData = await listing.create(req.body)
        return res.status(201).json(listingData)
    } catch (error) {
        next(error)
    }
}

export const deleteListing = async (req,res,next) => {
    const listingUnit = await listing.findById(req.params.id)
    
    if(!listingUnit){
        return next(errorHandler(404,"listing not found"))
    }
    
    if(req.user.id !== listingUnit.userRef){
        return next(errorHandler(401,"you can only delete your own listing"))
    }
    
    try {
        await listing.findByIdAndDelete(req.params.id)
        res.status(200).json("successfully deleted")
    } catch (error) {
        next(error)
    }
}