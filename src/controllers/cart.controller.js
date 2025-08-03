import Product from '../models/product.model.js'

export const addToCart = async(req, res) => {
    try{
        const {productId} = req.params
        const user = req.user
        const existingItem = user.cartItem.find((item) => item.id === productId)
        if(existingItem){
            existingItem.quantity += 1
        }
        else{
            user.cartItem.push(productId)
        }

        await user.save()
        res.status(201).json({
            success: true,
            message: 'product added to cart successfully!',
            cart: user.cartItem
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "error in addTo cart controller",
            error: error.message
        })
    }
}

export const getCartProducts = async(req, res) => {
    try{
        const products = await Product.find({_id: {$in: req.user.cartItem}})
        const user = req.user
        const cartItems = products.map((product) => {
            const item = req.user.cartItem.find((cartItem) => cartItem.id === product.id)
            return {
                ...product.toJSON(),
                quantity: item.quantity,
                currentLoginUser: user.name
            }
        })
        res.status(200).json({
            success: true,
            cartItems
        })

    }   
    catch(error){
        res.status(500).json({
            success: false,
            message: "error in get cart controller",
            error: error.message
        })
    }
}

export const updateQuantity = async(req, res) => {
    try{
       const {id} = req.params;
       const {quantity} = req.body
       const user = req.user
       const existingItem = user.cartItem.find((item) => item.id === id)
       
       if(existingItem){
            if(quantity === 0){
                user.cartItem = user.cartItem.filter((item) => item.id !== id)
                await user.save()
                return res.status(200).json(user.cartItem)
            }

            existingItem.quantity = quantity
            await user.save()
            res.status(200).json(user.cartItem)
       }
       
       else{
        res.status(404).json({
            success: false,
            message: 'item not found in the cart'
        })
       }

    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "error in update cart controller",
            error: error.message
        })
    }
}

export const removeAllFromCart = async(req, res) => {
    try{
        const {productId} = req.body
        const user = req.user

        //if we want to empty cart or remove all product from cart
        if(!productId){
            user.cartItem = []
        }
        else{
            user.cartItem = user.cartItem.filter((item) => item.id !== productId)
        }

        await user.save()
        res.status(200).json(user.cartItem)
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "error in removeAll cart controller",
            error: error.message
        })
    }
}