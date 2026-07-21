const prisma = require("../config/prisma.js");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const AppError = require("../utils/AppError");

const register = async(data) => {
    const hashedPassword = await bcrypt.hash(
    data.password,
    10
    );
    return await prisma.user.create({
    data: {
        firstName: data.firstName,
        lastName: data.lastName,
        mobile: data.mobile,
        email: data.email,
        password: hashedPassword
    }
    });
}
const login = async (data) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new AppError("Invalid email or password",  401);
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new AppError("Invalid email or password",  401);
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      role: user.role
    }
  };
};
const me = async (data) => {
    return prisma.user.findUnique({
      where: {
        id: data.userId
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        role: true
      }
    });
    
}
const getAllCustomers = async () => {
  return await prisma.user.findMany({
    where: {
      role: "CUSTOMER"
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      mobile: true,
      role: true
    }
  });
};

module.exports = {
  register,
  login,
  me,
  getAllCustomers
};