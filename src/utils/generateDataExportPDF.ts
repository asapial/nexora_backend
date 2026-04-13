import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

interface ExportData {
  exportedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
  };
  profile: Record<string, unknown> | null;
  settings: Record<string, unknown> | null;
  enrollments: Array<{
    courseTitle?: string;
    enrolledAt: Date;
    progress: number;
    completedAt: Date | null;
    paymentStatus: string;
  }>;
  certificates: Array<{
    title: string;
    issuedAt: Date;
    verifyCode: string;
    pdfUrl: string | null;
  }>;
  clusterMemberships: Array<{
    clusterName?: string;
    joinedAt: Date;
    subtype: string;
  }>;
  badges: Array<{
    milestoneName?: string;
    awardedAt: Date;
  }>;
}


export async function generateDataExportPDF(data: ExportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true });
    const stream = new PassThrough();
    const chunks: Buffer[] = [];

    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);

    doc.pipe(stream);

    const { width } = doc.page;
    const contentWidth = width - 100;

    // ── Colors ────────────────────────────────────────────
    const PRIMARY = '#0d9488';     // teal-600
    const DARK = '#1a1a2e';
    const MUTED = '#6b7280';
    const BORDER = '#e5e7eb';
    const BG_LIGHT = '#f0fdfa';

    // ── Helper: section heading ───────────────────────────
    const sectionHeading = (title: string) => {
      doc.moveDown(0.8);
      doc
        .rect(50, doc.y, contentWidth, 28)
        .fill(PRIMARY);
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#ffffff')
        .text(title, 60, doc.y - 22, { width: contentWidth - 20 });
      doc.moveDown(0.5);
    };

    // ── Helper: key-value row ─────────────────────────────
    const kvRow = (key: string, value: string) => {
      if (doc.y > 720) doc.addPage();
      const y = doc.y;
      doc
        .font('Helvetica-Bold')
        .fontSize(9.5)
        .fillColor(DARK)
        .text(key, 60, y, { width: 140, continued: false });
      doc
        .font('Helvetica')
        .fontSize(9.5)
        .fillColor(MUTED)
        .text(value || '—', 200, y, { width: contentWidth - 160 });
      doc.moveDown(0.25);
    };

    // ── Helper: divider ───────────────────────────────────
    const divider = () => {
      doc
        .moveTo(50, doc.y)
        .lineTo(width - 50, doc.y)
        .lineWidth(0.5)
        .stroke(BORDER);
      doc.moveDown(0.3);
    };

    // ═══════════════════════════════════════════════════════
    // HEADER
    // ═══════════════════════════════════════════════════════

    // Header background
    doc.rect(0, 0, width, 120).fill(DARK);

    doc
      .font('Helvetica-Bold')
      .fontSize(26)
      .fillColor('#ffffff')
      .text('NEXORA', 50, 35, { align: 'center' });

    doc
      .font('Helvetica')
      .fontSize(11)
      .fillColor('#94a3b8')
      .text('Personal Data Export Report', 50, 68, { align: 'center' });

    doc
      .fontSize(9)
      .fillColor('#64748b')
      .text(`Generated: ${new Date(data.exportedAt).toLocaleString('en-US', {
        dateStyle: 'long', timeStyle: 'short',
      })}`, 50, 88, { align: 'center' });

    doc.y = 140;

    // ═══════════════════════════════════════════════════════
    // ACCOUNT INFORMATION
    // ═══════════════════════════════════════════════════════

    sectionHeading('Account Information');
    kvRow('Name', data.user.name);
    kvRow('Email', data.user.email);
    kvRow('Role', data.user.role);
    kvRow('Account ID', data.user.id);
    kvRow('Created', new Date(data.user.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' }));

    divider();

    // ═══════════════════════════════════════════════════════
    // PROFILE
    // ═══════════════════════════════════════════════════════

    if (data.profile) {
      sectionHeading('Profile Details');
      const profileEntries = Object.entries(data.profile).filter(
        ([k]) => !['id', 'userId', 'createdAt', 'updatedAt'].includes(k)
      );
      for (const [key, value] of profileEntries) {
        if (value !== null && value !== undefined && value !== '') {
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
          const display = Array.isArray(value)
            ? value.join(', ')
            : typeof value === 'object'
              ? JSON.stringify(value)
              : String(value);
          kvRow(label, display);
        }
      }
      divider();
    }

    // ═══════════════════════════════════════════════════════
    // ENROLLMENTS
    // ═══════════════════════════════════════════════════════

    sectionHeading(`Course Enrollments (${data.enrollments.length})`);
    if (data.enrollments.length === 0) {
      doc.font('Helvetica').fontSize(9.5).fillColor(MUTED).text('No enrollments found.', 60);
    } else {
      // Table header
      const tableY = doc.y;
      doc.rect(50, tableY, contentWidth, 20).fill(BG_LIGHT);
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor(DARK);
      doc.text('Course', 60, tableY + 5, { width: 180 });
      doc.text('Progress', 240, tableY + 5, { width: 60, align: 'center' });
      doc.text('Status', 310, tableY + 5, { width: 70, align: 'center' });
      doc.text('Enrolled', 390, tableY + 5, { width: 100 });
      doc.y = tableY + 24;

      for (const e of data.enrollments) {
        if (doc.y > 720) doc.addPage();
        const rowY = doc.y;
        doc.font('Helvetica').fontSize(8.5).fillColor(DARK);
        doc.text(e.courseTitle ?? '—', 60, rowY, { width: 180 });
        doc.fillColor(PRIMARY);
        doc.text(`${Math.round(e.progress)}%`, 240, rowY, { width: 60, align: 'center' });
        doc.fillColor(MUTED);
        doc.text(e.paymentStatus, 310, rowY, { width: 70, align: 'center' });
        doc.text(new Date(e.enrolledAt).toLocaleDateString('en-US', { dateStyle: 'medium' }), 390, rowY, { width: 100 });
        doc.y = rowY + 16;
      }
    }
    divider();

    // ═══════════════════════════════════════════════════════
    // CERTIFICATES
    // ═══════════════════════════════════════════════════════

    sectionHeading(`Certificates (${data.certificates.length})`);
    if (data.certificates.length === 0) {
      doc.font('Helvetica').fontSize(9.5).fillColor(MUTED).text('No certificates issued.', 60);
    } else {
      for (const c of data.certificates) {
        if (doc.y > 720) doc.addPage();
        kvRow('Title', c.title);
        kvRow('Verify Code', c.verifyCode);
        kvRow('Issued', new Date(c.issuedAt).toLocaleDateString('en-US', { dateStyle: 'long' }));
        if (c.pdfUrl) kvRow('PDF URL', c.pdfUrl);
        doc.moveDown(0.3);
      }
    }
    divider();

    // ═══════════════════════════════════════════════════════
    // CLUSTER MEMBERSHIPS
    // ═══════════════════════════════════════════════════════

    sectionHeading(`Cluster Memberships (${data.clusterMemberships.length})`);
    if (data.clusterMemberships.length === 0) {
      doc.font('Helvetica').fontSize(9.5).fillColor(MUTED).text('No memberships.', 60);
    } else {
      for (const m of data.clusterMemberships) {
        if (doc.y > 720) doc.addPage();
        kvRow('Cluster', m.clusterName ?? '—');
        kvRow('Role', m.subtype);
        kvRow('Joined', new Date(m.joinedAt).toLocaleDateString('en-US', { dateStyle: 'medium' }));
        doc.moveDown(0.2);
      }
    }
    divider();

    // ═══════════════════════════════════════════════════════
    // BADGES
    // ═══════════════════════════════════════════════════════

    sectionHeading(`Badges & Achievements (${data.badges.length})`);
    if (data.badges.length === 0) {
      doc.font('Helvetica').fontSize(9.5).fillColor(MUTED).text('No badges earned yet.', 60);
    } else {
      for (const b of data.badges) {
        if (doc.y > 720) doc.addPage();
        kvRow('Badge', b.milestoneName ?? '—');
        kvRow('Awarded', new Date(b.awardedAt).toLocaleDateString('en-US', { dateStyle: 'medium' }));
        doc.moveDown(0.2);
      }
    }

    // ═══════════════════════════════════════════════════════
    // FOOTER (on every page)
    // ═══════════════════════════════════════════════════════

    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor('#94a3b8')
        .text(
          `Nexora Data Export — ${data.user.email} — Page ${i + 1} of ${pages.count}`,
          50,
          doc.page.height - 35,
          { width: contentWidth, align: 'center' }
        );
    }

    doc.end();
  });
}
