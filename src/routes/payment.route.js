import express from 'express'
import { protectRoute } from '../middleware/auth.js'
import { createCheckOutSession, checkOutSuccess } from '../controllers/payment.controller.js'

const router = express.Router()

router.post("/create-checkout-session", protectRoute, createCheckOutSession)
router.post("/checkout-success", protectRoute, checkOutSuccess)

export default router