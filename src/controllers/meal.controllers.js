import MealPlanModel from "#src/models/MealPlan.model";
import moment from "moment";
import { getMealPlanFromFastAPI } from "#src/services/meal.services";
import IngredientModel from "#src/models/Ingredient.model";
import UserInfoModel from "#src/models/UserInfo.model";
import mongoose from "mongoose";
import config from "#src/config/config";
import { cloudinary } from "#src/utils/cloudinary";
import ImageDetect from "#src/models/ImageDetect.model";

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
      mongoose.connect(config.DATABASE.URI);
      const db = mongoose.connection;
      // const data = await db
      //   .collection("Meal_Plan")
      //   .find({
      //     meal_day: today,
      //   })
      //   .toArray();

      const ingredients = await db
        .collection("Ingredient")
        .find({}, "name")
        .toArray();
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

  async getTodayMealPlan(req, res, next) {
    try {
      mongoose.connect(config.DATABASE.URI);
      const db = mongoose.connection;

      const today = moment().format("DD-MM-YY");

      const data = await db
        .collection("Meal_Plan")
        .find({
          meal_day: { $gte: today },
        })
        .toArray();

      if (data.length > 0) {
        res.status(200).send({
          exitcode: 0,
          message: "Get Today Meal Plan of user successfully!",
          data,
        });
      } else {
        res.status(200).send({
          exitcode: 101,
          message: "The user does not have a meal plan today!",
          data,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  async uploadImageToDetect(req, res, next) {
    try {
      const { file } = req;

      if (!file) {
        return res.status(400).send({
          exitcode: 1,
          message: "No file was uploaded.",
        });
      }

      const detectImage = file;

      const currentPublicId = "Detect"; // Bạn cần có đúng public_id để xóa ảnh cũ

      try {
        await cloudinary.uploader.destroy(currentPublicId);
      } catch (err) {
        console.log("Cannot delete old image:", err);
      }

      const newImage = new ImageDetect({ url: detectImage.path });
      await newImage.save();

      res.status(200).send({
        exitcode: 0,
        message: "Upload image detect successfully",
        data: newImage,
      });
    } catch (err) {
      next(err);
    }
  },
};
