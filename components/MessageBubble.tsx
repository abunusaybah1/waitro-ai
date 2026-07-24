import { motion } from "framer-motion";
import { AIAvatar } from "@/components/AIAvatar";
import { type MenuItem } from "@/data/data";

interface MessageBubbleProps {
  role: "assistant" | "user";
  content: string;
  suggestions?: MenuItem[];
}

export function MessageBubble({ role, content, suggestions }: MessageBubbleProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-3xl bg-[#1E3A8A] px-4 py-3 text-sm text-white shadow-lg">
          {content}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3">
      <AIAvatar />
      <div className="max-w-[85%] rounded-3xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-sm">
        <div>{content}</div>
        {suggestions && suggestions.length > 0 ? (
          <div className="mt-3 border-t border-slate-200 pt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Available meals</p>
            <ul className="mt-2 space-y-2">
              {suggestions.map((item) => (
                <li key={item.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <span>{item.name}</span>
                  <span className="font-semibold text-[#1E3A8A]">${item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
