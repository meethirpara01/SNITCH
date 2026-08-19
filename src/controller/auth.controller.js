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

export const loginUser = async (req, res) => {
    try {
        const { email, identifier, password } = req.body;
        const loginQuery = identifier || email;

        if (!loginQuery || !password) {
            return res.status(400).json({ 
                message: 'Email or phone number and password are required' 
            });
        }

        const user = await UserModel.findOne({
            $or: [
                { email: loginQuery.toLowerCase() },
                { contact: loginQuery }
            ]
        });

        if (!user) {
            return res.status(401).json({ 
                message: 'No account found with this email or phone number' 
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Invalid credentials. Incorrect password.' 
            });
        }

        const { token } = tokenGenerator(user);

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                contact: user.contact,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error during login',
            error: error.message
        });
    }
};