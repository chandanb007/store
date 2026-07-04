const wishListService = require("../services/wishListService");

const createOrUpdateWishList = async (req, res,next) => {
     try{
        const wishList = await wishListService.createOrUpdateWishList(req.user.userId,req.body);
        res.status(201).json(wishList);      
     }catch(error){
        next(error)
     }
}
const getWishList = async (req,res, next) => {
    try{
        const wishList = await wishListService.getWishList(req.user.userId);
        res.status(201).json(wishList);      
     }catch(error){
        next(error)
     }
}
const deleteWishListItem = async (req,res,next) => {
     try{
        const response = await wishListService.deleteWishListItem(req.user.userId,req.params.id);
        res.status(200).json(response);      
     }catch(error){
        next(error)
     }
}
module.exports = {
    createOrUpdateWishList,
    getWishList,
    deleteWishListItem
}