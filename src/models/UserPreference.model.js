import mongoose, { Schema } from "mongoose";

const BMI = new Schema(
  {
    value: { type: Number, default: null },
  },
  { _id: false }
);

const BMR = new Schema(
  {
    value: { type: Number, default: null },
  },
  { _id: false }
);
const height = new Schema(
  {
    value: { type: Number, default: null },
  },
  { _id: false }
);

const weight = new Schema(
  {
    value: { type: Number, default: null },
  },
  { _id: false }
);
const UserPreferenceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "UserInfo" },
    // height: [height],
    // weight: [weight],
    cuisine: { type: String, default: null },
    allergy: [{ type: String }],
    minPrice: { type: Number, default: null },
    maxPrice: { type: Number, default: null },
    bodyGoal: { type: String, default: null },
    activityLevel: { type: String, default: null },
    suggestedCalories: { type: String, default: null },
    // BMI: [BMI],
    // BMR: [BMR],
    healthRecords: [
      {
        height: { type: Number, default: null },
        weight: { type: Number, default: null },
        BMI: { type: Number, default: null },
        BMR: { type: Number, default: null },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    createdDate: { type: Date, default: new Date() },
  },
  { collection: "UserPreference", versionKey: false }
);

const UserPreferenceModel = mongoose.model(
  "UserPreference",
  UserPreferenceSchema
);

export default UserPreferenceModel;
