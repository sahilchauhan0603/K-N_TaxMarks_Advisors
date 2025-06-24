const express = require('express');
const router = express.Router();
const { sendContactMail } = require('../controllers/contactController');

router.post('/send', sendContactMail);

module.exports = router;
