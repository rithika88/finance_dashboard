import { useState } from "react";
import StatsCards from "../components/StatsCards";
import TransactionList from "../components/TransactionList";
import TransactionModal from "../components/TransactionModal";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CATEGORY_COLORS } from "../utils/categorize";

function Dashboard({ transactions, setTransactions }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);

  const categoryTotals = transactions.filter(t => t.amount < 0).reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
    return acc;
  }, {});
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  const barData = [{ name: "Income", amount: income }, { name: "Expenses", amount: Math.abs(expenses) }];

  const handleSave = (transaction) => {
    if (editingTransaction) {
      setTransactions(transactions.map(t => t.id === transaction.id ? transaction : t));
    } else {
      setTransactions([transaction, ...transactions]);
    }
    setEditingTransaction(null);
  };

  const handleEdit = (t) => {
    setEditingTransaction(t);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Good day! 👋</h1>
          <p className="text-sm text-slate-400 mt-1">{transactions.length} transactions tracked</p>
        </div>
        <button
          onClick={() => { setEditingTransaction(null); setModalOpen(true); }}
          className="bg-violet-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-violet-700 whitespace-nowrap self-start sm:self-auto"
        >
          + Add Transaction
        </button>
      </div>

      <StatsCards total={total} income={income} expenses={expenses} count={transactions.length} />

      {transactions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 min-w-0">
            <p className="font-semibold text-slate-900 mb-4">Spending by Category</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={i} fill={CATEGORY_COLORS[entry.name] || "#94a3b8"} />)}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 min-w-0">
            <p className="font-semibold text-slate-900 mb-4">Income vs Expenses</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barSize={48}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 13 }} />
                <YAxis hide />
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, i) => <Cell key={i} fill={i === 0 ? "#16a34a" : "#ef4444"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <p className="font-semibold text-slate-900 mb-4">Recent Transactions</p>
        <TransactionList transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} limit={8} />
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
