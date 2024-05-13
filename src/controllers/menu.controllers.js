// menu.controllers.js
import MenuModel from "#src/models/Menu.model";

export default {
  async getAllMenus(req, res, next) {
    try {
      const result = await MenuModel.find();
      console.log("Menus retrieved from MongoDB:", result); // Log the retrieved menus
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
