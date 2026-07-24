import { jsPDF } from "jspdf";

export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ReceiptData {
  orderNumber: string;
  items: ReceiptItem[];
  total: number;
  readyTime: string;
  deliveryTime: string;
  paymentStatus: string;
  createdAt: string;
}

export function buildReceipt(data: ReceiptData): ReceiptData {
  return data;
}

export function formatReceiptText(receipt: ReceiptData): string {
  return [
    `Waitro AI Receipt`,
    `Order #: ${receipt.orderNumber}`,
    `Date: ${receipt.createdAt}`,
    "",
    ...receipt.items.map((item) => `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`),
    "",
    `Total: $${receipt.total.toFixed(2)}`,
    `Estimated Ready: ${receipt.readyTime}`,
    `Estimated Delivery: ${receipt.deliveryTime}`,
    `Payment: ${receipt.paymentStatus}`,
  ].join("\n");
}

function buildPdfReceipt(receipt: ReceiptData): Blob {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const lineHeight = 18;
  let y = 40;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Waitro AI Receipt", 40, y);
  y += lineHeight * 2;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Order #: ${receipt.orderNumber}`, 40, y);
  y += lineHeight;
  doc.text(`Date: ${receipt.createdAt}`, 40, y);
  y += lineHeight * 2;

  receipt.items.forEach((item) => {
    doc.text(`${item.quantity}x ${item.name}`, 40, y);
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 360, y);
    y += lineHeight;
  });

  y += lineHeight;
  doc.setFont("helvetica", "bold");
  doc.text(`Total: $${receipt.total.toFixed(2)}`, 40, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  doc.text(`Estimated Ready: ${receipt.readyTime}`, 40, y);
  y += lineHeight;
  doc.text(`Estimated Delivery: ${receipt.deliveryTime}`, 40, y);
  y += lineHeight;
  doc.text(`Payment: ${receipt.paymentStatus}`, 40, y);

  return doc.output("blob");
}

export function downloadReceipt(receipt: ReceiptData): void {
  if (typeof window === "undefined") {
    return;
  }

  const blob = buildPdfReceipt(receipt);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `waitro-receipt-${receipt.orderNumber.toLowerCase()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function printReceipt(receipt: ReceiptData): void {
  if (typeof window === "undefined") {
    return;
  }

  const blob = buildPdfReceipt(receipt);
  const url = window.URL.createObjectURL(blob);
  const printWindow = window.open(url, "_blank", "width=800,height=900");
  if (!printWindow) {
    return;
  }

  printWindow.addEventListener("load", () => {
    printWindow.focus();
    printWindow.print();
    window.URL.revokeObjectURL(url);
  });
}
