import express from "express";
import user from "#src/controllers/user.controllers";

const router = express.Router();

router.get("/login", user.logIn);
router.post("/sign-up", user.signUp);

export default router;
