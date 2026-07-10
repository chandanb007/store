require("dotenv").config();
const fs = require("fs");
const path = require("path");
const buildSignatory = () => {
  const signatoryHtml = fs.readFileSync(
    path.join(__dirname, "../../../templates/invoice/partials/signatory.html"),
    "utf8",
  );
  return signatoryHtml
    .replaceAll("{{companyName}}", process.env.COMPANY_NAME)
    .replace("{{companyAuthSign}}", process.env.COMPANY_AUTH_SIGNATORY)
    .replace("{{companyNoteTerms}}", process.env.COMPANY_INVOICE_TERMS);
};

module.exports = { buildSignatory };
