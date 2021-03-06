const { request } = require("express");
const fetch = require("node-fetch");
const { config } = require("../config");
const CategoriesService = require("./categories");
const SellersService = require("./sellers");
const CurrenciesService = require("./currencies");

const sellersService = new SellersService();
const categoriesService = new CategoriesService();
const currenciesService = new CurrenciesService();
class ItemsService {
  async getItemsByQuery(query) {
    return fetch(`${config.api_url}/sites/MLA/search?q=${query}`).then(
      (res) => {
        return res.json().then((jsonRes) => {
          const populateRequests = jsonRes.results.map((item) => {
            const itemDescriptionReq = this.getItemDescription(item.id);
            const sellerReq = sellersService.getSellerById(item.seller.id);
            const categoryReq = categoriesService.getCategoryById(
              item.category_id
            );
            const currencyReq = currenciesService.getCurrencyById(
              item.currency_id
            );
            return Promise.all([
              itemDescriptionReq,
              sellerReq,
              categoryReq,
              currencyReq,
              item,
            ]);
          });
          return Promise.all(populateRequests).then((requestsRes) => {
            return requestsRes.map((requestRes) => {
              const [
                itemDescription,
                seller,
                category,
                currency,
                item,
              ] = requestRes;
              return {
                id: item.id,
                title: item.title,
                author: seller.nickname,
                category: category.name,
                price: {
                  currency: item.currency_id,
                  amount: item.price,
                  decimals: currency.decimal_places,
                },
                picture: item.thumbnail,
                condition: item.condition,
                free_shipping: item.shipping.free_shipping,
                sold_quantity: item.sold_quantity,
                location: item.address.city_name,
                description: itemDescription,
              };
            });
          });
        });
      }
    );
  }

  async getItemById(id) {
    return fetch(`${config.api_url}/items/${id}`).then((res) => {
      if (res.status != 200) throw new Error("Item not found");
      return res.json().then((item) => {
        const itemDescriptionReq = this.getItemDescription(id);
        const sellerReq = sellersService.getSellerById(item.seller_id);
        const currencyReq = currenciesService.getCurrencyById(item.currency_id);
        return Promise.all([itemDescriptionReq, sellerReq, currencyReq]).then(
          (requestRes) => {
            const [itemDescription, seller, currency] = requestRes;
            return {
              id,
              title: item.title,
              author: seller.nickname,
              price: {
                currency: item.currency_id,
                amount: item.price,
                decimals: currency.decimal_places,
              },
              picture: item.pictures ? item.pictures[0].secure_url : "",
              condition: item.condition,
              free_shipping: item.shipping.free_shipping,
              sold_quantity: item.sold_quantity,
              description: itemDescription,
            };
          }
        );
      });
    });
  }

  async getItemDescription(id) {
    return fetch(`${config.api_url}/items/${id}/description`).then((res) => {
      return res.json().then((jsonRes) => {
        return jsonRes.plain_text;
      });
    });
  }
}

module.exports = ItemsService;
