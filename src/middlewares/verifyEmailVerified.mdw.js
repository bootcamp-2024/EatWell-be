import UserInfoModel from "#src/models/UserInfo.model";
import { CustomError } from "#src/middlewares/errorHandler.mdw";

export default async function verifyEmailVerified(req, res, next) {
  try {
    const email = req.payload.email;
    const result = await UserInfoModel.findOne({ email }).lean();
    if (result.isVerified !== true) {
      throw new CustomError(403, "Account is not verified");
    }
    next();
  } catch (err) {
    next(err);
  }
}
