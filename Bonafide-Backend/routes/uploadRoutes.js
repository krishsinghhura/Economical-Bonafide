// uploadRoutes.js
const express = require('express');
const router = express.Router();
const { uploadData,getDataFromRedis,saveChanges } = require('../controllers/uploadController');

router.post('/upload', uploadData);

router.get('/fetch', getDataFromRedis);

router.post("/saveChanges",saveChanges)

module.exports = router;
