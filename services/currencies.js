const fetch = require("node-fetch");
const { config } = require("../config");

class CurrenciesService {
  async getCurrencyById(id) {
    return fetch(`${config.api_url}/currencies/${id}`).then((res) => {
      if (!res) throw new Error("Currency not found");
      return res.json().then((currency) => {
        return currency;
      });
    });
  }
}

module.exports = CurrenciesService;
