const express = require('express');
const router = express.Router();
const { confirmData } = require('../controllers/confirmController');
const {verifyAadhaar}=require("../controllers/verifyController");

router.post('/confirm', confirmData);
router.post("/verify",verifyAadhaar);



module.exports = router;
