const saveMedia = async (prisma, data) => {
  return await prisma.media.create({ data });
};

module.exports = {
  saveMedia,
};
