require("dotenv").config();
const fs = require("fs");
const path = require("path");
const buildCustomer = (order) => {
  const customerHtml = fs.readFileSync(
    path.join(__dirname, "../../../templates/invoice/partials/customer.html"),
    "utf8",
  );
  return customerHtml
    .replace("{{customerName}}", order.fullName)
    .replace("{{customerAddress1}}", order.addressLine1)
    .replace("{{customerAddress2}}", order.addressLine2)
    .replace("{{customerCity}}", order.city)
    .replace("{{customerState}}", order.state)
    .replace("{{customerPostalCode}}", order.postalCode)
    .replace("{{customerCountry}}", order.country)
    .replace("{{customerEmail}}", order.user.email)
    .replace("{{customerPhone}}", order.phone);
};

module.exports = { buildCustomer };
