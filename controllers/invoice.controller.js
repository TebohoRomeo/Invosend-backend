const Invoice = require('../models/invoice.model');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const generateInvoicePDF = require('../utils/pdfGenerator');

exports.createInvoice = async (req, res) => {
  try {
    const { items, total, email } = req.body;
    const parsedItems = JSON.parse(items);
    const logoPath = req.file ? req.file.path : '';

    const newInvoice = new Invoice({
      items: parsedItems,
      total,
      logoPath,
      email
    });

    await newInvoice.save();

    // Generate PDF
    const pdfPath = await generateInvoicePDF(newInvoice, logoPath);

    res.status(201).json({ ...newInvoice.toObject(), pdfUrl: `/uploads/${path.basename(pdfPath)}` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
};


exports.getInvoices = async (req, res) => {
  const invoices = await Invoice.find().sort({ createdAt: -1 });
  res.json(invoices);
};

// exports.sendInvoice = async (req, res) => {
//   const { to, subject, text, attachmentPath } = req.body;

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to,
//     subject,
//     text,
//     attachments: [
//       {
//         filename: path.basename(attachmentPath),
//         path: attachmentPath
//       }
//     ]
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) return res.status(500).send(error.toString());
//     res.status(200).send(`Email sent: ${info.response}`);
//   });
// };



exports.sendInvoice = async (req, res) => {
  const { to, subject, text, attachmentPath } = req.body;

  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });

  // Read the file as a buffer
  const fileStream = fs.createReadStream(attachmentPath);

  const data = {
    from: `Your Company <mail@${process.env.MAILGUN_DOMAIN}>`,
    to,
    subject,
    text,
    attachment: fileStream
  };

  mg.messages().send(data, function (error, body) {
    if (error) {
      console.error('Mailgun send error:', error);
      return res.status(500).send('Failed to send invoice');
    }

    console.log('Mailgun response:', body);
    res.status(200).send('Invoice sent successfully!');
  });
};