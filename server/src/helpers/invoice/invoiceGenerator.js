const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const { buildHeader } = require("./sections/header");
const { buildCustomer } = require("./sections/customer");
const generateInvoice = async (order) => {
  const css = fs.readFileSync(
    path.join(__dirname, "../../templates/styles/invoice.css"),
    "utf8",
  );
  const html = fs.readFileSync(
    path.join(__dirname, "../../templates/invoice/invoice.html"),
    "utf8",
  );
  let invoiceHtml = html
    .replace("{{header}}", buildHeader(order))
    .replace("{{customer}}", buildCustomer(order))
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
