// menu.controllers.js
import MenuModel from "#src/models/Menu.model";
import UserModel from "#src/models/UserInfo.model";

export default {
  async getAllMenus(req, res, next) {
    try {
      const menus = await MenuModel.find();
      // console.log("Menus retrieved from MongoDB:", menus); 
      res.status(200).json(menus);
    } catch (error) {
      next(error);
    }
  },

  async createMenu(req, res, next) {
    try {
      const menu = await MenuModel.create(req.body);
      res.status(201).json(menu);
    } catch (error) {
      next(error);
    }
  },

  async updateMenu(req, res, next) {
    try {
      const { id } = req.params;
      const updatedMenu = await MenuModel.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updatedMenu);
    } catch (err) {
      next(err);
    }
  },

  async deleteMenu(req, res, next) {
    try {
      const { id } = req.params;
      await MenuModel.findByIdAndDelete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
};
