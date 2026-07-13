import { useState, useEffect, FormEvent } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { X, Search, Hash, Mail, QrCode, Dumbbell } from "lucide-react";

type InputMode = "codigo" | "email";

export default function ModoRecepcaoPage() {
  const navigate = useNavigate();
  const [inputMode, setInputMode] = useState<InputMode>("codigo");
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle ESC key to exit
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/dashboard");
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    setIsProcessing(true);

    // Simulate check-in processing
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Check-in realizado com sucesso!\n${inputMode === "codigo" ? "Código" : "Email"}: ${inputValue}`);
      setInputValue("");
    }, 1500);
  };

  const handleSimulateQR = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      alert("QR Code simulado!\nCheck-in de João Silva realizado com sucesso.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-neutral-900/50 backdrop-blur-md border-b border-neutral-800 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
              <Dumbbell className="text-yellow-900" size={20} strokeWidth={2.5} />
            </div>
            <h1 className="font-display text-xl font-black uppercase text-white tracking-tight">
              MODO RECEPÇÃO ATIVO
            </h1>
          </div>

          <motion.button
            onClick={() => navigate("/dashboard")}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-white transition-colors"
          >
            <X size={24} strokeWidth={2} />
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* Title */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-5xl lg:text-6xl font-black uppercase text-white mb-4 tracking-tight"
            >
              APROXIME O QR CODE
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-neutral-500 text-lg"
            >
              ou digite seu código de membro / email
            </motion.p>
          </div>

          {/* QR Code Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="flex justify-center mb-8"
          >
            <div className="w-80 h-80 border-4 border-neutral-800 rounded-2xl flex items-center justify-center">
              <QrCode className="text-neutral-800" size={160} strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Toggle Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center gap-3"
            >
              <motion.button
                type="button"
                onClick={() => setInputMode("codigo")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${
                  inputMode === "codigo"
                    ? "bg-yellow-400 text-yellow-900"
                    : "bg-neutral-900 text-neutral-500 border border-neutral-800"
                }`}
              >
                <Hash size={16} strokeWidth={2.5} />
                Código
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setInputMode("email")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${
                  inputMode === "email"
                    ? "bg-yellow-400 text-yellow-900"
                    : "bg-neutral-900 text-neutral-500 border border-neutral-800"
                }`}
              >
                <Mail size={16} strokeWidth={2.5} />
                Email
              </motion.button>
            </motion.div>

            {/* Input Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600"
                size={20}
              />
              <input
                type={inputMode === "email" ? "email" : "text"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  inputMode === "codigo"
                    ? "Digite o código..."
                    : "Digite o email..."
                }
                className="w-full bg-neutral-900 border-2 border-neutral-800 rounded-xl pl-12 pr-4 py-4 text-white text-base placeholder:text-neutral-600 focus:border-yellow-400 focus:outline-none transition-all"
                disabled={isProcessing}
              />
            </motion.div>

            {/* Example Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-neutral-600 text-xs uppercase tracking-wider"
            >
              Ex: {inputMode === "codigo" ? "12345" : "aluno@email.com"}
            </motion.p>

            {/* Submit Button (hidden, triggers on Enter) */}
            <button type="submit" className="hidden">
              Submit
            </button>
          </form>

          {/* Simulate QR Button */}
          <motion.button
            type="button"
            onClick={handleSimulateQR}
            disabled={isProcessing}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: isProcessing ? 1 : 1.02 }}
            whileTap={{ scale: isProcessing ? 1 : 0.98 }}
            className="w-full mt-6 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-500 hover:text-white rounded-xl py-4 font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full"
                />
                Processando...
              </span>
            ) : (
              "SIMULAR QR CODE (DEMO)"
            )}
          </motion.button>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-neutral-900/50 backdrop-blur-md border-t border-neutral-800 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs uppercase tracking-wider text-neutral-600">
          <p>
            Scanner QR Code ativo • Validação automática • Entrada manual
            disponível
          </p>
          <p>Pressione ESC para voltar</p>
        </div>
      </motion.footer>
    </div>
  );
}
