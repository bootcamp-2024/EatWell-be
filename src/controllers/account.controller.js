import UserInfoModel from "#src/models/UserInfo.model";
import { verifyPassword, encryptPassword } from "#src/utils/crypto";
import UserPreferenceModel from "#src/models/UserPreference.model";
import moment from "moment";
import { cloudinary } from "#src/utils/cloudinary";

export default {
  async getInformation(req, res, next) {
    try {
      const reqEmail = req.payload.email;
      const userInfo = await UserInfoModel.findOne({
        email: reqEmail,
      }).lean();

      const {
        _id,
        email,
        password,
        fullName,
        gender,
        phone,
        dateOfBirth,
        isVerified,
        avatar_path,
        avatar_filename,
      } = userInfo;

      res.status(200).send({
        exitcode: 0,
        account: {
          _id,
          email,
          password,
          phone,
          fullName,
          dateOfBirth: dateOfBirth
            ? moment(new Date(dateOfBirth)).format("DD/MM/YYYY")
            : null,
          gender: gender,
          isVerified,
          avatar_path,
          avatar_filename,
        },

        message: "Get user information successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  async getPreferences(req, res, next) {
    try {
      const reqEmail = req.payload.email;
      const userInfo = await UserInfoModel.findOne({
        email: reqEmail,
      }).lean();
      const userPreferences = await UserPreferenceModel.findOne({
        userId: userInfo._id,
      }).lean();

      const {
        tags,
        cuisine,
        allergies,
        bodyGoal,
        activityLevel,
        suggestedCalories,
        healthRecords,
      } = userPreferences;

      res.status(200).send({
        exitcode: 0,
        preferences: {
          tags,
          cuisine,
          allergies,
          bodyGoal,
          activityLevel,
          suggestedCalories,
          healthRecords,
        },
        message: "Get user information successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  async updateInformation(req, res, next) {
    try {
      const { phone, fullName, dateOfBirth, gender } = req.body;
      const { email } = req.payload;
      const parseBirthday = moment(dateOfBirth, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
      console.log(parseBirthday);

      if (phone) {
        const accountPhone = await UserInfoModel.findOne({ phone }).lean();
        if (accountPhone && accountPhone.email !== email) {
          return res.status(200).send({
            exitcode: 103,
            message: "Phone number is already used",
          });
        }
      }

      const entity = {
        phone,
        fullName,
        dateOfBirth: parseBirthday,
        gender,
      };

      await UserInfoModel.findOneAndUpdate({ email }, entity);

      res.status(200).send({
        exitcode: 0,
        message: "Update information successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  async changePassword(req, res, next) {
    try {
      const { password, newPassword, confirmPassword } = req.body;
      const { email } = req.payload;

      if (newPassword !== confirmPassword) {
        return res.status(200).send({
          exitcode: 102,
          message: "New password and confirm password are not match",
        });
      }

      const account = await UserInfoModel.findOne({ email }).lean();
      const encryptedPassword = account.password;

      // Check the correctness of password
      if (!verifyPassword(password, encryptedPassword)) {
        return res.status(200).send({
          exitcode: 101,
          message: "Password is not correct",
        });
      }
      // Encrypt password by salting and hashing
      const encryptedNewPassword = encryptPassword(newPassword);
      await UserInfoModel.updateOne(
        { email: email },
        { $set: { password: encryptedNewPassword } }
      );

      res.status(200).send({
        exitcode: 0,
        message: "Change password successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  // Heath Setting
  async updateUserPreferences(req, res, next) {
    try {
      const {
        height,
        weight,
        cuisine,
        allergies,
        tags,
        bodyGoal,
        activityLevel,
        nutritionPerDay,
        suggestedCalories,
        BMI,
        BMR,
      } = req.body;
      const { email } = req.payload;

      const userInfo = await UserInfoModel.findOne({ email }).lean();
      if (!userInfo) {
        return res.status(404).json({
          exitcode: 101,
          message: "User not found!",
        });
      }

      const userPreference = await UserPreferenceModel.findOneAndUpdate(
        { userId: userInfo._id },
        {
          cuisine,
          allergies,
          tags,
          bodyGoal,
          activityLevel,
          $push: {
            healthRecords: {
              BMI: BMI,
              BMR: BMR,
              height: height,
              weight: weight,
              nutritionPerDay: {
                protein: nutritionPerDay.protein,
                fat: nutritionPerDay.fat,
                carbohydrat: nutritionPerDay.carbohydrat,
                fiber: nutritionPerDay.fiber,
              },
              updatedAt: new Date(),
            },
          },
          suggestedCalories,
        },
        { upsert: true, new: true }
      );

      return res.status(200).json({
        exitcode: 0,
        message: "User preference updated successfully!",
        userPreference,
      });
    } catch (error) {
      next(error);
    }
  },

  async uploadAvatar(req, res, next) {
    try {
      const { email } = req.payload;
      const { files } = req;
      const listImg = files.map((item) => ({
        path: item.path,
        filename: item.filename,
      }));
      const avatar = listImg[0];

      // Remove old image
      const currentUser = await UserInfoModel.findOne(
        { email: email },
        "avatar_path avatar_filename"
      );
      const currentFilename = currentUser.avatar_filename;
      if (currentFilename) {
        const uploader = cloudinary.uploader;
        try {
          await uploader.destroy(currentFilename);
        } catch (err) {
          console.log("Cannot delete old image!");
        }
      }
      // Upload image
      const result = await UserInfoModel.findOneAndUpdate(
        { email },
        {
          avatar_path: avatar.path,
          avatar_filename: avatar.filename,
        }
      );
      res.status(200).send({
        exitcode: 0,
        message: "Upload avatar successfully",
      });
    } catch (err) {
      next(err);
    }
  },
};
