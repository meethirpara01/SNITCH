import express from "express";
import multer from "multer";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { createProduct, getMyProducts, getProducts } from "../controller/product.controller.js";
import { productValidator } from "../validators/product.validators.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/create", authenticateToken, authorizeRoles("seller"), upload.array('images', 5), productValidator, createProduct);
router.get("/getProducts", authenticateToken, authorizeRoles("seller"), getMyProducts);

router.get("/getAllProducts", authenticateToken, getProducts);

export default router;