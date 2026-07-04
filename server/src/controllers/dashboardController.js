const dashboardSerivce = require('../services/dashboardService')

const dashboardStats = async(req,res,next) => {
    const stats = await dashboardSerivce.getStats();
    res.json(stats)
}

module.exports = {
    dashboardStats
}