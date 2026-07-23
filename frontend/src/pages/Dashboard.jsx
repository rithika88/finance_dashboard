import { useState } from "react";
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
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{`Hi, ${user?.name?.split(" ")[0] || "there"}`}</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{filtered.length} transactions in this period</p>
        </div>
        <button
          onClick={() => { setEditingTransaction(null); setModalOpen(true); }}
          className="bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-700 dark:hover:bg-white whitespace-nowrap self-start sm:self-auto"
        >
          + Add Transaction
        </button>
      </div>

      <div className="mb-6">
        <PeriodFilter period={period} setPeriod={setPeriod} />
      </div>

      <StatsCards total={total} income={income} expenses={expenses} count={filtered.length} />

      <AIInsights />

      {filtered.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 min-w-0">
            <p className="font-semibold text-slate-900 dark:text-white mb-4">Spending by Category</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={i} fill={CATEGORY_COLORS[entry.name] || "#a3a3a3"} />)}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 min-w-0 flex flex-col justify-center">
            <p className="font-semibold text-slate-900 dark:text-white mb-6">Expenses vs Income</p>

            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">Spent this period</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{expensePctDisplay}%</span>
            </div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${expensePctDisplay}%`,
                  background: expensePct > 90 ? "#c68787" : expensePct > 70 ? "#cbab7d" : "#8fae8a"
                }}
              />
            </div>

            <div className="flex justify-between text-sm">
              <div>
                <p className="text-slate-400 dark:text-slate-500 mb-1">Income</p>
                <p className="font-semibold text-slate-900 dark:text-white">₹{income.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 dark:text-slate-500 mb-1">Expenses</p>
                <p className="font-semibold text-slate-900 dark:text-white">₹{Math.abs(expenses).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
        <p className="font-semibold text-slate-900 dark:text-white mb-4">Recent Transactions</p>
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
