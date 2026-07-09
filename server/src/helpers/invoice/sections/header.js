require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { formatDate} = require("../../../helpers/dateHelper");
const buildHeader = (order) => {
    console.log(order);
  const headerHtml = fs.readFileSync(
    path.join(__dirname, "../../../templates/invoice/partials/header.html"),
    "utf8",
  );
  return headerHtml
    .replace("{{companyName}}", process.env.COMPANY_NAME)
    .replace("{{companyAddress1}}", process.env.COMPANY_ADD_LINE1)
    .replace("{{companyAddress2}}", process.env.COMPANY_ADD_LINE2)
    .replace("{{companyCity}}", process.env.COMPANY_CITY)
    .replace("{{companyPostalCode}}", process.env.POSTAL_CODE)
    .replace("{{companyGstNumber}}", process.env.COMPANY_GST)
    .replace("{{companyEmail}}", process.env.COMPANY_EMAIL)
    .replace("{{companyPhone}}", process.env.COMPANY_PHONE)
    .replace("{{invoiceNumber}}", order.invoiceNumber)
    .replace("{{date}}", formatDate(order.invoiceDate))
    .replace("{{paymentStatus}}", order.payment.paymentStatus);
};

module.exports = { buildHeader };
