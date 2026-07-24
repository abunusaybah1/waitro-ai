"use client";

import { useEffect, useMemo, useState } from "react";
import { type CartItem } from "@/hooks/useCart";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2, Sparkles, UtensilsCrossed } from "lucide-react";
import { AIAvatar } from "@/components/AIAvatar";
import { MessageBubble } from "@/components/MessageBubble";
import { OrderCard } from "@/components/OrderCard";
import { PaymentCard } from "@/components/PaymentCard";
import { Receipt } from "@/components/Receipt";
import { StatusTimeline } from "@/components/StatusTimeline";
import { TypingAnimation } from "@/components/TypingAnimation";
import { VoiceButton } from "@/components/VoiceButton";
import { restaurantInfo, type MenuItem } from "@/data/data";
import { useCart } from "@/hooks/useCart";
import { useChat } from "@/hooks/useChat";
import { useAudio } from "@/hooks/useAudio";
import { createOrderNumber, createEstimatedTime } from "@/lib/helpers";
import { buildReceipt, type ReceiptData } from "@/lib/receipt";
import { speakText, stopSpeech } from "@/lib/speech";

export default function Home() {
  const { items, addItem, removeItem, clear, total } = useCart();
  const { messages, loading, speaking, ask, stop, pushMessage } = useChat(
    async (item) => {
      addItem(item);
      setStep("browse");
    },
    () => {
      setStep("checkout");
    },
  );
  const { listening, transcript, error, start, stop: stopListening, setTranscript } = useAudio();
  const [input, setInput] = useState("");
  const [step, setStep] = useState<"browse" | "checkout" | "payment" | "status" | "receipt">("browse");
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [pendingQuantityItem, setPendingQuantityItem] = useState<CartItem | null>(null);

  const greeting = "Hello 👋 Welcome to Waitro AI. I'm your AI restaurant assistant. How may I serve you today?";

  useEffect(() => {
    speakText(greeting);
    pushMessage({ role: "assistant", content: greeting });
  }, [pushMessage]);

  useEffect(() => {
    if (!transcript) {
      return;
    }

    setInput(transcript);
    const timer = window.setTimeout(() => {
      const trimmed = transcript.trim();
      if (trimmed) {
        void handleSend(trimmed);
      }
    }, 800);

    return () => window.clearTimeout(timer);
  }, [transcript]);

  useEffect(() => {
    if (step === "status") {
      const timer = window.setInterval(() => {
        setStatusIndex((prev) => (prev + 1) % 4);
      }, 900);
      return () => window.clearInterval(timer);
    }
  }, [step]);

  const handleSend = async (value?: string) => {
    const trimmed = (value ?? input).trim();
    if (!trimmed) return;
    setInput("");
    setTranscript("");
    await ask(trimmed);
  };

  const handleOrder = async (item: MenuItem) => {
    addItem(item, 1);
    setPendingQuantityItem({ ...item, quantity: 1 });
    setStep("browse");
    await ask(`I want to order ${item.name}`);
  };

  const handleQuantityEdit = (nextQuantity: number) => {
    if (!pendingQuantityItem) {
      return;
    }

    const itemToUpdate = items.find((item) => item.id === pendingQuantityItem.id);
    if (!itemToUpdate) {
      return;
    }

    const quantityDelta = nextQuantity - itemToUpdate.quantity;
    if (quantityDelta > 0) {
      addItem(itemToUpdate, quantityDelta);
    } else if (quantityDelta < 0) {
      const removeCount = Math.abs(quantityDelta);
      for (let index = 0; index < removeCount; index += 1) {
        removeItem(itemToUpdate.id);
      }
    }

    setPendingQuantityItem({ ...itemToUpdate, quantity: nextQuantity });
  };

  const handlePay = () => {
    setPaymentSuccess(true);
    setStep("status");
    const orderNumber = createOrderNumber();
    const readyTime = createEstimatedTime(25);
    const deliveryTime = createEstimatedTime(45);
    const nextReceipt = buildReceipt({
      orderNumber,
      items: items.map((item) => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
      total: total(),
      readyTime,
      deliveryTime,
      paymentStatus: "Paid",
      createdAt: new Date().toLocaleString(),
    });
    setReceipt(nextReceipt);
    setTimeout(() => {
      setStep("receipt");
    }, 3000);
  };

  const statusSteps = useMemo(() => [
    { label: "Preparing Order", active: statusIndex >= 0 },
    { label: "Connecting To Rider", active: statusIndex >= 1 },
    { label: "Rider Assigned", active: statusIndex >= 2 },
    { label: "Estimated Arrival", active: statusIndex >= 3 },
  ], [statusIndex]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(30,58,138,0.18),_transparent_30%),linear-gradient(135deg,_#f8fbff,_#fff9fc)] text-slate-900">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-full border border-white/70 bg-white/70 px-5 py-3 shadow-lg backdrop-blur">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B1E3A]">Waitro AI</p>
            <h1 className="text-xl font-semibold">AI Restaurant Ordering Platform</h1>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-[#1E3A8A]/10 px-3 py-2 text-sm text-[#1E3A8A] sm:flex">
            <UtensilsCrossed className="h-4 w-4" /> {restaurantInfo.openingHours}
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[36px] border border-white/70 bg-white/70 p-6 shadow-[0_30px_120px_-40px_rgba(30,58,138,0.4)] backdrop-blur xl:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#1E3A8A]/10 px-3 py-1 text-sm font-semibold text-[#1E3A8A]">
                  <Sparkles className="h-4 w-4" /> Chat with your AI dining assistant
                </div>
                <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Order beautifully, effortlessly, and instantly.</h2>
                <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">Type or speak naturally, and let the assistant guide your order from menu discovery to checkout.</p>
              </div>
              <div className="flex items-center gap-3">
                <VoiceButton listening={listening} onToggle={() => (listening ? stopListening() : void start())} />
                <button onClick={() => { stop(); stopListening(); }} className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Stop audio</button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 rounded-[28px] border border-white/60 bg-gradient-to-br from-[#1E3A8A] via-[#1E3A8A] to-[#7B1E3A] p-4 text-white shadow-2xl md:grid-cols-[1fr_auto] md:p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/70">AI assistant</p>
                <p className="mt-2 text-2xl font-semibold">{speaking ? "Responding now" : "Ready to assist"}</p>
                <p className="mt-3 text-sm leading-7 text-white/80">Type a request or use the mic and the assistant will handle the rest.</p>
              </div>
              <div className="flex items-center justify-center rounded-3xl border border-white/20 bg-white/10 px-6 py-8">
                <div className="flex flex-col items-center gap-3 text-center">
                  <AIAvatar />
                  <p className="text-sm font-semibold">Gemma 4</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-slate-50/70 p-4 shadow-inner sm:flex-row">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask for a meal, an order, or recommendations"
                className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              />
              <button onClick={() => void handleSend()} className="flex items-center justify-center gap-2 rounded-full bg-[#1E3A8A] px-5 py-3 text-sm font-semibold text-white">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />} Send
              </button>
            </div>
            {error ? <p className="mt-3 rounded-2xl border border-[#7B1E3A]/20 bg-[#7B1E3A]/10 px-4 py-3 text-sm text-[#7B1E3A]">{error}</p> : null}
            {transcript ? <p className="mt-3 text-sm text-slate-500">Captured: {transcript}</p> : null}
          </motion.div>

          <motion.aside initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="rounded-[36px] border border-white/70 bg-white/70 p-6 shadow-[0_30px_120px_-40px_rgba(123,30,58,0.4)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B1E3A]">Cart</p>
                <h3 className="text-2xl font-semibold text-slate-950">Your order</h3>
              </div>
              <div className="rounded-full bg-[#1E3A8A]/10 px-3 py-1 text-sm font-semibold text-[#1E3A8A]">{items.length} items</div>
            </div>
            <div className="mt-6 space-y-3">
              {items.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">Your cart is empty. Ask the assistant for a recommendation.</div> : items.map((item) => <OrderCard key={item.id} item={item} onRemove={removeItem} />)}
            </div>
            {pendingQuantityItem ? (
              <div className="mt-4 rounded-[20px] border border-[#1E3A8A]/20 bg-[#1E3A8A]/5 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Confirm quantity</p>
                <p className="mt-1">{pendingQuantityItem.name} is currently set to {pendingQuantityItem.quantity}.</p>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => handleQuantityEdit(Math.max(1, pendingQuantityItem.quantity - 1))} className="rounded-full border border-slate-300 px-3 py-2 text-sm">-</button>
                  <span className="min-w-10 text-center font-semibold">{pendingQuantityItem.quantity}</span>
                  <button onClick={() => handleQuantityEdit(pendingQuantityItem.quantity + 1)} className="rounded-full border border-slate-300 px-3 py-2 text-sm">+</button>
                  <button onClick={() => { setPendingQuantityItem(null); setStep("checkout"); }} className="ml-2 rounded-full bg-[#1E3A8A] px-3 py-2 text-sm font-semibold text-white">Confirm</button>
                </div>
              </div>
            ) : null}
            <div className="mt-6 rounded-[24px] bg-slate-950/95 p-5 text-white">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Subtotal</span>
                <span>{total().toFixed(2)} USD</span>
              </div>
              <button onClick={() => setStep("checkout")} className="mt-4 w-full rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#7B1E3A] px-4 py-3 font-semibold text-white">Continue to checkout</button>
            </div>
          </motion.aside>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr]">
          <div className="rounded-[36px] border border-white/70 bg-white/70 p-6 shadow-[0_30px_120px_-40px_rgba(0,0,0,0.2)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B1E3A]">Conversation</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">Live AI responses</h3>
            <div className="mt-6 space-y-4 rounded-[28px] bg-slate-50/80 p-4">
              <AnimatePresence mode="popLayout">
                {messages.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">The assistant will greet you automatically on load.</div> : messages.map((message, index) => <MessageBubble key={`${message.role}-${index}`} role={message.role === "assistant" ? "assistant" : "user"} content={message.content} suggestions={message.payload?.suggestions} />)}
              </AnimatePresence>
              {loading ? <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3"><TypingAnimation /><span className="text-sm text-slate-600">Gemma 4 is thinking</span></div> : null}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {step === "checkout" ? (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur">
              <div className="w-full max-w-2xl rounded-[36px] border border-white/70 bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B1E3A]">Checkout</p>
                    <h3 className="text-2xl font-semibold text-slate-950">Almost there</h3>
                  </div>
                  <button onClick={() => setStep("browse")} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Close</button>
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                  <div className="space-y-3">
                    {items.map((item) => <OrderCard key={item.id} item={item} onRemove={removeItem} />)}
                  </div>
                  <PaymentCard onPay={handlePay} />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {step === "status" ? (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur">
              <div className="w-full max-w-2xl rounded-[36px] border border-white/70 bg-white p-6 shadow-2xl">
                <div className="text-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7B1E3A]">Order status</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950">{paymentSuccess ? "Payment confirmed." : "Processing"}</h3>
                  <p className="mt-3 text-sm text-slate-600">Connecting to rider and preparing your order.</p>
                </div>
                <div className="mt-6">
                  <StatusTimeline steps={statusSteps} />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {step === "receipt" && receipt ? (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur">
              <div className="w-full max-w-2xl rounded-[36px] border border-white/70 bg-white p-6 shadow-2xl">
                <Receipt receipt={receipt} />
                <div className="mt-6 flex justify-center">
                  <button onClick={() => { clear(); setStep("browse"); setReceipt(null); setPaymentSuccess(false); setStatusIndex(0); stopSpeech(); }} className="rounded-full bg-[#1E3A8A] px-5 py-3 text-sm font-semibold text-white">Start new order</button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
    </main>
  );
}
