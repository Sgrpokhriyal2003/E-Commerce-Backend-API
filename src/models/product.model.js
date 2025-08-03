import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'product name is required']
    },

    description: {
        type: String,
        required: [true, 'product description is required']
    },

    price: {
        type: Number,
        required: [true, 'product price is required'],
        min: 0
    },

    image: {
        type: String,
        required: [true, 'product image is required']
    },

    publicId: {
        type: String,
        required: [true, 'public id is required']
    },

    category: {
        type: String,
        required: [true, "product category is required"]
    },

    isFeatured:{
        type: Boolean,
        default: false,
    }

}, {timestamps: true})

const Product = mongoose.model("Product", productSchema)
export default Product