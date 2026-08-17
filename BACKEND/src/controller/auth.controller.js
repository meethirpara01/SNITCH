export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
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
        res.status(201).json({ 
            message: 'User registered successfully' 
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
};