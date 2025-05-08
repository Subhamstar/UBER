const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.authUser = async (req, res, next) => {
    const token=req.cookies.token||req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const isBlacklisted = await blacklistTokenModel.findOne({ token: token });
    if (isBlacklisted) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded.id).select('-password');
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

}