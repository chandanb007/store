const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const { buildHeader } = require("./sections/header");
const { buildCustomer } = require("./sections/customer");
const { buildItems } = require("./sections/items");
const { buildSignatory } = require("./sections/signatory");
const { buildSummary } = require("./sections/summary");
const { buildFooter } = require("./sections/footer");
const { generateBarcode } = require("../barCodeGenerator");
const { generateQRCode } = require("../qrCodeGenerator");
const generateInvoice = async (order) => {
  const css = fs.readFileSync(
    path.join(__dirname, "../../templates/styles/invoice.css"),
    "utf8",
  );
  const html = fs.readFileSync(
    path.join(__dirname, "../../templates/invoice/invoice.html"),
    "utf8",
  );
  const context = {
    order,
    barcode: await generateBarcode(order.orderNumber),
    qrCode: await generateQRCode(
      `${process.env.APP_URL}tracking/${order.orderNumber}`,
    ),
  };

  let invoiceHtml = html
    .replace("{{header}}", buildHeader(context))
    .replace("{{customer}}", buildCustomer(context))
    .replace("{{items}}", buildItems(context))
    .replace("{{signatory}}", buildSignatory())
    .replace("{{summary}}", buildSummary(context))
    .replace("{{footer}}", buildFooter())
    .replace("{{styles}}", `<style>${css}</style>`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(invoiceHtml);
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });
  await browser.close();
  return pdf;
};

module.exports = {
  generateInvoice,
};
