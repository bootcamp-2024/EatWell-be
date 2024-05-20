import MealPlanModel from "#src/models/MealPlan.model";
import moment from "moment";
import { getMealPlanFromFastAPI } from "#src/services/meal.services";
import IngredientModel from "#src/models/Ingredient.model";

export default {
  async mealSavedController(req, res, next) {
    try {
      const mealPlanData = req.body.data;
      if (!mealPlanData) {
        return res.status(400).json({ error: "No data!" });
      }
      const newMealPlan = new MealPlanModel({ meal_list: mealPlanData });
      const savedMealPlan = await newMealPlan.save();
      return res.status(200).send({
        exitcode: 0,
        message: "Saved meal successfully!",
        savedMealPlan,
      });
    } catch (err) {
      next(err);
    }
  },

  async mealGenController(req, res, next) {
    try {
      const {
        days,
        low_salt,
        low_cholesterol,
        fibre_limit,
        kcal_limit,
        carb_kcal_limit,
        protein_kcal_limit,
        fat_kcal_limit,
        cost_limit,
        meal_count_str,
        is_vegetarian,
        cuisine,
      } = req.params;
      const params = {
        days,
        low_salt,
        low_cholesterol,
        fibre_limit,
        kcal_limit,
        carb_kcal_limit,
        protein_kcal_limit,
        fat_kcal_limit,
        cost_limit,
        meal_count_str,
        is_vegetarian,
        cuisine,
      };

      const mealPlanData = await getMealPlanFromFastAPI(params);
      // const result = new MealPlanModel({ meal_list: mealPlanData });
      // const savedMealPlans = await result.save();
      res.status(200).send({
        exitcode: 0,
        message: "Generated meal successfully!",
        data: mealPlanData,
      });
    } catch (err) {
      next(err);
    }
  },

  async getIngredientNames(req, res, next) {
    try {
      const ingredients = await IngredientModel.find({}, "name");
      const names = ingredients.map((ingredient) => ingredient.name);
      res.status(200).send({
        exitcode: 0,
        message: "Get Ingredients successfully!",
        names,
      });
    } catch (error) {
      next(error);
    }
  },
};
