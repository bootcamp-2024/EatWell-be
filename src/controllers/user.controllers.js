import moment from "moment";
import jwt from "jsonwebtoken";

import config from "#src/config/config";
import { CustomError } from "#src/middlewares/errorHandler.mdw";
import userInfoModel from "#src/models/UserInfo.model";
import { encryptPassword, generateToken } from "#src/utils/crypto";
import { createTransport, getVerifyEmail } from "#src/utils/mailer";
import { verifyPassword } from "#src/utils/crypto";
import oauth2Client from "#src/utils/oauth2";
import { generateOTP } from "../utils/crypto";
import { getOTPEmail } from "../utils/mailer";

export default {
  async signUp(req, res, next) {
    try {
      const { email, password, fullName, phone, gender, dateOfBirth } =
        req.body;

      // 256 bits which provides about 1e+77 possible different number
      // This is enough for preventing brute force
      const verifyToken = generateToken(config.NUMBER_BYTE_VERIFY_TOKEN);

      // Encrypt password by salting and hashing
      const encryptedPassword = encryptPassword(password);
      console.log(encryptedPassword);

      // Check if email already exists
      const isEmailExists = await userInfoModel.findOne({ email }).lean();
      if (isEmailExists) {
        res.status(200).send({
          exitcode: 101,
          message: "Email already exists",
        });
        return;
      }

      const isPhoneExists = await userInfoModel.findOne({ phone }).lean();
      if (isPhoneExists) {
        res.status(200).send({
          exitcode: 102,
          message: "Phone already exists",
        });
        return;
      }

      const newUserInfo = {
        fullName,
        phone,
        dateOfBirth,
        email,
        password: encryptedPassword,
        token: verifyToken,
        gender,
      };

      const createdUser = await userInfoModel.create(newUserInfo);

      const url = req.headers.origin;
      // Send the time for each mail is different
      // This prevent the html being trimmed by Gmail
      const mailOption = getVerifyEmail(email, url, verifyToken);
      await createTransport().sendMail(mailOption);

      res.status(200).send({
        exitcode: 0,
        message:
          "Create account successfully! Please open your email to verify your account.",
        password: encryptedPassword,
      });
    } catch (error) {
      next(error);
    }
  },

  async logIn(req, res, next) {
    try {
      const { email, password } = req.body;

      // Check if email already exists
      const user = await userInfoModel.findOne({ email }).lean();
      if (!user) {
        return res.status(200).send({
          exitcode: 101,
          message: "Email or password is not correct!",
        });
      }

      // Get the database password
      const encryptedPassword = user.password;

      // Check the correctness of password
      if (!verifyPassword(password, encryptedPassword)) {
        return res.status(200).send({
          exitcode: 101,
          message: "Email or password is not correct",
        });
      }

      // Handle account not verified
      const verified = user.isVerified;
      if (!verified) {
        return res.status(200).send({
          exitcode: 102,
          message: "Account is not verified",
        });
      }

      const returnAccount = {
        email: user.email,
        phone: user.phone,
        fullname: user.fullname,
        dateOfBirth: user.dateOfBirth
          ? moment(new Date(user.dateOfBirth)).format("DD/MM/YYYY")
          : null,
        gender: user.gender,
        isVerified: user.isVerified,
      };

      // Create payload for encryption
      const payload = {
        email: email,
      };

      // Send back response with token
      res.status(200).send({
        exitcode: 0,
        message: "Login successfully!",
        token: jwt.sign(payload, config.JWT_SECRET, {
          expiresIn: config.JWT_EXP_TIME,
        }),
        account: returnAccount,
      });
    } catch (err) {
      next(err);
    }
  },

  async verify(req, res, next) {
    try {
      const { token } = req.body;

      const result = await userInfoModel.updateOne(
        { token: token },
        { $set: { verified: true } }
      );
      if (result.nModified === 1) {
        res.status(200).send({
          exitcode: 0,
          message: "Verification successfully",
        });
      } else {
        res.status(200).send({
          exitcode: 101,
          message: "Verification code not found",
        });
      }
    } catch (err) {
      next(err);
    }
  },

  async loginGoogle(req, res, next) {
    try {
      // Extract and verify token from Google
      const { tokenId } = req.body;
      const result = await oauth2Client.verifyIdToken({
        idToken: tokenId,
        audience: config.GOOGLE_CLIENT_ID,
      });

      // Create new account if email not registered
      const { email } = result.payload;
      const currentAccount = await userInfoModel.findOne({ email }).lean();
      if (currentAccount === null) {
        const newAccount = {
          email: email,
          verified: true,
        };
        await userInfoModel.create(newAccount);
      }

      // Sign a new token by server
      const payload = {
        email: email,
      };
      res.send({
        exitcode: 0,
        message: "Login successfully!",
        token: jwt.sign(payload, config.JWT_SECRET, {
          expiresIn: config.JWT_EXP_TIME,
        }),
      });
    } catch (err) {
      next(err);
    }
  },

  async getInformation(req, res, next) {
    try {
      const reqEmail = req.payload;
      const result = await userInfoModel.findOne({ reqEmail }).lean();
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

      const account = await userInfoModel.findOne({ email }).lean();
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
      await userInfoModel.updateOne(
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

  async sendMailForgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await userInfoModel.findOne({ email }).lean();
      if (!user) {
        return res.status(200).send({
          exitcode: 101,
          message: "The user does not exist, please create a new account!",
        });
      }

      // Generate OTP
      const otp = await generateOTP();

      // Ghi OTP vào tài khoản người dùng
      user.otp = otp;
      await user.save();

      const mailOption = getOTPEmail(email, otp);
      await createTransport().sendMail(mailOption);

      res.status(200).send({
        exitcode: 0,
        message: "Send OTP mail successfully! Please open your email!",
      });
    } catch (error) {
      return res.RH.error(error);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      const { otp } = req.body;
      const hasOTP = await userInfoModel.findOne({ otp }).lean();

      if (!hasOTP) {
        return res.status(200).send({
          exitcode: 101,
          message: "Wrong OTP",
        });
      }

      const { email, password, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        return res.status(200).send({
          exitcode: 102,
          message: "New password and confirm password are not match",
        });
      }

      const account = await userInfoModel.findOne({ email }).lean();
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
      await userInfoModel.updateOne(
        { email: email },
        { $set: { password: encryptedNewPassword } }
      );

      res.status(200).send({
        exitcode: 0,
        message: "Change password successfully!",
      });
    } catch (err) {
      next(err);
    }
  },
};
