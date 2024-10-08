import mongoose from 'mongoose'

const listingSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        regularPrice:{
            type:Number,
            required:true
        },
        discountedPrice:{
            type:Number,
            required:true
        },
        bathrooms:{
            type:Number,
            required:true
        },
        bedrooms:{
            type:Number,
            required:true
        },
        parking:{
            type:Boolean,
            required:true
        },
        furnished:{
            type:Boolean,
            required:true
        },
        type:{
            type:String,
            required:true
        },
        pricetype:{
            type:String,
            required:true
        },
        bookingDates: [{
            startDate: { type: Date, required: true },
            endDate: { type: Date, required: true }
        }],
        offer:{
            type:Boolean,
            required:true
        },
        imageUrls:{
            type:Array,
            required:true
        },
        userRef:{
            type:String,
            required:true
        },
    },{timestamps:true}
)

const listing = mongoose.model('Listing',listingSchema)

export default listing