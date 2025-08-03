import express from 'express'
import { adminRoute, protectRoute } from '../middleware/auth.js'
import { adminCreateCoupon } from '../controllers/coupon.controller.js'

const router = express.Router()

router.post("/admin/coupon", protectRoute, adminRoute, adminCreateCoupon)
export default router