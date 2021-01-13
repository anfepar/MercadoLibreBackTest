const fetch = require("node-fetch");
const { config } = require("../config");

class CategoriesService {
  async getCategoryById(id) {
    return fetch(`${config.api_url}/categories/${id}`).then((res) => {
      if (!res) throw new Error("Category not found");
      return res.json().then((category) => {
        return category;
      });
    });
  }
}

module.exports = CategoriesService;
