const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
let log = [];
if (process.env.DEBUG == 'TRUE'){
    log = ["query", "info", "warn", "error"]
}
const prisma = new PrismaClient({ log: log});

module.exports = prisma;