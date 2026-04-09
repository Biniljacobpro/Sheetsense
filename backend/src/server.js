require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // Keep startup logging simple for local debugging.
  console.log(`Backend server listening on port ${PORT}`);
});
