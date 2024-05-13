// menu.routes.js
import express from "express";
import menu from "#src/controllers/menu.controllers";

const router = express.Router();

router.route("/").get(menu.getAllMenus);
export default router;
