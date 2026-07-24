import Image from "next/image";
import { motion } from "framer-motion";
import { Clock3, Flame, Star } from "lucide-react";
import { type MenuItem } from "@/data/data";
import { formatCurrency } from "@/lib/helpers";

interface FoodCardProps {
  item: MenuItem;
  onOrder: (item: MenuItem) => void;
}

export function FoodCard({ item, onOrder }: FoodCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      className="overflow-hidden rounded-[28px] border border-white/55 bg-white/80 shadow-[0_20px_80px_-30px_rgba(0,0,0,0.35)] backdrop-blur"
    >
      <div className="relative h-48 w-full">
        <Image src={item.image} alt={item.name} fill className="object-cover"/>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7B1E3A]">{item.category}</p>
            <h3 className="text-xl font-semibold text-slate-900">{item.name}</h3>
          </div>
          <div className="rounded-full bg-[#1E3A8A]/10 px-3 py-1 text-sm font-semibold text-[#1E3A8A]">
            {formatCurrency(item.price)}
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-600">{item.description}</p>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" /> {item.preparationTime}</span>
          <span className="inline-flex items-center gap-1"><Star className="h-4 w-4" /> {item.rating.toFixed(1)}</span>
          <span className="inline-flex items-center gap-1"><Flame className="h-4 w-4" /> {item.spiceLevel}</span>
        </div>
        <button
          onClick={() => onOrder(item)}
          className="w-full rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#7B1E3A] px-4 py-3 text-sm font-semibold text-white shadow-lg"
        >
          Add to order
        </button>
      </div>
    </motion.article>
  );
}
