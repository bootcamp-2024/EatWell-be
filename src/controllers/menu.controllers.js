// menu.controllers.js
import MenuModel from "#src/models/Menu.model";
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

  // async createMenu(req, res, next) {
  //   try {
  //     // Extract meal data from request body
  //     const { mealName, calories, notes, start, resource } = req.body;
  
  //     // Parse start and end dates
  //     const startDate = new Date(start);
  
  //     // Increment start and end dates by 1 day
  //     startDate.setDate(startDate.getDate() + 1);  
  //     // Create the menu item with updated dates
  //     const menu = await MenuModel.create({
  //       mealName,
  //       calories,
  //       notes,
  //       start: startDate,
  //       resource
  //     });
  //     if (menu && menu._id) {
  //       res.status(201).json(menu);
  //     } else {
  //       res.status(500).json({ error: 'Failed to create menu' });
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // },
  
  

  async updateMenu(req, res, next) {
    try {
      const { id } = req.params;
      const { mealName, calories, notes, start, resource } = req.body; // Extract fields from req.body
      const updatedMenu = await MenuModel.findByIdAndUpdate(id, { mealName, calories, notes, start, resource }, { new: true });
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