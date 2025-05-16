const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoicePDF = (invoice, logoPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const fileName = `invoice-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../uploads/', fileName);
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Header
    if (logoPath && fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 100 });
    }

    doc.fontSize(20).text('Invoice', 50, 120);

    doc.moveDown().fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`To: ${invoice.email || 'N/A'}`);

    doc.moveDown();
    doc.text('Items:', { underline: true });

    invoice.items.forEach(item => {
      doc
        .text(`${item.name} — ${item.quantity} x $${item.price} = $${item.quantity * item.price}`);
    });

    doc.moveDown().fontSize(14).text(`Total: $${invoice.total}`, { bold: true });

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};

module.exports = generateInvoicePDF;
