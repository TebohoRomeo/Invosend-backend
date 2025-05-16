const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const invoiceController = require('../controllers/invoice.controller');

// Logo Upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `logo-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Routes
router.post('/', upload.single('logo'), invoiceController.createInvoice);
router.get('/', invoiceController.getInvoices);
router.post('/send', invoiceController.sendInvoice);

module.exports = router;
