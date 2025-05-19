const express = require('express');
const router = express.Router();
const { UploadController } = require('../controllers/upload.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.post('/signed-url', authMiddleware, UploadController.getSignedUrl);

module.exports = { uploadRoutes: router };