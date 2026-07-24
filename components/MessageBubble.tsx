import { motion } from "framer-motion";
import { AIAvatar } from "@/components/AIAvatar";

interface MessageBubbleProps {
  role: "assistant" | "user";
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
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
        {content}
      </div>
    </motion.div>
  );
}
