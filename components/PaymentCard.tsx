import { CreditCard, ShieldCheck } from "lucide-react";

interface PaymentCardProps {
  onPay: () => void;
}

export function PaymentCard({ onPay }: PaymentCardProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#1E3A8A]/10 p-3 text-[#1E3A8A]">
          <CreditCard className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Secure test checkout</h3>
          <p className="text-sm text-slate-500">No real payment is processed in this demo.</p>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <div className="flex items-center gap-2 text-[#7B1E3A]">
          <ShieldCheck className="h-4 w-4" />
          <span>Protected by Waitro AI secure gateway</span>
        </div>
      </div>
      <button onClick={onPay} className="mt-6 w-full rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#7B1E3A] px-4 py-3 font-semibold text-white">
        Confirm Test Payment
      </button>
    </div>
  );
}
