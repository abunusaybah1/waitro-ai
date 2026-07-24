import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface StatusTimelineProps {
  steps: Array<{ label: string; active: boolean }>;
}

export function StatusTimeline({ steps }: StatusTimelineProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-xl">
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-3">
            <motion.div animate={{ scale: step.active ? 1.05 : 1 }} className={`flex h-10 w-10 items-center justify-center rounded-full ${step.active ? "bg-[#1E3A8A] text-white" : "bg-slate-100 text-slate-400"}`}>
              <CheckCircle2 className="h-5 w-5" />
            </motion.div>
            <div className="flex-1 border-b border-dashed border-slate-200 pb-3">
              <p className={`font-semibold ${step.active ? "text-slate-900" : "text-slate-500"}`}>{step.label}</p>
            </div>
            {index < steps.length - 1 && <div className="h-6 w-px bg-slate-200" />}
          </div>
        ))}
      </div>
    </div>
  );
}
