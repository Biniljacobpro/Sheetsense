const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin header (curl, server-to-server, health checks).
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked for this origin"));
    },
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
