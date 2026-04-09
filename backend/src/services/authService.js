const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const FORBIDDEN_LOCAL_PARTS = new Set([
  "admin",
  "administrator",
  "support",
  "help",
  "contact",
  "info",
  "sales",
  "test",
]);

const FORBIDDEN_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "example.com",
  "test.com",
]);

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const validateEmail = (email) => {
  const rawEmail = String(email || "").trim();

  if (!rawEmail) {
    return { isValid: false, message: "Email is required" };
  }

  if (rawEmail !== rawEmail.toLowerCase()) {
    return { isValid: false, message: "Email must be lowercase only" };
  }

  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!emailRegex.test(rawEmail)) {
    return { isValid: false, message: "Enter a valid email format (example: user@company.com)" };
  }

  const [localPart, domain] = rawEmail.split("@");
  if (FORBIDDEN_LOCAL_PARTS.has(localPart)) {
    return { isValid: false, message: "Role-based emails are not allowed (admin, support, info, etc.)" };
  }

  if (FORBIDDEN_DOMAINS.has(domain)) {
    return { isValid: false, message: "Disposable or sample email domains are not allowed" };
  }

  const domainRoot = domain.split(".")[0] || "";
  if (domainRoot.length < 4) {
    return { isValid: false, message: "Use a more complete email domain (example: company.com)" };
  }

  return { isValid: true, normalizedEmail: rawEmail };
};

const validatePassword = (password) => {
  const rules = [
    { test: password.length >= 6, message: "at least 6 characters" },
    { test: /[A-Z]/.test(password), message: "one uppercase letter" },
    { test: /\d/.test(password), message: "one number" },
    { test: /[^A-Za-z0-9]/.test(password), message: "one special character" },
  ];

  const failedRules = rules.filter((rule) => !rule.test).map((rule) => rule.message);

  return {
    isValid: failedRules.length === 0,
    failedRules,
  };
};

const signToken = (user) =>
  jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

const signup = async ({ email, password }) => {
  const emailValidation = validateEmail(email);

  if (!emailValidation.isValid) {
    throw new Error(emailValidation.message);
  }

  const normalizedEmail = normalizeEmail(emailValidation.normalizedEmail);

  const existingUser = await userModel.findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error("Email is already in use");
  }

  const passwordValidation = validatePassword(password);

  if (!passwordValidation.isValid) {
    throw new Error(
      `Password must contain ${passwordValidation.failedRules.join(", ")}.`,
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.createUser({ email: normalizedEmail, password: hashedPassword });

  return {
    user,
    token: signToken(user),
  };
};

const login = async ({ email, password }) => {
  const emailValidation = validateEmail(email);

  if (!emailValidation.isValid) {
    throw new Error(emailValidation.message);
  }

  const normalizedEmail = normalizeEmail(emailValidation.normalizedEmail);
  const user = await userModel.findUserByEmail(normalizedEmail);

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
