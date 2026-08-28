import express from "express";
import CONFIG from "../config/config.js";
import { registerValidator, loginValidator } from "../validators/auth.validators.js";
import { registerUser, loginUser, googleCallback, googleAuth, getMe } from "../controller/auth.controller.js";
import passport from "passport";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerValidator, registerUser);
router.post("/login", loginValidator, loginUser);
// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google", googleAuth);
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: CONFIG.NODE_ENV === 'development' ? 'http://localhost:5173/login' : '/login' }), googleCallback);
// And session: false only affects what happens after done(null, profile):
// done(null, profile)
//        ↓
//    session:false
//        ↓
// Don't create Passport session
//        ↓
// Continue to googleCallback()
router.get("/getMe", authenticateToken, getMe);

export default router;