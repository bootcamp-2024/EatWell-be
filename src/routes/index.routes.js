import user from "#src/routes/user.routes";
import account from "#src/routes/account.routes";
import meal from "#src/routes/meal.routes";
import express from "express";
import verifyEmailVerified from "#src/middlewares/verifyEmailVerified.mdw";
import verifyLogin from "#src/middlewares/verifyLogin.mdw";

const router = express.Router();

router.use("/user", user);
router.use("/account", verifyLogin, verifyEmailVerified, account);
router.use("/meal", verifyLogin, verifyEmailVerified, meal);

export default router;
