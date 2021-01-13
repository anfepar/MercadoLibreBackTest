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

  async getItemById(id) {
    return fetch(`${API_URL}/items/${id}`).then((res) => {
      return res.json().then((item) => {
        return this.getItemDescription(id).then((itemDescription) => {
          return {
            id,
            title: item.title,
            price: {
              currency: item.currency_id,
              amount: item.price,
            },
            picture: item.pictures ? item.pictures[0].secure_url : "",
            condition: item.condition,
            free_shipping: item.shipping.free_shipping,
            sold_quantity: item.sold_quantity,
            description: itemDescription,
          };
        });
      });
    });
  }

  async getItemDescription(id) {
    return fetch(`${API_URL}/items/${id}/description`).then((res) => {
      return res.json().then((jsonRes) => {
        return jsonRes.plain_text;
      });
    });
  }
}

module.exports = ItemsService;
