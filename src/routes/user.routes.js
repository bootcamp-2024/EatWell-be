import express from "express";
import user from "#src/controllers/user.controllers";

const router = express.Router();

router.post("/login", user.logIn);
router.post("/sign-up", user.signUp);
router.post("/verify", user.verify);
router.post("/loginGoogle", user.loginGoogle);
// router.route("/").patch(user.updateInformation).get(user.getInformation);
// router.patch("/password", user.changePassword);

export default router;
