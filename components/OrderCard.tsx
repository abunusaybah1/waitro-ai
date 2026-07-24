import { X } from "lucide-react";
import { formatCurrency } from "@/lib/helpers";
import { type CartItem } from "@/hooks/useCart";

interface OrderCardProps {
  item: CartItem;
  onRemove: (id: string) => void;
}

export function OrderCard({ item, onRemove }: OrderCardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <div>
        <p className="font-semibold text-slate-900">{item.name}</p>
        <p className="text-sm text-slate-500">Qty {item.quantity}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-semibold text-[#1E3A8A]">{formatCurrency(item.price * item.quantity)}</span>
        <button onClick={() => onRemove(item.id)} className="rounded-full bg-slate-900/5 p-2 text-slate-600">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
