const dashboardSerivce = require('../services/dashboardService')
const {success} = require("../helpers/apiResponse");
const dashboardStats = async(req,res,next) => {
    const stats = await dashboardSerivce.getStats();
    res.json(stats)
      return success(res, "dashboard status", stats, 200);
}

module.exports = {
    dashboardStats
}