import UserInfoModel from "#src/models/UserInfo.model";
import { verifyPassword, encryptPassword } from "#src/utils/crypto";
import UserPreferenceModel from "#src/models/UserPreference.model";
import moment from "moment";

export default {
  async getInformation(req, res, next) {
    try {
      const reqEmail = req.payload.email;
      const result = await UserInfoModel.findOne({
        email: reqEmail,
      }).lean();
      const {
        email,
        password,
        fullName,
        gender,
        phone,
        dateOfBirth,
        height,
        weight,
        isVerified,
      } = result;
      res.status(200).send({
        exitcode: 0,
        account: {
          email,
          password,
          phone,
          fullName,
          dateOfBirth: dateOfBirth
            ? moment(new Date(dateOfBirth)).format("DD/MM/YYYY")
            : null,
          gender: gender,
          isVerified,
          height,
          weight,
        },
        message: "Get information successfully",
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
        allergy,
        minPrice,
        maxPrice,
        bodyGoal,
        activityLevel,
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
          height,
          weight,
          cuisine,
          allergy,
          minPrice,
          maxPrice,
          bodyGoal,
          activityLevel,
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
};
