const API_URL = " https://api.mercadolibre.com";
const fetch = require("node-fetch");

class ItemsService {
  async getItemsByQuery(query) {
    return fetch(`${API_URL}/sites/MLA/search?q=${query}`).then((res) => {
      return res.json().then((jsonRes) => {
        const resItems = jsonRes.results.map((item) => {
          return {
            id: item.id,
            title: item.title,
            price: {
              currency: item.currency_id,
              amount: item.price,
            },
            picture: item.thumbnail,
            condition: item.condition,
            free_shipping: item.shipping.free_shipping,
            sold_quantity: item.sold_quantity,
            location: item.address.city_name,
          };
        });
        return resItems;
      });
    });
  }
}

module.exports = ItemsService;
