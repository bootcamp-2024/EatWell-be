import express from "express";
import mealPlan from "#src/controllers/meal.controllers";
import config from "#src/config/config";

const router = express.Router();

router.route("/generate").get(mealPlan.mealGenController);
router.route("/saved").post(mealPlan.mealSavedController);
router.route("/getIngredients").get(mealPlan.getIngredientNames);

export default router;
