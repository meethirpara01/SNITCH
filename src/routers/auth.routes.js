import express from "express";
import { registerValidator } from "../validators/auth.validators.js";
import { registerUser } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register", registerValidator, registerUser);

export default router;