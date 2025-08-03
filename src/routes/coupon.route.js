import express from 'express'
const router = express.Router()

import { protectRoute } from '../middleware/auth.js'
import { getCoupon, validateCoupon } from '../controllers/coupon.controller.js'

router.get("/", protectRoute, getCoupon)
router.post('/validate',  protectRoute, validateCoupon)

export default router