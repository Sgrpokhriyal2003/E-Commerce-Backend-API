import express from 'express'
const router = express.Router()

import {adminRoute, protectRoute} from '../middleware/auth.js'
import {getAnalyticData, getDailySalesData} from '../controllers/analytic.controller.js'

router.get("/", protectRoute, adminRoute, async(req, res) => {
    try{
        const analyticsData = await getAnalyticData()
        const endDate = new Date()
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)

        const dailySalesdata = await getDailySalesData(startDate, endDate)
        res.status(200).json({
            analyticsData,
            dailySalesdata
        })

    }
    catch(error){
        console.log('error in analytics route', error.message)
        res.status(500).json({
            message: 'server error',
            error: error.message
        })
    }
})
export default router