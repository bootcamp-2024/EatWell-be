import mongoose from "mongoose";
const MenuSchema = new mongoose.Schema(
  {
    mealName: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    notes: String,
    start: Date,
    resource: Number,
  },
  { collection: "Menu", versionKey: false }
);
const MenuModel = mongoose.model("Menu", MenuSchema);
// console.log("Model has worked okay!");
export default MenuModel;
