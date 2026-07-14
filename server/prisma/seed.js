const { seedAdminUser } = require("./seed/user.seed");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); 
async function main() {
  console.log("Seeding database...");
  await seedAdminUser(prisma);
  console.log("Database seeded.");
}
main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });