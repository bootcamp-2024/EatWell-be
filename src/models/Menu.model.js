import mongoose from "mongoose";


const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  total_calo: {
    type: Number,
    required: true,
  },
  meal_time: {
    type: String,
    required: true,
  },
});

const mealPlanSchema = new mongoose.Schema(
  {
    meal_day: {
      type: String,
      required: true,
    },
    meal_plan: [mealSchema],
  },
  { collection: "Meal_Plan", versionKey: false }
);

const MenuModel = mongoose.model("Meal_Plan", mealPlanSchema);

export default MenuModel;
