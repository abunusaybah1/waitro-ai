import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";

interface VoiceButtonProps {
  listening: boolean;
  onToggle: () => void;
}

export function VoiceButton({ listening, onToggle }: VoiceButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`flex h-14 w-14 items-center justify-center rounded-full border border-white/30 shadow-lg ${listening ? "bg-[#7B1E3A] text-white" : "bg-white/90 text-[#1E3A8A]"}`}
    >
      {listening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
    </motion.button>
  );
}
