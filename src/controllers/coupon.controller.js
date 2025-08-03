import Coupon from '../models/coupon.model.js'

export const getCoupon = async(req, res) => {
    try{
        const coupon = await Coupon.findOne({userId: req.user._id, isActive: true, })
        if(!coupon){
            return res.status(404).json({
                success: false,
                message: "coupon not found with this userid"
            })
        }

        res.status(200).json(coupon || null)
    }
    catch(error){
        console.log("error in getCoupon controller")
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}

export const validateCoupon = async(req, res) => {
    try{
        const {code} = req.body
        const coupon = await Coupon.findOne({code: code, userId: req.user._id, isActive: true})
        if(!coupon){
            return res.status(400).json({
                success: false,
                message: "inavlid coupon code"
            })
        }

        if(coupon.expirationDate < new Date()){
            coupon.isActive = false
            await coupon.save()
            return res.status(400).json({
                success: false,
                message: "coupon has expired"
            })
        }

        res.status(200).json({
            message: 'coupon has applied!',
            code: coupon.code,
            discountPercentage: coupon.discount
        })
    }
    catch(error){
        console.log("error in validateCoupon controller")
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const adminCreateCoupon = async(req, res) => {
    try{
        const {code, discount, userId, expirationDate} = req.body
        if(!code || !discount || !userId || !expirationDate){
            return res.status(400).json({
                success: false,
                message: "all fields are required!"
            })
        }

        const existCoupon = await Coupon.findOne({userId})
        if(existCoupon){
            return res.status(400).json({
                success: false,
                message: "user already has a coupon!"
            })
        }

        const newCoupon = await Coupon.create({
            code,
            discount,
            userId,
            expirationDate: new Date(expirationDate),
            isActive: true
        })

        await newCoupon.save()
        res.status(201).json({
            success: true,
            message: 'coupon created for this userid',
            coupon: newCoupon
        })
    }
    catch(error){
        console.log("error in adminCreate Coupon controller")
        res.status(500).json({message: error.message})
    }
}