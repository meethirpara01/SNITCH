import express from "express";
import { registerValidator } from "../validators/auth.validators.js";

const router = express.Router();

router.post("/register", registerValidator);

export default router;