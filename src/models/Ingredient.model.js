import mongoose, { Types } from "mongoose";

const UnitPriceSchema = new mongoose.Schema({
  name: { type: String, default: null },
  category: { type: String, default: null },
  url: { type: String, default: null },
  image: { type: String, default: null },
  quantity: { type: String, default: null },
  unit: { type: String, default: null },
  domain_url: { type: String, default: null },
});

const NutritionSchema = new mongoose.Schema({
  energy_kcal: { type: String, default: null },
  energy_kj: { type: String, default: null },
  water_g: { type: String, default: null },
  protein_g: { type: String, default: null },
  carbohydrates_g: { type: String, default: null },
  sugars_g: { type: String, default: null },
  fat_g: { type: String, default: null },
  saturated_fat_g: { type: String, default: null },
  monounsaturated_fat_g: { type: String, default: null },
  polyunsaturated_fat_g: { type: String, default: null },
  cholesterol_mg: { type: String, default: null },
  dietary_fiber_g: { type: String, default: null },
  nutrition_emotional_value: { type: String, default: null },
  nutrition_health_value: { type: String, default: null },
  vitamin_A_mg: { type: String, default: null },
  vitamin_B1_mg: { type: String, default: null },
  vitamin_B2_mg: { type: String, default: null },
  vitamin_B3_mg: { type: String, default: null },
  vitamin_B6_mg: { type: String, default: null },
  vitamin_B11_microgram: { type: String, default: null },
  vitamin_B12_microgram: { type: String, default: null },
  vitamin_C_mg: { type: String, default: null },
  vitamin_D_microgram: { type: String, default: null },
  vitamin_E_mg: { type: String, default: null },
  vitamin_K_microgram: { type: String, default: null },
  vitamin_emotional_value: { type: String, default: null },
  vitamin_health_value: { type: String, default: null },
  sodium_mg: { type: String, default: null },
  potassium_mg: { type: String, default: null },
  calcium_mg: { type: String, default: null },
  phosphor_mg: { type: String, default: null },
  iron_mg: { type: String, default: null },
  magnesium_mg: { type: String, default: null },
  copper_mg: { type: String, default: null },
  zinc_mg: { type: String, default: null },
  selenium_microgram: { type: String, default: null },
  iodine_microgram: { type: String, default: null },
  manganese_microgram: { type: String, default: null },
  mineral_emotional_value: { type: String, default: null },
  mineral_health_value: { type: String, default: null },
  url: { type: String, default: null },
});

const IngredientSchema = new mongoose.Schema({
  _id: String,
  name: { type: String, default: null },
  nutritions: NutritionSchema,
  unit_price: [UnitPriceSchema],
});

const IngredientModel = mongoose.model("Ingredient", IngredientSchema);

export default IngredientModel;
