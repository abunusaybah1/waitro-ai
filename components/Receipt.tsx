import { Printer, Download } from "lucide-react";
import { formatCurrency } from "@/lib/helpers";
import { type ReceiptData } from "@/lib/receipt";

interface ReceiptProps {
  receipt: ReceiptData;
}

export function Receipt({ receipt }: ReceiptProps) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B1E3A]">Waitro AI</p>
          <h3 className="text-2xl font-semibold text-slate-900">Order Receipt</h3>
        </div>
        <div className="rounded-full bg-[#1E3A8A]/10 px-4 py-2 text-sm font-semibold text-[#1E3A8A]">
          #{receipt.orderNumber}
        </div>
      </div>
      <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span>Prepared by</span>
          <span className="font-semibold text-slate-900">Waitro AI Kitchen</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span>Estimated ready</span>
          <span className="font-semibold text-slate-900">{receipt.readyTime}</span>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {receipt.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b border-slate-200 pb-3 text-sm">
            <span>{item.quantity}x {item.name}</span>
            <span className="font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#1E3A8A]/10 px-4 py-3 text-sm font-semibold text-[#1E3A8A]">
        <span>Total</span>
        <span>{formatCurrency(receipt.total)}</span>
      </div>
      <div className="mt-6 flex gap-3">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
          <Printer className="h-4 w-4" /> Print
        </button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#7B1E3A] px-4 py-3 text-sm font-semibold text-white">
          <Download className="h-4 w-4" /> Download
        </button>
      </div>
    </div>
  );
}
