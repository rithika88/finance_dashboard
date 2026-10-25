import { useState } from "react";
import { motion } from "framer-motion";
import StatsCards from "../components/StatsCards";
import TransactionList from "../components/TransactionList";
import TransactionModal from "../components/TransactionModal";
import PeriodFilter from "../components/PeriodFilter";
import AIInsights from "../components/AIInsights";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CATEGORY_COLORS } from "../utils/categorize";
import { filterByPeriod } from "../utils/dateFilters";
import { createTransaction, updateTransaction, deleteTransaction } from "../utils/api";

function Dashboard({ transactions, setTransactions, user }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [period, setPeriod] = useState("month");

  const filtered = filterByPeriod(transactions, period);

  const total = filtered.reduce((sum, t) => sum + t.amount, 0);
  const income = filtered.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const expenses = filtered.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);
  const rawExpensePct = income > 0 ? (Math.abs(expenses) / income) * 100 : 0;
  const expensePct = Math.min(rawExpensePct, 100);
  const expensePctDisplay = rawExpensePct > 0 && rawExpensePct < 1 ? "<1" : Math.round(rawExpensePct);

  const categoryTotals = filtered.filter(t => t.amount < 0).reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
    return acc;
  }, {});
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-semibold" style={{ color: "var(--ink)" }}>
            {`Hi, ${user?.name?.split(" ")[0] || "there"}`}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--ink-faint)" }}>{filtered.length} transactions in this period</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => { setEditingTransaction(null); setModalOpen(true); }}
          className="btn-brass px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap self-start sm:self-auto"
        >
          + Add Transaction
        </motion.button>
      </div>

      <div className="mb-6">
        <PeriodFilter period={period} setPeriod={setPeriod} />
      </div>

      <StatsCards total={total} income={income} expenses={expenses} count={filtered.length} />

      <AIInsights />

      {filtered.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="surface p-6 min-w-0"
          >
            <p className="font-semibold mb-4" style={{ color: "var(--ink)" }}>Spending by Category</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3} animationDuration={700}>
                  {pieData.map((entry, i) => <Cell key={i} fill={CATEGORY_COLORS[entry.name] || "#a3a3a3"} />)}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} contentStyle={{ background: "var(--ink)", border: "none", borderRadius: 8, color: "var(--paper)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.16 }}
            className="surface p-6 min-w-0 flex flex-col justify-center"
          >
            <p className="font-semibold mb-6" style={{ color: "var(--ink)" }}>Expenses vs Income</p>

            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm" style={{ color: "var(--ink-soft)" }}>Spent this period</span>
              <span className="text-2xl font-display font-semibold tabular" style={{ color: "var(--ink)" }}>{expensePctDisplay}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden mb-6" style={{ background: "var(--hairline)" }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${expensePctDisplay}%` }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: expensePct > 90 ? "var(--rust)" : expensePct > 70 ? "#C89B4A" : "var(--forest)"
                }}
              />
            </div>

            <div className="flex justify-between text-sm">
              <div>
                <p className="mb-1" style={{ color: "var(--ink-faint)" }}>Income</p>
                <p className="font-semibold tabular" style={{ color: "var(--ink)" }}>₹{income.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="mb-1" style={{ color: "var(--ink-faint)" }}>Expenses</p>
                <p className="font-semibold tabular" style={{ color: "var(--ink)" }}>₹{Math.abs(expenses).toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="surface p-6">
        <p className="font-semibold mb-4" style={{ color: "var(--ink)" }}>Recent Transactions</p>
        <TransactionList transactions={filtered} onEdit={handleEdit} onDelete={handleDelete} limit={8} />
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

export default Dashboard;
