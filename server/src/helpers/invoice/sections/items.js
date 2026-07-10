const fs = require("fs");
const path = require("path");
const {
  formatVariantAttributes,
} = require("../../../helpers/productVariantHelper");
const buildItems = (context) => {
  const itemsHtml = fs.readFileSync(
    path.join(__dirname, "../../../templates/invoice/partials/items.html"),
    "utf8",
  );
  let items = context.order.items
    .map((item) => {
      console.log(item.variant);
      const attributes = formatVariantAttributes(item.variant.variantValues);
      return `
        <tr class="item-row">
            <td class="left-align text-sm">
                <strong>${item.productTitle}</strong>

                <div>
                    SKU: ${item.variantSku} | ${attributes}
                </div>
            </td>
            <td class="center-align">${item.qty}</td>
            <td class="right-align">Rs ${item.unitPrice}</td>
            <td class="right-align">
                Rs ${item.totalPrice}
            </td>
        </tr>`;
    })
    .join("");
  items += `
    <tr class="total-row">
        <td class="left-align">TOTAL</td>
        <td class="center-align">
            ${context.order.items.reduce((sum, item) => sum + item.qty, 0)}
        </td>
        <td></td>
        <td class="right-align">
            Rs ${context.order.subtotal}
        </td>
    </tr>
    `;
  return itemsHtml.replace("{{itemsHtml}}", items);
};
module.exports = {
  buildItems,
};
