const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
module.exports.registerUser = async (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } 

    const {fullname, lastname,email,password} = req.body;
    const hashedPassword = await userModel.hashPassword(password);
    const user = new userModel({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password: hashedPassword
    });

    const token=user.generateAuthToken();
    res.status(201).json({token,user})
}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = await user.generateAuthToken();

        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({ token, user: userData });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
