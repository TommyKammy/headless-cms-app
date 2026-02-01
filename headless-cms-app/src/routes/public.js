const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const { verifyApiKey } = require('../middleware/auth');

router.use(verifyApiKey);

router.get('/:modelId', publicController.getContents);
router.get('/:modelId/:contentId', publicController.getContent);

module.exports = router;
