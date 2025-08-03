import { redis } from '../lib/redis.js'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const generateToken = (userId) => {
    const accessToken = jwt.sign({userId}, process.env.JWT_ACCESSTOKEN, {
        expiresIn: "15min"
    })

    const refreshToken = jwt.sign({userId}, process.env.JWT_REFRESHTOKEN, {
        expiresIn: "3d"
    })

    return {accessToken, refreshToken}
}

const storeRefreshToken = async(userId, refreshToken) => {
    await redis.set(`refreshToken:${userId}`, refreshToken, "EX", 7*24*60*60) //7d
}

const seCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000 //15 min
    })

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7*24*60*60*1000 //7 day
    })
}


export const signup = async(req, res) => {
    const {email, password, name, role} = req.body;
    if(!email || !name || !password || !role){
        return res.status(400).json({
            success: false,
            message: "all fields are required!"
        })
    }

    try{
        const userExist = await User.findOne({email})
        if(userExist){
            return res.status(400).json({
                success: false,
                message: "user already exists!"
            })
        }

        const newUser = await User.create({
            name,
            email,
            password,
            role
        })

        const {accessToken, refreshToken} = generateToken(newUser._id)
        await storeRefreshToken(newUser._id, refreshToken)
        seCookies(res, accessToken, refreshToken)

        res.status(201).json({
            success: true,
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        })
    }
    catch(error){
        console.log(`Error in signup controller ${error.message}`)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

export const signin = async(req, res) => {
    try{
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "email and password is required!"
            })
        }
    
        const user = await User.findOne({email})
        if(user && (await user.comparePassword(password))){
            const {accessToken, refreshToken} = generateToken(user._id)
            await storeRefreshToken(user._id, refreshToken)
            seCookies(res, accessToken, refreshToken)
    
            res.status(200).json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            })
        }
        else{
            res.status(400).json({
                success: false,
                message: "invalid username or password"
            })
        }
    }
    catch(error){
        console.log(`Error in login controller ${error.message}`)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
   
}

export const signout = async(req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken
        if(refreshToken){
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESHTOKEN)
            await redis.del(`refreshToken:${decoded.userId}`)
        }

        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        res.status(200).json({
            success: true,
            message: "logged out successfully!"
        })
    }
    catch(error){
        console.log(`Error in logout controller ${error.message}`)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const refreshToken = async(req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken){
            return res.status(401).json({
                success: false,
                message: "No refresh token provided!"
            })
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESHTOKEN)
        const storedToken = await redis.get(`refreshToken:${decoded.userId}`)
        if(storedToken !== refreshToken){
            return res.status(401).json({
                success: false,
                message: "invalid refresh token"
            })
        }

        const accessToken = jwt.sign({userId: decoded.userId}, process.env.JWT_ACCESSTOKEN, {expiresIn: "15min"})
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15*60*1000
        })

        res.status(200).json({
            success: true,
            message: "access token refresh successfully"
        })
    }
    catch(error){
        console.log("Error in refreshToken Controller", error.message)
        res.status(500).json({
            message: "server error",
            error: error.message
        })
    }
}

export const getProfile = async(req, res) => {
    try{
        res.status(200).json({
            success: true,
            user: req.user
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: 'server error',
            error: error.message
        })
    }
}