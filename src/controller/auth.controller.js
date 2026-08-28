import CONFIG from "../config/config.js";
import jwt from "jsonwebtoken";
import UserModel from "../models/auth.model.js";
import passport from "passport";

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

        // req.cookie('token', token, {
        //     httpOnly: true,
        //     secure: CONFIG.NODE_ENV === 'production',
        //     sameSite: 'strict',
        //     maxAge: 3600000 // 1 hour
        // });
        
        res.cookie('token', token);

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

        res.cookie('token', token);

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

export const googleAuth = async (req, res, next) => {
    const role = req.query.role;

    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: role
    })(req, res, next);
}

export const googleCallback = async (req, res) => {
    try {
        const profile = req.user;
        const role = req.query.state; // Retrieve the role from the state parameter

        if (!profile) {
            return res.status(400).json({ 
                message: 'Google authentication failed' 
            });
        }

        const email = profile.emails[0].value;
        let user = await UserModel.findOne({ email });

        if (!user) {
            user = await UserModel.create({
                googleId: profile.id,
                fullName: profile.displayName,
                email,
                role: role,
            });
        }

        const { token } = tokenGenerator(user);

        res.cookie('token', token);

        res.redirect(CONFIG.NODE_ENV === 'development' ? `http://localhost:5173/dashboard` : '/dashboard');
    } catch (error) {
        res.status(500).json({
            message: 'Server error during Google login',
            error: error.message
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await UserModel.findById(userId).select('-password -__v');

        if (!user) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        res.status(200).json({
            message: 'User retrieved successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error while retrieving user',
            error: error.message
        });
    }
};