import { useState, useEffect } from "react";
import { CATEGORIES } from "../utils/categorize";

function TransactionModal({ isOpen, onClose, onSave, editingTransaction }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

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
  }, [editingTransaction, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!amount || !description) {
      alert("Please fill in amount and description!");
      return;
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editingTransaction ? "Edit Transaction" : "New Transaction"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none">×</button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            onClick={() => setType("expense")}
            className={`py-2.5 rounded-lg font-medium text-sm transition-colors ${type === "expense" ? "bg-red-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
          >
            Expense
          </button>
          <button
            onClick={() => setType("income")}
            className={`py-2.5 rounded-lg font-medium text-sm transition-colors ${type === "income" ? "bg-green-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
          >
            Income
          </button>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Description</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. Coffee at Starbucks"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionModal;
