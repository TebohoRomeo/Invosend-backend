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

router.delete('/:id', async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

module.exports = router;
