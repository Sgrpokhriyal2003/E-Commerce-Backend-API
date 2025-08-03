import express from 'express'
const router = express.Router()

import {protectRoute, adminRoute} from '../middleware/auth.js'
import { 
    getAllProduct,
    getFeaturedProducts,
    getProductByCategory,
    getRecommendedProducts,
    createProduct,
    toggleFeatureProduct,
    deleteProduct } from '../controllers/product.controller.js'


router.get("/", protectRoute, adminRoute, getAllProduct)
router.get("/featured", getFeaturedProducts)
router.get("/category/:category", getProductByCategory)
router.get("/recommendation", getRecommendedProducts)
router.post("/", protectRoute, adminRoute, createProduct)
router.patch("/:id", protectRoute, adminRoute, toggleFeatureProduct)
router.delete("/:id", protectRoute, adminRoute, deleteProduct)


export default router