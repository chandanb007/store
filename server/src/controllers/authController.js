const authService = require("../services/authService");
const {success} = require("../helpers/apiResponse");

const register = async (req, res,next) => {
     try{
        const user = await authService.register(req.body);
         return success(res, "user created", user, 201);
   }catch(error){
        next(error)
   }
}
const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json({
      success: true,
      data: result
    });
     return success(res, "user login successfully", result, 200);

  } catch (error) {
    console.log(error)
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await authService.me(req.user);   
     return success(res, "me", user, 200);
  } catch (error) {
    next(error);
  }
};
module.exports = {
    login,
    register,
    me
}