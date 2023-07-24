const express = require('express');
const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const {body} = require('express-validator');
const bcrypt = require('bcrypt');
const validateRequest = require('../Middlewares/validate-request');
const cors = require('cors');

const loginRouter = express.Router();

loginRouter.use(cors({
    origin: 'http://127.0.0.1:5173',
    credentials: true
}));

loginRouter.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password'),
], validateRequest,
async (req, res) => {
    const {email, password} = req.body;

    try {
        const existingUser = await User.findOne({email});

        if (!existingUser) {
            res.status(400).json({error: 'The email doesn\'t exist'});
        }

        const isPwdValid = await bcrypt.compare(password, existingUser.password);

        if (!isPwdValid) {
            res.status(400).json({error: 'password mismatch'});
        }

        if(isPwdValid) {
        jwt.sign({
            id: existingUser._id,
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            userImage: existingUser.userImage
        }, process.env.JWT_KEY, {}, (err, token) => {
            if(err) throw err;
            res.cookie('token', token, {
                sameSite: 'none',
                secure: true
            }).json(existingUser);
        });
    }

    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message});
    }
});

module.exports = loginRouter;