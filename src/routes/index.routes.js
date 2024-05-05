import user from "#src/routes/user.routes";
import express from "express";

const router = express.Router();

router.use("/user", user);

export default router;
