import { CustomError } from "#src/middlewares/errorHandler.mdw";

export default function anonymousEndpoint(req, res) {
  throw new CustomError();
}
