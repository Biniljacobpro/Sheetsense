const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const signToken = (user) =>
  jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

const signup = async ({ email, password }) => {
  const existingUser = await userModel.findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email is already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.createUser({ email, password: hashedPassword });

  return {
    user,
    token: signToken(user),
  };
};

const login = async ({ email, password }) => {
  const user = await userModel.findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    },
    token: signToken(user),
  };
};

module.exports = {
  signup,
  login,
};
