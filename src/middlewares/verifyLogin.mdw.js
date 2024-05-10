import config from "#src/config/config";
import jwt from "jsonwebtoken";
import { CustomError } from "#src/middlewares/errorHandler.mdw";

export default function verifyLogin(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    throw new CustomError(401, "Missing token");
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.payload = {
      email: decoded.email,
    };
    next();
  } catch (err) {
    throw new CustomError(401, err.message);
  }
}
