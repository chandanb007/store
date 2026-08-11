const fs = require("fs/promises");
const path = require("path");

const saveMedia = async (prisma, data) => {
  return await prisma.media.create({ data });
};
const deleteMediaFile = async (storageKey) => {
  const filePath = path.resolve(storageKey);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};
module.exports = {
  saveMedia,
  deleteMediaFile,
};
