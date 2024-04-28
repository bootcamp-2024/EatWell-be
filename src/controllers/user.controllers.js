import moment from "moment";
import jwt from "jsonwebtoken";

import config from "#src/config/config";
import { CustomError } from "#src/middlewares/errorHandler.mdw";
import userInfoModel from "#src/models/UserInfo.model";
import { encryptPassword, generateToken } from "#src/utils/crypto";
import { createTransport, getVerifyEmail } from "#src/utils/mailer";
import { verifyPassword } from "#src/utils/crypto";

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
};
