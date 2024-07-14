import listing from "../models/listing.model.js"

export const createListing = async (req,res,next) => {
    try {
        const listingData = await listing.create(req.body)
        return res.status(201).json(listingData)
    } catch (error) {
        next(error)
    }
}