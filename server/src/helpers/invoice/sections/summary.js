require("dotenv").config();
const fs = require("fs");
const path = require("path");
const buildSummary = (context) => {
  const customerHtml = fs.readFileSync(
    path.join(__dirname, "../../../templates/invoice/partials/summary.html"),
    "utf8",
  );
  return customerHtml
    .replace("{{subTotal}}", context.order.subtotal)
    .replace("{{grandTotal}}", context.order.grandTotal)
    .replace("{{discount}}", context.order.discount)
    .replace(
      "{{couponApplied}}",
      context.order.couponCode ? "(" + context.order.couponCode + ")" : "",
    )
    .replace(
      "{{couponDescription}}",
      context.order.couponName ? "[" + context.order.couponName + "]" : "",
    )
    .replace("{{shippingCharges}}", context.order.shippingCharge);
};

module.exports = { buildSummary };
