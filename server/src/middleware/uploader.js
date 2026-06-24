const multer = require("multer");
const path = require("path");
const fs =  require("fs");
const { randomUUID } = require("crypto");

 const createUploader = (folder) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const now = new Date();
       const uploadPath = path.join(
        "uploads",
        folder,
        now.getFullYear().toString(),
        String(now.getMonth() + 1).padStart(2, "0")
        );

      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      cb(null, `${randomUUID()}${path.extname(file.originalname)}`);
    }
  });

  return multer({ storage });
};

module.exports = {
    createUploader
}