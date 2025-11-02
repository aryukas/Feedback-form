// lib/pdf.ts
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Product } from "./firestore";

export const generateInvoicePDF = (invoiceData: {
  clientName: string;
  clientEmail?: string;
  items: { name: string; qty: number; price: number }[];
  invoiceNumber?: string;
  date?: string;
}) => {
  const doc = new jsPDF();
  const { clientName, items, invoiceNumber = `INV-${Date.now()}`, date = new Date().toLocaleDateString() } = invoiceData;

  doc.setFontSize(18);
  doc.text("Invoice", 14, 20);
  doc.setFontSize(11);
  doc.text(`Invoice No: ${invoiceNumber}`, 14, 28);
  doc.text(`Date: ${date}`, 14, 34);
  doc.text(`Bill to: ${clientName}`, 14, 40);

  const tableBody = items.map((it) => [it.name, it.qty.toString(), it.price.toFixed(2), (it.qty * it.price).toFixed(2)]);
  (doc as any).autoTable({
    head: [["Item", "Qty", "Price", "Total"]],
    body: tableBody,
    startY: 50,
  });

  const total = items.reduce((s, it) => s + it.qty * it.price, 0);
  doc.text(`Total: ${total.toFixed(2)}`, 14, (doc as any).lastAutoTable.finalY + 10);

  return doc.output("blob"); // return blob to upload
};
