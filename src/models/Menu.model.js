import mongoose from "mongoose";
const MenuSchema = new mongoose.Schema(
  {
    menu_id: { type: mongoose.Types.ObjectId, require: true },
    start_date: { type: Date, default: new Date() },
    end_date: { type: Date, default: new Date() },
    meal_name: { type: String, require: true },
    calories: { type: Number, default: null },
    notes: { type: String},

  },
  { collection: "Menu", versionKey: false }
);
const MenuModel = mongoose.model("Menu", MenuSchema);
// console.log("Model has worked okay!");
export default MenuModel;
