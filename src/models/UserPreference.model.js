import mongoose, { Schema } from "mongoose";

const nutritionPerDaySchema = new Schema(
  {
    protein: { type: Number, default: null },
    fat: { type: Number, default: null },
    carbohydrat: { type: Number, default: null },
    fiber: { type: Number, default: null },
  },
  { _id: false }
);
const UserPreferenceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "UserInfo" },
    tags: { type: String, default: null },
    cuisine: { type: String, default: null },
    allergies: [{ type: String }],
    bodyGoal: { type: String, default: null },
    activityLevel: { type: String, default: null },
    suggestedCalories: { type: String, default: null },
    healthRecords: [
      {
        height: { type: Number, default: null },
        weight: { type: Number, default: null },
        BMI: { type: Number, default: null },
        BMR: { type: Number, default: null },
        nutritionPerDay: nutritionPerDaySchema,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    weightGoal: { type: Number, default: null },
    createdDate: { type: Date, default: new Date() },
  },
  { collection: "UserPreference", versionKey: false }
);

const UserPreferenceModel = mongoose.model(
  "UserPreference",
  UserPreferenceSchema
);

export default UserPreferenceModel;
