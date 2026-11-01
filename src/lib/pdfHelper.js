import { jsPDF } from 'jspdf';

/**
 * Generates an authentic, beautifully styled PDF document for Vivaah records.
 */
export function generateSamplePdfBlob(documentTitle, category, weddingTitle, uploadedBy) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Primary Brand Colors: Deep Plum (#241820) and Champagne Gold (#B99A72)
  const deepPlum = [36, 24, 32];
  const champagneGold = [185, 154, 114];
  const warmCharcoal = [52, 58, 53];

  // Header Background Bar
  doc.setFillColor(...deepPlum);
  doc.rect(0, 0, 210, 32, 'F');

  // Gold hairline divider
  doc.setDrawColor(...champagneGold);
  doc.setLineWidth(0.8);
  doc.line(0, 32, 210, 32);

  // Brand Name
  doc.setTextColor(245, 239, 231); // Warm Ivory
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.text('VIVAAH', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...champagneGold);
  doc.text('LUXURY WEDDING PLANNING & MANAGEMENT', 15, 25);

  // Document Classification Tag
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(245, 239, 231);
  doc.text(category.toUpperCase(), 195, 20, { align: 'right' });

  // Document Title
  doc.setTextColor(...deepPlum);
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.text(documentTitle.replace('.pdf', ''), 15, 48);

  // Metadata Box
  doc.setFillColor(250, 247, 242); // Soft cream
  doc.setDrawColor(220, 210, 200);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, 54, 180, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...warmCharcoal);
  doc.text('Wedding Project:', 20, 62);
  doc.text('Document Category:', 20, 69);
  doc.text('Issued / Uploaded By:', 20, 76);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 70, 70);
  doc.text(weddingTitle || 'Aarav & Meera — Royal Jaipur Wedding', 65, 62);
  doc.text(category, 65, 69);
  doc.text(`${uploadedBy || 'Priya Sharma (Assigned Planner)'} — ${new Date().toLocaleDateString('en-IN')}`, 65, 76);

  // Content Body based on Category
  doc.setDrawColor(...champagneGold);
  doc.setLineWidth(0.5);
  doc.line(15, 90, 195, 90);

  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...deepPlum);
  doc.text('Executive Summary & Specifications', 15, 100);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(60, 60, 60);

  if (category.includes('Agreement') || category.includes('Contract')) {
    doc.text('1. SCOPE OF SERVICES', 15, 110);
    doc.text(
      'This agreement sets forth the mutual terms and conditions governing the comprehensive execution\nof destination festivities, venue management, artisan tender coordination, and guest protocol.',
      15, 116
    );

    doc.text('2. ESCROW & SETTLEMENT SCHEDULE', 15, 132);
    doc.text(
      '• Milestone 1: Booking Advance Deposit (20%) — Reconciled upon signing\n• Milestone 2: Venue & Scenography Production Lock (40%) — Reconciled 60 days prior\n• Milestone 3: Vendor Advances Disbursement (25%) — Reconciled 20 days prior\n• Milestone 4: Final Settlement & Handover Balance (15%) — Post-reception audit',
      15, 138
    );

    doc.text('3. CONFIDENTIALITY & INTEGRITY', 15, 162);
    doc.text(
      'All commercial tenders, guest registries, and security clearances are held under non-disclosure.',
      15, 168
    );
  } else if (category.includes('Quote') || category.includes('Quotation')) {
    doc.text('1. COMMERCIAL QUOTATION SUMMARY', 15, 110);
    doc.text(
      'Presented for formal couple review and selection under the Vivaah Vendor Management Protocol.',
      15, 116
    );

    doc.text('2. DELIVERABLES & INCLUSIONS', 15, 128);
    doc.text(
      '• Dedicated Executive Chef and 35 culinary team members\n• 12 Live Cooking Counters (Awadhi, Rajputana Royal Thali, Pan-Asian Dim Sum)\n• Molecular Dessert Installation and Silver Plating\n• Butler and silver tray banquet service for 400 guests across 3 days',
      15, 134
    );

    doc.text('3. TOTAL QUOTED VALUE', 15, 158);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Agreed Contract Amount: INR 42,00,000 (Taxes Included)', 15, 166);
  } else {
    doc.text('1. OFFICIAL RECORD SPECIFICATION', 15, 110);
    doc.text(
      `Verified operational documentation filed under Vivaah Management Platform for ${weddingTitle}.\nValid for regulatory, municipal, and heritage venue authorizations.`,
      15, 116
    );
  }

  // Signatures Area
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 225, 80, 225);
  doc.line(130, 225, 190, 225);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Authorized Signatory — Vivaah Agency', 20, 230);
  doc.text('Client Representative / Couple', 130, 230);

  // Footer
  doc.setFillColor(245, 239, 231);
  doc.rect(0, 275, 210, 22, 'F');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Vivaah Luxury Wedding Planning · Jaipur · Udaipur · Mumbai · Hyderabad', 105, 283, { align: 'center' });
  doc.text(`Document Reference: ${documentTitle} · Page 1 of 1 · Encrypted and Authorized`, 105, 288, { align: 'center' });

  return doc.output('blob');
}

/**
 * Trigger immediate download of the document with proper filename.
 */
export function downloadDocumentPdf(documentTitle, category, weddingTitle, uploadedBy) {
  const blob = generateSamplePdfBlob(documentTitle, category, weddingTitle, uploadedBy);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = documentTitle.endsWith('.pdf') ? documentTitle : `${documentTitle}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Get a viewable Object URL for the PDF preview modal.
 */
export function getDocumentPreviewUrl(documentTitle, category, weddingTitle, uploadedBy) {
  const blob = generateSamplePdfBlob(documentTitle, category, weddingTitle, uploadedBy);
  return URL.createObjectURL(blob);
}

/**
 * Generates and triggers download of a comprehensive Agency Financial Report PDF.
 */
export function downloadFinancialReportPdf(financials, weddings = [], clientPayments = [], vendorPayments = []) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const deepPlum = [36, 24, 32];
  const champagneGold = [185, 154, 114];
  const warmCharcoal = [52, 58, 53];

  // Top Plum Banner
  doc.setFillColor(...deepPlum);
  doc.rect(0, 0, 210, 34, 'F');

  // Gold Line
  doc.setDrawColor(...champagneGold);
  doc.setLineWidth(1);
  doc.line(0, 34, 210, 34);

  // Logo & Title
  doc.setTextColor(245, 239, 231);
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text('VIVAAH LUXURY WEDDINGS', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...champagneGold);
  doc.text('EXECUTIVE FINANCIAL AUDIT & REVENUE STATEMENT', 15, 26);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(245, 239, 231);
  doc.text(`DATE: ${new Date().toLocaleDateString('en-IN')}`, 195, 20, { align: 'right' });
  doc.text('FISCAL YEAR: 2026-2027', 195, 26, { align: 'right' });

  // Summary Metrics Title
  doc.setTextColor(...deepPlum);
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.text('1. Executive Financial Summary', 15, 46);

  // Metrics Box
  doc.setFillColor(250, 247, 242);
  doc.setDrawColor(220, 210, 200);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, 50, 180, 52, 2, 2, 'FD');

  const pendingClient = clientPayments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);
  const pendingVendor = vendorPayments.reduce((s, v) => s + v.balance_due, 0);

  const metrics = [
    ['Total Contracted Portfolio:', `INR ${(financials.totalContractValue / 10000000).toFixed(2)} Crores`, 'Disbursed to Vendors:', `INR ${(financials.totalVendorPaid / 100000).toFixed(2)} Lakhs`],
    ['Client Collections Received:', `INR ${(financials.totalClientReceived / 100000).toFixed(2)} Lakhs`, 'Pending Vendor Payables:', `INR ${(pendingVendor / 100000).toFixed(2)} Lakhs`],
    ['Pending Client Receivables:', `INR ${(pendingClient / 100000).toFixed(2)} Lakhs`, 'Operational Overheads:', `INR ${(financials.totalExpenses / 100000).toFixed(2)} Lakhs`],
    ['Net Agency Profit:', `INR ${(financials.estimatedProfit / 100000).toFixed(2)} Lakhs`, 'Operating Profit Margin:', `${financials.operatingMargin}%`]
  ];

  doc.setFontSize(9);
  let yPos = 59;
  metrics.forEach(([col1L, col1V, col2L, col2V]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...warmCharcoal);
    doc.text(col1L, 20, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(col1V, 65, yPos);

    doc.setFont('helvetica', 'normal');
    doc.text(col2L, 110, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(col2V, 160, yPos);
    yPos += 10;
  });

  // Project Breakdown Title
  doc.setTextColor(...deepPlum);
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.text('2. Wedding Projects Register & Contract Values', 15, 116);

  // Table Header
  doc.setFillColor(...deepPlum);
  doc.rect(15, 122, 180, 8, 'F');
  doc.setTextColor(245, 239, 231);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Project / Couple', 18, 127.5);
  doc.text('Destination & Venue', 70, 127.5);
  doc.text('Tier', 125, 127.5);
  doc.text('Contract Amount', 150, 127.5);
  doc.text('Status', 185, 127.5, { align: 'right' });

  // Table Rows
  let tableY = 136;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);

  weddings.forEach((w, index) => {
    if (index % 2 === 1) {
      doc.setFillColor(248, 244, 238);
      doc.rect(15, tableY - 5, 180, 8, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.text(w.couple_names, 18, tableY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${w.venue}, ${w.destination}`.substring(0, 30), 70, tableY);
    doc.text(w.package_tier.substring(0, 15), 125, tableY);
    doc.text(`INR ${(w.contract_amount / 10000000).toFixed(2)} Cr`, 150, tableY);
    doc.text(w.status, 185, tableY, { align: 'right' });
    tableY += 9;
  });

  // Sign-off / Compliance Box
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, 235, 80, 235);
  doc.line(130, 235, 190, 235);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Authorized Finance Controller', 20, 240);
  doc.text('Managing Director — Vivaah Weddings', 130, 240);

  // Footer
  doc.setFillColor(245, 239, 231);
  doc.rect(0, 275, 210, 22, 'F');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Vivaah Luxury Wedding Planning & Event Management Pvt. Ltd.', 105, 283, { align: 'center' });
  doc.text('Confidential Internal Financial Statement · Generated for Executive Review', 105, 288, { align: 'center' });

  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Vivaah_Executive_Financial_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

