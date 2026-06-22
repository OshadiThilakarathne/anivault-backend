import express from "express";
import {
  getLibrary,
  addItem,
  updateItem,
  deleteItem,
} from "../controllers/libraryController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.use(protect); // all library routes require auth

router.get("/",     getLibrary);
router.post("/",    addItem);
router.put("/:id",  updateItem);
router.delete("/:id", deleteItem);

export default router;