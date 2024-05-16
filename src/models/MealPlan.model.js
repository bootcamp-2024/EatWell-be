import mongoose, { Types } from "mongoose";
const Schema = mongoose.Schema;

// Định nghĩa schema cho một bữa ăn
const MealPlanSchema = new mongoose.Schema(
  {
    meal_list: [
      {
        meal_plan: {
          type: [
            {
              _id: false,
              url: { type: String, default: null },
              name: { type: String, default: null },
              cook_time: { type: String, default: null },
              prep_time: { type: String, default: null },
              total_time: { type: String, default: null },
              description: { type: String, default: null },
              ingredients: {
                type: [
                  {
                    quantity: { type: Number, default: null },
                    unit: { type: String, default: null },
                    prepare_type: { type: String, default: null },
                    ingredient_id: { type: String, default: null },
                    grams: { type: Number, default: null },
                  },
                ],
                default: null,
              },
              instructions: { type: [String], default: null },
              nutrition: {
                calories: { type: String, default: null },
                carbohydrateContent: { type: String, default: null },
                cholesterolContent: { type: String, default: null },
                fiberContent: { type: String, default: null },
                proteinContent: { type: String, default: null },
                saturatedFatContent: { type: String, default: null },
                sodiumContent: { type: String, default: null },
                sugarContent: { type: String, default: null },
                fatContent: { type: String, default: null },
                unsaturatedFatContent: { type: String, default: null },
              },
              // image: { type: Schema.Types.Mixed, default: null },
              // video: {
              //   type: {
              //     contentUrl: { type: String, default: null },
              //     description: { type: String, default: null },
              //     duration: { type: String, default: null },
              //     name: { type: String, default: null },
              //   },
              //   default: null,
              // },
              cuisine: { type: String, default: null },
              category: { type: String, default: null },
              tags: { type: [String], default: null },
              total_calo: { type: Number, default: null },
              total_fat: { type: Number, default: null },
              total_fiber: { type: Number, default: null },
              total_protein: { type: Number, default: null },
              total_carbohydrat: { type: Number, default: null },
              total_sodium: { type: Number, default: null },
              total_sugar: { type: Number, default: null },
              total_cholesterol: { type: Number, default: null },
              total_cost: { type: Number, default: null },
              total_error: { type: Number, default: null },
              grams: { type: Number, default: null },
              meal_time: { type: String, default: null },
            },
          ],
          default: null,
        },
        total_nutritions: {
          type: {
            total_fiber: { type: Number, default: null },
            total_sugar: { type: Number, default: null },
            total_calo: { type: Number, default: null },
            total_carbohydrat: { type: Number, default: null },
            total_protein: { type: Number, default: null },
            total_fat: { type: Number, default: null },
            total_sodium: { type: Number, default: null },
            total_cholesterol: { type: Number, default: null },
            total_cost: { type: Number, default: null },
            total_count: { type: Number, default: null },
          },
          default: null,
        },
      },
    ],
  },
  { collection: "MealPlan", versionKey: false }
);

// Tạo model từ schema
const MealPlanModel = mongoose.model("MealPlan", MealPlanSchema);

export default MealPlanModel;
