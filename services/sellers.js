const fetch = require("node-fetch");
const { config } = require("../config");

class SellersService {
  async getSellerById(id) {
    return fetch(`${config.api_url}/users/${id}`).then((res) => {
      if (!res) throw new Error("Seller not found");
      return res.json().then((user) => {
        return user;
      });
    });
  }
}

module.exports = SellersService;
