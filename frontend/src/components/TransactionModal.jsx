import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { CATEGORIES } from "../utils/categorize";
import { categorizeDescription, submitFeedback } from "../utils/api";

function TransactionModal({ isOpen, onClose, onSave, editingTransaction }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [suggested, setSuggested] = useState(null);
  const [shake, setShake] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.amount < 0 ? "expense" : "income");
      setAmount(Math.abs(editingTransaction.amount));
      setCategory(editingTransaction.category);
      setDescription(editingTransaction.description);
      setDate(editingTransaction.date);
    } else {
      setType("expense");
      setAmount("");
      setCategory("Food");
      setDescription("");
      setDate(new Date().toISOString().slice(0, 10));
    }
    setSuggested(null);
  }, [editingTransaction, isOpen]);

  useEffect(() => {
    if (!description || description.trim().length < 3 || type === "income") {
      setSuggested(null);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      categorizeDescription(description)
        .then(data => {
          if (data.category && CATEGORIES.includes(data.category)) {
            setSuggested(data.category);
          }
        })
        .catch(() => {});
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [description, type]);

  const applySuggestion = () => {
    setCategory(suggested);
    setSuggested(null);
  };

  const handleSave = () => {
    if (!amount || !description) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    if (type === "expense") {
      submitFeedback(description, category).catch(() => {});
    }

    onSave({
      id: editingTransaction?.id || Date.now(),
      amount: type === "expense" ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
      category,
      description,
      date,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: "rgba(20, 20, 15, 0.45)", backdropFilter: "blur(2px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="surface p-7 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: shake ? [0, -6, 6, -4, 4, 0] : 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-display font-semibold" style={{ color: "var(--ink)" }}>
                {editingTransaction ? "Edit Transaction" : "New Transaction"}
              </h2>
              <button onClick={onClose} className="icon-btn-hover p-1 rounded-md" style={{ color: "var(--ink-faint)" }}>
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-5">
              <button
                onClick={() => setType("expense")}
                className="py-2.5 rounded-lg font-medium text-sm transition-colors"
                style={type === "expense"
                  ? { background: "var(--rust)", color: "#fff" }
                  : { background: "var(--brass-tint)", color: "var(--ink-soft)" }}
              >
                Expense
              </button>
              <button
                onClick={() => setType("income")}
                className="py-2.5 rounded-lg font-medium text-sm transition-colors"
                style={type === "income"
                  ? { background: "var(--forest)", color: "#fff" }
                  : { background: "var(--brass-tint)", color: "var(--ink-soft)" }}
              >
                Income
              </button>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--ink-soft)" }}>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                className="field"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--ink-soft)" }}>Description</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. Coffee at Starbucks"
                className="field"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--ink-soft)" }}>Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="field"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <AnimatePresence>
                {suggested && suggested !== category && (
                  <motion.button
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    onClick={applySuggestion}
                    className="mt-2 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                    style={{ background: "var(--brass-tint)", color: "var(--brass-strong)" }}
                  >
                    <Sparkles size={12} />
                    AI suggests: <span className="font-semibold">{suggested}</span> — click to apply
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--ink-soft)" }}>Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="field"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ border: "1px solid var(--hairline)", color: "var(--ink-soft)" }}
              >
                Cancel
              </button>
              <motion.button
                onClick={handleSave}
                whileTap={{ scale: 0.97 }}
                className="btn-brass flex-1 py-2.5 rounded-lg text-sm font-semibold"
              >
                Save
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TransactionModal;
