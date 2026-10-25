import { useState } from "react";
import { motion } from "framer-motion";
import TransactionList from "../components/TransactionList";
import TransactionModal from "../components/TransactionModal";
import { CATEGORIES } from "../utils/categorize";
import { createTransaction, updateTransaction, deleteTransaction } from "../utils/api";

function Transactions({ transactions, setTransactions }) {
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const categories = ["All", ...CATEGORIES.filter(c => transactions.some(t => t.category === c))];
  const filtered = filter === "All" ? transactions : transactions.filter(t => t.category === filter);

  const handleSave = async (transaction) => {
    if (editingTransaction) {
      const updated = await updateTransaction(editingTransaction.id, transaction);
      setTransactions(transactions.map(t => t.id === updated.id ? updated : t));
    } else {
      const created = await createTransaction(transaction);
      setTransactions([created, ...transactions]);
    }
    setEditingTransaction(null);
  };

  const handleEdit = (t) => {
    setEditingTransaction(t);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-semibold" style={{ color: "var(--ink)" }}>Transactions</h1>
          <p className="text-sm mt-1" style={{ color: "var(--ink-faint)" }}>All your income and expenses</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => { setEditingTransaction(null); setModalOpen(true); }}
          className="btn-brass px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap self-start sm:self-auto"
        >
          + Add Transaction
        </motion.button>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {categories.map(cat => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="px-4 py-1.5 rounded-full text-sm border transition-colors"
              style={active
                ? { background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)", fontWeight: 600 }
                : { background: "var(--paper-surface)", color: "var(--ink-soft)", borderColor: "var(--hairline)" }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <p className="text-sm mb-4" style={{ color: "var(--ink-faint)" }}>Showing {filtered.length} of {transactions.length} transactions</p>

      <div className="surface p-6">
        <TransactionList transactions={filtered} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTransaction(null); }}
        onSave={handleSave}
        editingTransaction={editingTransaction}
      />
    </div>
  );
}

export default Transactions;
