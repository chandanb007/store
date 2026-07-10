const fs = require("fs");
const path = require("path");
const { formatDate } = require("../../../helpers/dateHelper");
const buildHeader = (context) => {
  console.log(context.order);
  const headerHtml = fs.readFileSync(
    path.join(__dirname, "../../../templates/invoice/partials/header.html"),
    "utf8",
  );
  return headerHtml
    .replace("{{invoiceNumber}}", context.order.invoiceNumber)
    .replace("{{barCode}}", `<img src="${context.barcode}"/>`)
    .replace("{{invoiceDate}}", formatDate(context.order.invoiceDate))
    .replace("{{orderDate}}", formatDate(context.order.createdAt))
    .replace("{{orderNumber}}", context.order.orderNumber)
    .replace("{{customerState}}", context.order.state)
    .replace("{{paymentMethod}}", context.order.payment.paymentMethod)
    .replace("{{paymentStatus}}", context.order.payment.paymentStatus);
};

module.exports = { buildHeader };
