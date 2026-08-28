import ProductModel from "../models/product.model.js";
import CONFIG from "../config/config.js";
import ImageKit, { toFile } from "@imagekit/nodejs";

const client = new ImageKit({
    folder: "/snitch",
    privateKey: CONFIG.IMAGEKIT_PRIVATE_KEY,
});

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, currency } = req.body;
        let images = [];

        if (req.files && req.files.length > 0) {
            images = await Promise.all(
                req.files.map(async (file) => {
                    const response = await client.files.upload({
                        file: await toFile(Buffer.from(file.buffer), file.originalname),
                        fileName: file.originalname,
                        folder: "/snitch/" + req.user._id.toString() + "/" + name.replace(/\s+/g, '_'),
                    });

                    return response.url;
                })
            );
        }

        const newProduct = await ProductModel.create({
            name,
            description,
            price,
            currency: currency || 'INR',
            image: images,
            seller: req.user._id,
        });

        res.status(201).json({
            message: 'Product created successfully',
            product: newProduct,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
};

export const getMyProducts = async (req, res) => {
    try {
        const products = await ProductModel.find({ seller: req.user._id }).populate('seller', 'fullName email contact');
        res.status(200).json({
            message: 'Products fetched successfully',
            products,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await ProductModel.find().populate('seller', 'fullName email contact');
        res.status(200).json({
            message: 'Products fetched successfully',
            products,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
};