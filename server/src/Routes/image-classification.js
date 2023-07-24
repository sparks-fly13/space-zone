const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const imgClassRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

imgClassRouter.use(express.json());

imgClassRouter.post('/analyze-image', upload.single('file'), async (req, res) => {
    try {
        const { file } = req;
        console.log(file.path);
        const { data } = await axios.post('http://127.0.0.1:5000/predict', {
            file: file.path, // Use the file path, not the actual file object
        });

        //to delete the file after prediction
        fs.unlink(file.path, (err) => {
            if (err) {
                console.error('Error deleting image:', err);
            }
            console.log('Image deleted:', file.path);
        });

        res.json({ prediction: data.prediction });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = imgClassRouter;