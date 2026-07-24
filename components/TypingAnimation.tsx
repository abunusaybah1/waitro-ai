import { motion } from "framer-motion";

export function TypingAnimation() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.12 }}
          className="h-2.5 w-2.5 rounded-full bg-[#1E3A8A]"
        />
      ))}
    </motion.div>
  );
}
