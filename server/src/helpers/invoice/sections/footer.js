require("dotenv").config();
const fs = require("fs");
const path = require("path");
const buildFooter = () => {
  const signatoryHtml = fs.readFileSync(
    path.join(__dirname, "../../../templates/invoice/partials/footer.html"),
    "utf8",
  );
  return signatoryHtml
    .replaceAll(
      "{{companyAddress}}",
      process.env.COMPANY_ADD_LINE1 +
        ", " +
        process.env.COMPANY_ADD_LINE2 +
        ", " +
        process.env.COMPANY_CITY +
        ", " +
        process.env.POSTAL_CODE,
    )
    .replaceAll("{{companyName}}", process.env.COMPANY_NAME)
    .replaceAll("{{companyNameFirstChar}}", process.env.COMPANY_NAME[0])
    .replace("{{companyContactLink}}", process.env.COMPANY_CONTACT_LINK);
};

module.exports = { buildFooter };
