require("dotenv").config();

const config = {
  dev: process.env.NODE_ENV !== "production",
  port: process.env.PORT || 3000,
  api_url: "https://api.mercadolibre.com",
};

module.exports = { config };
