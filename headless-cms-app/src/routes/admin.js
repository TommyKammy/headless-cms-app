const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.post('/models', adminController.createModel);
router.get('/models', adminController.getAllModels);
router.get('/models/:id', adminController.getModelById);
router.put('/models/:id', adminController.updateModel);
router.delete('/models/:id', adminController.deleteModel);

router.post('/contents', adminController.createContent);
router.get('/contents', adminController.getAllContents);
router.get('/contents/:id', adminController.getContentById);
router.put('/contents/:id', adminController.updateContent);
router.delete('/contents/:id', adminController.deleteContent);

module.exports = router;
