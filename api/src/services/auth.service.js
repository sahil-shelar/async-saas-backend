const User = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");

const registerUser = async (email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    email,
    passwordHash,
  });

  return {
    id: user._id,
    email: user.email,
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !user.isActive) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  return token;
};

module.exports = {
  registerUser,
  loginUser,
};
