const wishListService = require("../services/wishListService");
const {success} = require("../helpers/apiResponse");
const createOrUpdateWishList = async (req, res,next) => {
     try{
        const wishList = await wishListService.createOrUpdateWishList(req.user.userId,req.body);
        return success(res, "Wishlist updated successfully.", wishList, 201);      
     }catch(error){
        next(error)
     }
}
const getWishList = async (req,res, next) => {
    try{
        const wishList = await wishListService.getWishList(req.user.userId);
       return success(res, "Wishlist fetched successfully.", wishList, 200);        
     }catch(error){
        next(error)
     }
}
const deleteWishListItem = async (req,res,next) => {
     try{
        const response = await wishListService.deleteWishListItem(req.user.userId,req.params.id);
         return success(res, "Wishlist deleted successfully.", response, 200);     
     }catch(error){
        next(error)
     }
}
module.exports = {
    createOrUpdateWishList,
    getWishList,
    deleteWishListItem
}