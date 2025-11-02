// lib/pdf.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Correct way to import
import type { Product } from "./firestore"; // ✅ Use type import to avoid unused-var warning

/**
 * Generates a clean, professional invoice PDF using jsPDF & jspdf-autotable.
 * @param invoiceData - Client, item, and company details.
 * @returns Blob (for saving, emailing, or previewing)
 */
export const generateInvoicePDF = (invoiceData: {
  clientName: string;
  clientEmail?: string;
  items: { name: string; qty: number; price: number }[];
  invoiceNumber?: string;
  date?: string;
  companyName?: string;
  companyAddress?: string;
  footerNote?: string;
}): Blob => {
  const {
    clientName,
    clientEmail,
    items,
    invoiceNumber = `INV-${Date.now()}`,
    date = new Date().toLocaleDateString(),
    companyName = "Your Company Name",
    companyAddress = "123 Business Street, Mumbai, India",
    footerNote = "Thank you for your business!",
  } = invoiceData;

  // ✨ Create PDF instance
  const doc = new jsPDF();

  // 🏢 Company Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(companyName, 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(companyAddress, 14, 26);

  // 🔹 Horizontal divider
  doc.setDrawColor(180);
  doc.line(14, 30, 195, 30);

  // 📄 Invoice Details
  doc.setFontSize(12);
  doc.text(`Invoice No: ${invoiceNumber}`, 14, 38);
  doc.text(`Date: ${date}`, 14, 44);

  // 👤 Client Details
  doc.text("Bill To:", 14, 54);
  doc.setFont("helvetica", "bold");
  doc.text(clientName, 30, 54);
  doc.setFont("helvetica", "normal");
  if (clientEmail) doc.text(clientEmail, 30, 60);

  // 🧾 Table with Items
  const tableBody = items.map((item) => [
    item.name,
    item.qty.toString(),
    item.price.toFixed(2),
    (item.qty * item.price).toFixed(2),
  ]);

  autoTable(doc, {
    head: [["Item", "Quantity", "Price (₹)", "Total (₹)"]],
    body: tableBody,
    startY: 70,
    theme: "grid",
    headStyles: {
      fillColor: [44, 62, 80], // Dark blue header
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: { halign: "center" },
    bodyStyles: { textColor: [0, 0, 0] },
  });

  // 💰 Calculate Total
  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const finalY = (doc as any).lastAutoTable.finalY || 90;

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(`Grand Total: ₹${total.toFixed(2)}`, 150, finalY + 10);

  // 📝 Footer
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(footerNote, 14, finalY + 25);

  // ✅ Return Blob for upload or download
  return doc.output("blob");
};
