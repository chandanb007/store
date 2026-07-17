const seedCategories = require("./seed/category.seed");
const { seedAdminUser } = require("./seed/user.seed");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  console.log("Seeding database...");
  //await seedAdminUser(prisma);
  await seedCategories(prisma);
  console.log("Database seeded.");
}
main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
