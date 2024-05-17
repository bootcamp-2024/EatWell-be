const mongoose = require("mongoose");

const UnitPriceSchema = new mongoose.Schema({
  name: String,
  category: String,
  url: String,
  image: String,
  price: String,
  quantity: String,
  unit: String,
  domain_url: String,
});

const NutritionSchema = new mongoose.Schema({
  energy_kcal: String,
  energy_kj: String,
  water_g: String,
  protein_g: String,
  carbohydrates_g: String,
  sugars_g: String,
  fat_g: String,
  saturated_fat_g: String,
  monounsaturated_fat_g: String,
  polyunsaturated_fat_g: String,
  cholesterol_mg: String,
  dietary_fiber_g: String,
  nutrition_emotional_value: String,
  nutrition_health_value: String,
  vitamin_A_mg: String,
  vitamin_B1_mg: String,
  vitamin_B2_mg: String,
  vitamin_B3_mg: { type: String, default: null },
  vitamin_B6_mg: String,
  vitamin_B11_microgram: String,
  vitamin_B12_microgram: { type: String, default: null },
  vitamin_C_mg: String,
  vitamin_D_microgram: String,
  vitamin_E_mg: { type: String, default: null },
  vitamin_K_microgram: { type: String, default: null },
  vitamin_emotional_value: String,
  vitamin_health_value: String,
  sodium_mg: String,
  potassium_mg: String,
  calcium_mg: String,
  phosphor_mg: String,
  iron_mg: String,
  magnesium_mg: String,
  copper_mg: { type: String, default: null },
  zinc_mg: { type: String, default: null },
  selenium_microgram: { type: String, default: null },
  iodine_microgram: { type: String, default: null },
  manganese_microgram: { type: String, default: null },
  mineral_emotional_value: String,
  mineral_health_value: String,
  url: String,
});

const IngredientSchema = new mongoose.Schema({
  _id: String,
  name: String,
  nutritions: NutritionSchema,
  unit_price: [UnitPriceSchema],
});

const Ingredient = mongoose.model("Ingredient", IngredientSchema);

module.exports = Ingredient;
