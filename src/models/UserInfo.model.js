import mongoose from "mongoose";
import UserPreferenceModel from "#src/models/UserPreference.model";

const UserInfoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    fullName: { type: String, require: true },
    gender: { type: String, require: true },
    phone: { type: String, require: true },
    dateOfBirth: { type: String, require: true },
    token: { type: String, default: null },
    otp: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    createdDate: { type: Date, default: new Date() },
  },
  { collection: "UserInfo", versionKey: false }
);

// Đăng ký mô hình mongoose với schema đã tạo
const UserInfoModel = mongoose.model("UserInfo", UserInfoSchema);

export default UserInfoModel;
