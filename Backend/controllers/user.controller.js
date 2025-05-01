const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const User = require('../models/user.model');
module.exports.registerUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !fullname.firstname || !fullname.lastname) {
            return res.status(400).json({ message: 'Firstname and lastname are required' });
        }

        if (password.length > 20) {
            return res.status(400).json({ message: 'Password must be at most 20 characters' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const user = new User({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            email: email.toLowerCase().trim(),
            password
        });

        await user.save();

        const token = user.generateAuthToken();
        const userData = user.toObject();
        delete userData.password;

        res.status(201).json({ token, user: userData });

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: err.message });
    }
};


module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();
        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({ token, user: userData });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

