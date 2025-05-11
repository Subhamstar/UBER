const express = require('express');
const router = express.Router();
const captainController = require('../controllers/captain.controller');
const {body} = require('express-validator');


router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min: 3}).withMessage('First name must be at least 3 characters long'),
    body('fullname.lastname').isLength({min: 3}).withMessage('Last name must be at least 3 characters long'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').notEmpty().withMessage('Vehicle color is required'),
    body('vehicle.plate').notEmpty().withMessage('Vehicle plate is required'),
    body('vehicle.capacity').isNumeric().withMessage('Vehicle capacity must be a number'),
    body('vehicle.vehicleType').notEmpty().withMessage('Vehicle type is required'),



],
    captainController.registerCaptain
)

mpdule.exports = router;