const bcrypt = require("bcrypt");

const seedAdminUser = async (prisma) => {
  const password = await bcrypt.hash("password123", 10);
  await prisma.user.create({
    data: {
        firstName: "Admin",
        lastName : "user",
        email: "admin@test.com",
        role: "ADMIN",
        password,
    },
  });
};
module.exports = {
  seedAdminUser,
};
