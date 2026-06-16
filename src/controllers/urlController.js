const prisma = require("../config/prisma");
const { nanoid } = require("nanoid");
const validator = require("validator");

const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customCode } = req.body;

    // Check URL exists
    if (!originalUrl) {
      return res.status(400).json({
        message: "URL is required",
      });
    }

    // Validate URL
    if (!validator.isURL(originalUrl)) {
      return res.status(400).json({
        message: "Please provide a valid URL",
      });
    }

    let shortCode;

    // Custom code provided
    if (customCode) {
      const existingCode = await prisma.url.findUnique({
        where: {
          shortCode: customCode,
        },
      });

      if (existingCode) {
        return res.status(400).json({
          message: "Custom code already exists",
        });
      }

      shortCode = customCode;
    } else {
      shortCode = nanoid(6);
    }

    const newUrl = await prisma.url.create({
      data: {
        originalUrl,
        shortCode,
      },
    });

    res.status(201).json({
      message: "Short URL created successfully",
      shortUrl: `http://localhost:3000/${newUrl.shortCode}`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await prisma.url.findUnique({
      where: {
        shortCode,
      },
    });

    if (!url) {
      return res.status(404).json({
        message: "URL not found",
      });
    }

    await prisma.url.update({
      where: {
        shortCode,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await prisma.url.findUnique({
      where: {
        shortCode,
      },
    });

    if (!url) {
      return res.status(404).json({
        message: "URL not found",
      });
    }

    res.status(200).json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createShortUrl,
  redirectUrl,
  getAnalytics,
};