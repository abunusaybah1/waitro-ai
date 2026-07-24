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
