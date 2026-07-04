import { useState } from "react";
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
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-sm text-slate-400 mt-1">All your income and expenses</p>
        </div>
        <button
          onClick={() => { setEditingTransaction(null); setModalOpen(true); }}
          className="bg-violet-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-violet-700 whitespace-nowrap self-start sm:self-auto"
        >
          + Add Transaction
        </button>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              filter === cat ? "bg-violet-600 text-white border-violet-600 font-semibold" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-400 mb-4">Showing {filtered.length} of {transactions.length} transactions</p>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
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
