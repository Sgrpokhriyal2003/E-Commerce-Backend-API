import {redis} from '../lib/redis.js'
import cloudinary from '../lib/cloudinary.js'
import Product from '../models/product.model.js'

export const createProduct = async(req, res) => {
    try{
        const {name, description, price, image, category, isFeatured, publicId} = req.body
        if(!name || !description || !price || !image || !category || !isFeatured || !publicId){
            return res.status(400).json({
                success: false,
                message: "all fields are required!"
            })
        }
        let cloudinaryResponse = null
        if(req.files && req.files.image){
            cloudinaryResponse = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
                folder: "Images"
            })
        }
        // console.log('image', cloudinaryResponse)
        const product = await Product.create({
            name,
            price,
            description,
            category,
            isFeatured,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : "",
            publicId: cloudinaryResponse.public_id
        })

        res.status(201).json({
            success: true,
            data: product
        })

    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "error in create product controller",
            error: error.message
        })
    }

}

export const getAllProduct = async(req, res) => {
    try{
        const products = await Product.find({})
        if(products){
            return res.status(404).json({
                success: false,
                message: "products not found!"
            })
        }

        res.status(200).json({
            success: true,
            data: products
        })

    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "error in getAll product controller",
            error: error.message
        })
    }
}

export const getFeaturedProducts = async(req, res) => {
    try{
        let featuredProducts = await redis.get("featured_products")
        if(featuredProducts){
            console.log("cached!, come from redis db")
            return res.status(200).json(JSON.parse(featuredProducts))
        }

        //if not in redis
        featuredProducts = await Product.find({isFeatured: true}).lean()
        if(featuredProducts){
            return res.status(404).json({
                success: false,
                message:"no featured product is found!"
            })
        }

        //store in redis
        await redis.set("featured_products", JSON.stringify(featuredProducts))
        console.log("not cahced! come from db")
        res.status(200).json({
            success: true,
            data: featuredProducts
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "error in getFeatured product controller",
            error: error.message
        })
    }
}

export const getProductByCategory = async(req, res) => {
    try{
        const {category} = req.params
        const products = await Product.find({category})
        if(!products){
            return res.status(404).json({
                success: false,
                message: "products from this category is not found!"
            })
        }

        res.status(200).json({
            success: true,
            data: products
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "error in getProduct by category controller",
            error: error.message
        })
    }
}

export const getRecommendedProducts = async(req, res) => {
    try{
        const products = await Product.aggregate([
            {
                $sample: {size: 4}
            },
            {
                $project: {
                    _id:1,
                    name:1,
                    image:1,
                    price:1,
                    description:1
                }
            }
        ])

        res.status(200).json({
            success: true,
            data: products
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "error in getRecommended product controller",
            error: error.message
        })
    }
}

export const deleteProduct = async(req, res) => {
    try{
        const {id} = req.params
        const product = await Product.findById(id)
        if(!product){
            return res.status(404).json({
                success: false,
                message: "product is not exist with this id"
            })
        }

        if(product.image && product.publicId){
            try{
                await cloudinary.uploader.destroy(product.publicId)
                console.log('product deleted from cloudinary!')
            }
            catch(error){
                console.log('error while deleting product from cloudinary')
            }
        }

        await product.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: "product deleted successfully"
        })

    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "error in delete product controller",
            error: error.message
        })
    }
}

export const toggleFeatureProduct = async(req, res) => {
    try{
        const {id} = req.params
        const product = await Product.findById(id)
        if(product){
           product.isFeatured = !product.isFeatured
           const updatedProduct = await product.save()
           await updateFeatureProductCache() 
           res.status(200).json({
                success: true,
                data: updatedProduct
           }) 
        }
        else{
            return res.status(404).json({
                success: false,
                message: "product is not exist in db "
            })
        }

    }   
    catch(error){
        res.status(500).json({
            success: false,
            message: "error in toggleFeatured product controller",
            error: error.message
        })
    } 
}

const updateFeatureProductCache = async () => {
    try{
        const featureProduct = await Product.find({isFeatured: true}).lean()
        await redis.set("featured_products", JSON.stringify(featureProduct))
    }
    catch(error){
        console.log('error in updatedFeatured Product Cached Function!', error.message)
    }
}