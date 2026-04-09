const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api", routes);

app.use((err, _req, res, _next) => {
  if (err && err.message) {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: "Unexpected server error" });
});

module.exports = app;
