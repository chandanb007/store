const prisma = require("../config/prisma.js");

const saveProductMedia = async (data) => {
    return prisma.productMedia.create({data});
};
module.exports = {
    saveProductMedia
}