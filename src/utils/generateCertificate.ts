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
    try {
      // Use bufferPages: true so pdfkit keeps ALL page content in memory
      // and flushes everything reliably on doc.end()
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50, bufferPages: true });
      const stream = new PassThrough();
      const chunks: Buffer[] = [];

      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        // Validate the buffer starts with %PDF — the magic bytes of every valid PDF
        if (buffer.length < 5 || buffer.toString('ascii', 0, 5) !== '%PDF-') {
          return reject(new Error(`Generated certificate buffer is not a valid PDF (size=${buffer.length}, header=${buffer.toString('hex', 0, 8)})`));
        }
        resolve(buffer);
      });
      stream.on('error', reject);

      doc.pipe(stream);

      const width = doc.page.width;
      const height = doc.page.height;

      // ── Background ──────────────────────────────────────────
      doc.rect(0, 0, width, height).fill('#fdfaf4');

      // ── Decorative outer border ─────────────────────────────
      doc.rect(20, 20, width - 40, height - 40)
        .lineWidth(4)
        .stroke('#c8a951');

      // ── Inner border ────────────────────────────────────────
      doc.rect(30, 30, width - 60, height - 60)
        .lineWidth(1)
        .stroke('#e0d5b7');

      // ── Corner decorations ──────────────────────────────────
      const cornerSize = 30;
      const corners = [
        { x: 35, y: 35 },
        { x: width - 35 - cornerSize, y: 35 },
        { x: 35, y: height - 35 - cornerSize },
        { x: width - 35 - cornerSize, y: height - 35 - cornerSize },
      ];
      for (const c of corners) {
        doc.rect(c.x, c.y, cornerSize, cornerSize)
          .lineWidth(1.5)
          .stroke('#c8a951');
      }

      // ── Star / logo area ────────────────────────────────────
      doc
        .font('Helvetica-Bold')
        .fontSize(18)
        .fillColor('#c8a951')
        .text('★', 0, 55, { align: 'center' });

      // ── Title ───────────────────────────────────────────────
      doc
        .font('Helvetica-Bold')
        .fontSize(36)
        .fillColor('#2c2c54')
        .text('Certificate of Completion', 0, 80, { align: 'center' });

      // ── Decorative divider ──────────────────────────────────
      const dividerY = 135;
      doc
        .moveTo(width / 2 - 180, dividerY)
        .lineTo(width / 2 - 20, dividerY)
        .lineWidth(1.5)
        .stroke('#c8a951');
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor('#c8a951')
        .text('✦', width / 2 - 6, dividerY - 5, { width: 12 });
      doc
        .moveTo(width / 2 + 20, dividerY)
        .lineTo(width / 2 + 180, dividerY)
        .lineWidth(1.5)
        .stroke('#c8a951');

      // ── "This certifies that" ───────────────────────────────
      doc
        .font('Helvetica')
        .fontSize(16)
        .fillColor('#555555')
        .text('This certifies that', 0, 155, { align: 'center' });

      // ── Recipient name ──────────────────────────────────────
      doc
        .font('Helvetica-Bold')
        .fontSize(30)
        .fillColor('#1a1a2e')
        .text(data.recipientName, 0, 190, { align: 'center' });

      // ── Underline for name ──────────────────────────────────
      const nameWidth = doc.widthOfString(data.recipientName);
      const nameX = (width - nameWidth) / 2;
      doc
        .moveTo(nameX, 226)
        .lineTo(nameX + nameWidth, 226)
        .lineWidth(1)
        .stroke('#c8a951');

      // ── "has successfully completed" ────────────────────────
      doc
        .font('Helvetica')
        .fontSize(16)
        .fillColor('#555555')
        .text('has successfully completed the course', 0, 245, { align: 'center' });

      // ── Course name ─────────────────────────────────────────
      doc
        .font('Helvetica-Bold')
        .fontSize(24)
        .fillColor('#c8a951')
        .text(data.courseName, 0, 280, { align: 'center' });

      // ── Meta info with styled badges ────────────────────────
      doc
        .font('Helvetica')
        .fontSize(11)
        .fillColor('#888888')
        .text(
          `Course ID: ${data.courseId}   |   ${data.email}   |   Date: ${data.completionDate}`,
          0, 330, { align: 'center' }
        );

      // ── "Powered by Nexora" ─────────────────────────────────
      doc
        .font('Helvetica-Bold')
        .fontSize(13)
        .fillColor('#2c2c54')
        .text('NEXORA', 0, height - 120, { align: 'center' });

      doc
        .font('Helvetica')
        .fontSize(9)
        .fillColor('#aaaaaa')
        .text('Learning Management Platform', 0, height - 105, { align: 'center' });

      // ── Signature line (left) ───────────────────────────────
      doc
        .moveTo(width / 2 - 220, height - 80)
        .lineTo(width / 2 - 60, height - 80)
        .lineWidth(1)
        .stroke('#aaaaaa');

      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#aaaaaa')
        .text('Instructor Signature', width / 2 - 220, height - 70, { width: 160, align: 'center' });

      // ── Signature line (right) ──────────────────────────────
      doc
        .moveTo(width / 2 + 60, height - 80)
        .lineTo(width / 2 + 220, height - 80)
        .lineWidth(1)
        .stroke('#aaaaaa');

      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#aaaaaa')
        .text('Authorized Signature', width / 2 + 60, height - 70, { width: 160, align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}