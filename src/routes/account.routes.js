import express from "express";
import account from "#src/controllers/account.controller";
import config from "#src/config/config";
import { createUploader } from "#src/utils/cloudinary";

const router = express.Router();

const avatarImageUploader = createUploader(config.CLOUDINARY_AVATAR_PATH, [
  "png",
  "jpg",
]);
router.route("/").patch(account.updateInformation).get(account.getInformation);
router.patch("/password", account.changePassword);
router.route("/getPreferences").get(account.getPreferences);
router.route("/update-preference").patch(account.updateUserPreferences);

router.patch(
  "/avatar",
  avatarImageUploader.array("avatar", config.AVATAR_IMAGE_NUMBER_LIMIT),
  account.uploadAvatar
);

export default router;
