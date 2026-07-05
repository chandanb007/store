const addressService = require("../services/addressService");
const {success} = require("../helpers/apiResponse");

const createAddress = async (req, res,next) => {
     try{
        let body =  req.body;
        body['userId'] = req.user.userId;
        const address = await addressService.createAddress(body);
        return success(res, "address created", address, 201);
   }catch(error){
        next(error)
   }
}
const updateAddress = async (req, res,next) => {

     try{
        let body =  req.body;
        body['userId'] = req.user.userId;
        const address = await addressService.updateAddress(body, req.params.id);
        return success(res, "address updated", address, 201);
   }catch(error){
        next(error)
   }
}
const getAddresses = async(req, res, next) => {
     try{
       const addresses =  await addressService.getAddresses(req.user.userId);
       return success(res, "address list", addresses, 200);
     }catch(error) {
        next(error)
     }
}
const deleteAddress = async(req, res, next) => {
     try{
       const addresses =  await addressService.deleteAddress(req.params.id,req.user.userId);
       return success(res, "Address deleted", addresses, 200);
     }catch(error) {
        next(error)
     }
}
module.exports = {
    createAddress,
    getAddresses,
    updateAddress,
    deleteAddress
}