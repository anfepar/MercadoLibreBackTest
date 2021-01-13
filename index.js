const express = require("express");
const app = express();
const itemsApi = require("./routes/items.js");
const { config } = require("./config/index");
var cors = require("cors");

app.use(cors());

itemsApi(app);

app.listen(config.port, function () {
  console.log(`Listening http://localhost:${config.port}`);
});
