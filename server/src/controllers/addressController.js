const addressService = require("../services/addressService");

const createAddress = async (req, res,next) => {
     try{
        let body =  req.body;
        body['userId'] = req.user.userId;
        const address = await addressService.createAddress(body);
        res.status(201).json({
            message : 'address created'
        });
   }catch(error){
        next(error)
   }
}
const updateAddress = async (req, res,next) => {

     try{
        let body =  req.body;
        body['userId'] = req.user.userId;
        const address = await addressService.updateAddress(body, req.params.id);
        res.status(201).json({
            message : 'address updated',
            data : address
        });
   }catch(error){
        next(error)
   }
}
const getAddresses = async(req, res, next) => {
     try{
       const addresses =  await addressService.getAddresses(req.user.userId);
       res.status(201).json({
            data : addresses
        }); 
     }catch(error) {
        next(error)
     }
}
const deleteAddress = async(req, res, next) => {
     try{
       const addresses =  await addressService.deleteAddress(req.params.id,req.user.userId);
       res.status(201).json({
            message : "Address deleted"
        }); 
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