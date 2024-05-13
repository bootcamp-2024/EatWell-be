import mongoose from "mongoose";
const MenuSchema = new mongoose.Schema(
  {
    menu_id: { type: mongoose.Types.ObjectId, require: true },
    start_date: { type: Date, require: true },
    end_date: { type: Date, require: true },
    meal_name: { type: String, require: true },
    calories: { type: Number, require: true },
  },
);

// Đăng ký mô hình mongoose với schema đã tạo
const MenuModel = mongoose.model("Menu", MenuSchema);
console.log("Model has worked okay!");
export default MenuModel;
