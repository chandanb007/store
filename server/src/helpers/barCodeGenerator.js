const bwipjs = require("bwip-js");

const generateBarcode =  async(text) => {
  const png = await bwipjs.toBuffer({
    bcid: "code128",
    text,
    scale: 1.5,
    height: 8,
    includetext: true,
    textxalign: "center",
  });

  return `data:image/png;base64,${png.toString("base64")}`;
};

module.exports = {
  generateBarcode,
};
