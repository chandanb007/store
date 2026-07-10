require("dotenv").config();
const fs = require("fs");
const path = require("path");
const buildCustomer = (context) => {
  const customerHtml = fs.readFileSync(
    path.join(__dirname, "../../../templates/invoice/partials/customer.html"),
    "utf8",
  );
  return customerHtml
    .replace("{{customerName}}", context.order.fullName)
    .replace("{{qrCode}}", `<img src="${context.qrCode}"/>`)
    .replace("{{customerAddress1}}", context.order.addressLine1)
    .replace("{{customerAddress2}}", context.order.addressLine2)
    .replace("{{customerCity}}", context.order.city)
    .replace("{{customerState}}", context.order.state)
    .replace("{{customerPostalCode}}", context.order.postalCode)
    .replace("{{customerCountry}}", context.order.country)
    .replace("{{customerEmail}}", context.order.user.email)
    .replace("{{customerPhone}}", context.order.phone)
    .replace("{{companyName}}", process.env.COMPANY_NAME)
    .replace("{{companyAddressLine1}}", process.env.COMPANY_ADD_LINE1)
    .replace("{{companyAddressLine2}}", process.env.COMPANY_ADD_LINE2)
    .replace("{{companyCity}}", process.env.COMPANY_CITY)
    .replace("{{companyPostalCode}}", process.env.POSTAL_CODE)
    .replace("{{companyGST}}", process.env.COMPANY_GST)
    .replace("{{companyEmail}}", process.env.COMPANY_EMAIL)
    .replace("{{companyPhone}}", process.env.COMPANY_PHONE);
};

module.exports = { buildCustomer };
