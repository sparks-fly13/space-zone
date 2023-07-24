const express = require('express');
const User = require('../Models/user');
const {body} = require('express-validator');
const bcrypt = require('bcrypt');
const validateRequest = require('../Middlewares/validate-request');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const signUpRouter = express.Router();

signUpRouter.use(cors(
    {
        origin: 'http://127.0.0.1:5173',
        credentials: true
    }
));

signUpRouter.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage('Password must be between 4 and 20 characters'),
], validateRequest,
async (req, res) => {
    const {email, password, firstName, lastName} = req.body;

    try {
        const existingUser = await User.findOne({email});

        if (existingUser) {
            res.status(400).json({error: 'Email in use'});
        }

        const hashedPwd = await bcrypt.hash(password, 12);

        const user = await User.create({
            email,
            password: hashedPwd,
            firstName,
            lastName
        });

        jwt.sign({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userImage: user.userImage
        }, process.env.JWT_KEY, {}, (err, token) => {
            if(err) throw err;
            res.cookie('token', token, {
                sameSite: 'none',
                secure: true
            }).json(user);
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message});
    }
});

module.exports = signUpRouter;