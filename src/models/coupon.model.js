import mongoose from "mongoose";
const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'coupon code is required'],
    },

    discount: {
        type: Number,
        required: [true, 'discount is required'],
        min: 0,
        max: 100
    },

    expirationDate: {
        type: Date,
        required: [true, 'expiration date is required'],
    },

    isActive: {
        type: Boolean,
        required: [true, 'isActive is required'],
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    }
}, {timestamps: true})


const Coupon = mongoose.model("Coupon", couponSchema)
export default Coupon