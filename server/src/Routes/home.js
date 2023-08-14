const express = require('express');

const homeRouter = express.Router();

homeRouter.get('/home', async (req, res) => {

    res.send('Home');
});

module.exports = homeRouter;