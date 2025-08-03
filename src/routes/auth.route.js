import express from 'express'
const router = express.Router()

import { signup, signin, signout, refreshToken, getProfile } from '../controllers/user.controller.js'
import { protectRoute } from '../middleware/auth.js'

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/signout", signout)
router.post('/refresh-token', refreshToken)
router.get('/profile',  protectRoute, getProfile)

export default router