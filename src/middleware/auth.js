import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export const protectRoute = async(req, res, next) => {
    try{
        const accessToken = req.cookies.accessToken
        if(!accessToken){
            return res.status(401).json({
                success: false,
                message: 'unauthorized! - no access token is provided'
            })
        }


        try{
            const decoded = jwt.verify(accessToken, process.env.JWT_ACCESSTOKEN)
            const user = await User.findById(decoded.userId).select('-password')
            if(!user){
                return res.status(401).json({
                    success: false,
                    message: "user not found! incorrect user or accesstoken"
                })
            }

            req.user = user
            next()
        }
        catch(error){
            if(error.name === "TokenExpiredError"){
                return res.status(401).json({
                    success: false,
                    message: "unauthorized - access token expired"
                })
            }

            throw error
        }

    }
    catch(error){
        console.log(`error in protect route middleware: `, error.message)
        return res.status(401).json({
            success: false,
            message: "Unauthorized - invalid access token"
        })   
    }
}

export const adminRoute = (req, res, next) => {
    try{
        if(req.user && req.user.role === 'admin'){
            next()
        }
        else{
            return res.status(403).json({
                success: false,
                message: "access denied - only admin can perform this operation"
            })
        }
    }
    catch(error){
        console.log("error in admin route", error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}