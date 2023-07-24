const express = require('express');
const userAuth = require('../Middlewares/user-auth');

const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, (req, res) => {
    res.status(200).json(req.user);
});

module.exports = profileRouter;