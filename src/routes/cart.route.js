import express from 'express'
const router = express.Router()

import {protectRoute} from '../middleware/auth.js'
import {
    addToCart,
    getCartProducts,
    updateQuantity,
    removeAllFromCart
} from '../controllers/cart.controller.js'

router.post("/", protectRoute, addToCart)
router.get("/", protectRoute, getCartProducts)
router.put("/:id", updateQuantity)
router.delete("/", protectRoute, removeAllFromCart)

export default router