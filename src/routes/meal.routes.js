import express from "express";
import mealPlan from "#src/controllers/meal.controllers";
import config from "#src/config/config";
import { createUploader } from "#src/utils/cloudinary";

const router = express.Router();

const detectImageUploader = createUploader(config.CLOUDINARY_DETECT_PATH, [
  "png",
  "jpg",
]);

router.route("/generate").get(mealPlan.mealGenController);
router.route("/saved").post(mealPlan.mealSavedController);
router.route("/getIngredients").get(mealPlan.getIngredientNames);
router.route("/getUserTodayMealPlan").get(mealPlan.getTodayMealPlan);
router
  .route("/detect")
  .patch(detectImageUploader.single("file"), mealPlan.uploadImageToDetect);

export default router;
