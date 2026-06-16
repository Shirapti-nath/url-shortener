const express = require("express");
const urlRoutes = require("./routes/urlRoutes");
const { redirectUrl } = require("./controllers/urlController");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("URL Shortener API Running");
});

app.use("/api", urlRoutes);

app.get("/:shortCode", redirectUrl);

module.exports = app;