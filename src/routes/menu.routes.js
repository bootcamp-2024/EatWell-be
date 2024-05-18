// menu.routes.js
import express from "express";
import menu from "#src/controllers/menu.controllers";

const router = express.Router();

router.route("/").get(menu.getAllMenus);
router.put("/:id", menu.updateMenu);
router.delete("/:id", menu.deleteMenu);
router.post("/", menu.createMenu);
export default router;
