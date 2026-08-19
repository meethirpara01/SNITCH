import CONFIG from "../config/config.js";
import jwt from "jsonwebtoken";
import UserModel from "../models/auth.model.js";

export const tokenGenerator = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    };

    const token = jwt.sign(payload, 
        CONFIG.JWT_SECRET, { expiresIn: '1h' }
    );

    return {
        user: payload,
        token
    };
}

export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, contact, role } = req.body;

        const existingUser = await UserModel.findOne({
            $or: [
                { email },
                { contact }
            ]
         });

        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already exists'
            });
        }

        console.log(fullName, email, password, contact, role);
        
        const newUser = await UserModel.create({
            fullName,
            email,
            password,
            contact,
            role
        });

        const { token } = tokenGenerator(newUser);

        res.status(201).json({ 
            message: 'User registered successfully',
            newUser,
            token
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
};