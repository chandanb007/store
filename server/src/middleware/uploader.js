const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");

const createUploader = (folder) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const now = new Date();
      const uploadPath = path.join(
        "uploads",
        folder,
        now.getFullYear().toString(),
        String(now.getMonth() + 1).padStart(2, "0"),
      );

      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const filename = `${randomUUID()}${path.extname(file.originalname)}`;

      req.uploadedFiles ??= [];

      req.uploadedFiles.push({
        originalName: file.originalname,
        fileName: filename,
      });

      cb(null, filename);
    },
  });

  return multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter(req, file, cb) {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed."));
      }
      cb(null, true);
    },
  });
};

module.exports = {
  createUploader,
};
