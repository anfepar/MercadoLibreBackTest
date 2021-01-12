const express = require("express");
const ItemsService = require("../services/items");
function itemsApi(app) {
  const router = express.Router();
  app.use("/api/items", router);
  const itemsService = new ItemsService();

  router.get("/", async function (req, res, next) {
    const { q } = req.query;
    try {
      const items = await itemsService.getItemsByQuery(q);
      res.status(200).json({
        data: items,
        message: "items listed",
      });
    } catch (err) {
      next(err);
    }
  });
}

module.exports = itemsApi;
