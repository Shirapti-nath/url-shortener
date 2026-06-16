const express = require("express");

const router = express.Router();

const {
  createShortUrl,
  getAnalytics,
} = require("../controllers/urlController");

router.post("/shorten", createShortUrl);

router.get("/analytics/:shortCode", getAnalytics);

module.exports = router;