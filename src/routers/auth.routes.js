import express from "express";
import { registerValidator, loginValidator } from "../validators/auth.validators.js";
import { registerUser, loginUser, googleCallback } from "../controller/auth.controller.js";
import passport from "passport";

const router = express.Router();

router.post("/register", registerValidator, registerUser);
router.post("/login", loginValidator, loginUser);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), googleCallback);
router.get("/google/callback", passport.authenticate("google", { session: false }), googleCallback);

export default router;