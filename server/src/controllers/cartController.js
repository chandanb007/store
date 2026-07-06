const cartService = require("../services/cartService");
const {success} = require("../helpers/apiResponse");


const createCart = async(req, res, next) => {
    try{
        let cart =  req.body;
        cart['userId'] = req.user.userId;
        const cartObj = await cartService.createCart(cart);
        return success(
            res,
            "Item added to your cart",
            cartObj,
            201
        );    
       }catch(error){
            next(error)
       }
}
const getCart = async (req, res,next) => {
    try{
        const cart = await cartService.getCart(req.user.userId);
        return success(
            res,
            "Item added to your cart",
            cart,
            200
        ); 
    }catch(error){
        next(error)
    }
}
const clearCart = async (req, res,next) => {
    try {
       const cartObj =  await cartService.clearCart(req.user.userId);
         return success(res, "All cart items has been deleted", cartObj, 200); 
    }catch(error){
        next(error)
    }
}
const updateCart = async (req, res,next) => {
    try{
        let cart =  req.body;
        cart['userId'] = req.user.userId;
        const cartObj = await cartService.createCart(cart);
         return success(res, "Cart updated successfully.", cartObj, 200);   
    }catch(error){
        next(error)
    }
}
const updateItem = async (req, res,next)=> {
    try{
        const updatedCart = await cartService.updateItem(req.params.id,req.user.userId,req.body);
         return success(res, "Cart updated successfully.", updatedCart, 200); 
    }catch(error){
        next(error)
    }
}
const deleteItem = async (req,res,next) => {
    try{
        const updatedCart = await cartService.deleteItem(req.params.id,req.user.userId);
        return success(res, "Cart deleted successfully.", updatedCart, 200);
    }catch(error){
        next(error)
    }
}
const applyCoupon = async(req,res,next)=> {
           
    try{
        const updatedCart = await cartService.applyCoupon(req.body.code,req.user.userId);
         return success(
            res,
            "Coupon applied successfully",
            updatedCart,
            200
        ); 
    }catch(error){
        next(error)
    }
}
const removeCoupon = async (req, res, next) => {
    try {
        const updatedCart = await cartService.removeCoupon(
          req.user.userId,
        );
        return success(res, "Coupon removed successfully", updatedCart, 200); 
    } catch (error){
        next(error);
    }
}

module.exports = {
  createCart,
  getCart,
  updateCart,
  clearCart,
  updateItem,
  deleteItem,
  applyCoupon,
  removeCoupon,
};