const saveProductMedia = async (prisma, data) => {
  return await prisma.productMedia.create({ data });
};
module.exports = {
  saveProductMedia,
};
