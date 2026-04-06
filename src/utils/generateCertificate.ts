import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

interface CertificateData {
  recipientName: string;
  email: string;
  courseId: string;
  courseName: string;
  completionDate: string;
}

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });
    const stream = new PassThrough();
    const chunks: Buffer[] = [];

    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);

    doc.pipe(stream);

    const { width, height } = doc.page;

    // Background
    doc.rect(0, 0, width, height).fill('#fdfaf4');

    // Border
    doc.rect(20, 20, width - 40, height - 40)
      .lineWidth(4)
      .stroke('#c8a951');

    // Title
    doc
      .font('Helvetica-Bold')
      .fontSize(36)
      .fillColor('#2c2c54')
      .text('Certificate of Completion', 0, 80, { align: 'center' });

    // Divider
    doc
      .moveTo(100, 140)
      .lineTo(width - 100, 140)
      .lineWidth(1.5)
      .stroke('#c8a951');

    // "This certifies that"
    doc
      .font('Helvetica')
      .fontSize(16)
      .fillColor('#555555')
      .text('This certifies that', 0, 160, { align: 'center' });

    // Recipient name
    doc
      .font('Helvetica-Bold')
      .fontSize(28)
      .fillColor('#1a1a2e')
      .text(data.recipientName, 0, 195, { align: 'center' });

    // "has successfully completed"
    doc
      .font('Helvetica')
      .fontSize(16)
      .fillColor('#555555')
      .text('has successfully completed the course', 0, 245, { align: 'center' });

    // Course name
    doc
      .font('Helvetica-Bold')
      .fontSize(22)
      .fillColor('#c8a951')
      .text(data.courseName, 0, 275, { align: 'center' });

    // Meta info
    doc
      .font('Helvetica')
      .fontSize(12)
      .fillColor('#888888')
      .text(`Course ID: ${data.courseId}   |   ${data.email}   |   Date: ${data.completionDate}`,
        0, 330, { align: 'center' });

    // Signature line
    doc
      .moveTo(width / 2 - 100, height - 100)
      .lineTo(width / 2 + 100, height - 100)
      .lineWidth(1)
      .stroke('#aaaaaa');

    doc
      .font('Helvetica')
      .fontSize(11)
      .fillColor('#aaaaaa')
      .text('Authorized Signature', 0, height - 85, { align: 'center' });

    doc.end();
  });
}