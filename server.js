const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://Teboho:c1pNbUpIjS3OZlLz@cluster0.ktamm9e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

const invoiceSchema = new mongoose.Schema({
  items: [{ name: String, quantity: Number, price: Number }],
  total: Number,
  logoPath: String,
  email: String,
});



const Invoice = mongoose.model('Invoice', invoiceSchema);

app.post('/api/invoices', async (req, res) => {
  const { items, total, logoPath, email } = req.body;
  const newInvoice = new Invoice({ items, total, logoPath, email });
  await newInvoice.save();
  res.status(201).send(newInvoice);
});

app.get('/api/invoices', async (req, res) => {
  const invoices = await Invoice.find();
  res.status(200).json(invoices);
});

app.post('/api/send-invoice', async (req, res) => {
  const { to, subject, text, attachmentPath } = req.body;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject,
    text,
    attachments: [{ path: attachmentPath }],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
