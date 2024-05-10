import express from "express";
import user from "#src/controllers/user.controllers";

const router = express.Router();

router.post("/login", user.logIn);
router.post("/sign-up", user.signUp);
router.post("/verify", user.verify);
router.post("/loginGoogle", user.loginGoogle);

export default router;
