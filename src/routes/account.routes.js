import express from "express";
import account from "#src/controllers/account.controller";
import config from "#src/config/config";

const router = express.Router();

router.route("/").patch(account.updateInformation).get(account.getInformation);
router.patch("/password", account.changePassword);
router.route("/update-preference").patch(account.updateUserPreferences);

export default router;
