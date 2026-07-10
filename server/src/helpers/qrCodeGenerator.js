const QRCode = require("qrcode");

const generateQRCode = async (text) => {
  return await QRCode.toDataURL(text, {
    width: 80,
    margin: 1,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });
};
module.exports = {
  generateQRCode,
};
