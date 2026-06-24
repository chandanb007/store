const prisma = require("../config/prisma.js");

const saveMedia = async (data) => {
    return prisma.media.create({data});
};

module.exports = {
    saveMedia
}
