const authService = require("../services/authService");

const register = async (req, res,next) => {
     try{
        const user = await authService.register(req.body);
        res.status(201).json({
            message : 'user created'
        });
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

  } catch (error) {
    console.log(error)
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await authService.me(req.user);   
     res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
    login,
    register,
    me
}