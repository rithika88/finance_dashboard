import { CATEGORY_COLORS, CATEGORY_ICONS } from "../utils/categorize";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

function Analytics({ transactions }) {
  const expenses = transactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  const avgExpense = Math.round(Math.abs(expenses) / (transactions.filter(t => t.amount < 0).length || 1));
  const largestExpense = transactions.length ? Math.abs(Math.min(...transactions.map(t => t.amount))) : 0;

  const categoryTotals = transactions.filter(t => t.amount < 0).reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
    return acc;
  }, {});
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayMap = {};
  dayNames.forEach(d => dayMap[d] = 0);
  transactions.filter(t => t.amount < 0).forEach(t => {
    const day = dayNames[new Date(t.date).getDay()];
    if (day) dayMap[day] += Math.abs(t.amount);
  });
  const dayData = dayNames.map(d => ({ day: d, amount: dayMap[d] }));
  const maxDay = Math.max(...dayData.map(d => d.amount));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Deeper insights into your spending</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Transactions", value: transactions.length },
          { label: "Avg Expense", value: `₹${avgExpense.toLocaleString()}` },
          { label: "Largest Expense", value: `₹${largestExpense.toLocaleString()}` },
          { label: "Categories", value: `${pieData.length} types` },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100">
            <p className="text-xs md:text-sm text-slate-500 mb-2">{item.label}</p>
            <p className="text-lg md:text-xl font-bold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <p className="font-semibold text-slate-900 mb-4">Spending Breakdown</p>
          {pieData.length === 0 && <p className="text-sm text-slate-400">No expenses yet</p>}
          {pieData.map((entry, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between mb-1.5 text-sm">
                <span className="text-slate-600 flex items-center gap-1.5">
                  {CATEGORY_ICONS[entry.name] || "📦"} {entry.name}
                </span>
                <span className="font-semibold text-slate-900">
                  ₹{entry.value.toLocaleString()} · {Math.round((entry.value / Math.abs(expenses)) * 100)}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(entry.value / Math.abs(expenses)) * 100}%`, background: CATEGORY_COLORS[entry.name] || "#94a3b8" }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 min-w-0">
          <p className="font-semibold text-slate-900 mb-4">Spending by Day</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dayData} barSize={28}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis hide />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {dayData.map((entry, i) => <Cell key={i} fill={entry.amount === maxDay && maxDay > 0 ? "#7c3aed" : "#ddd6fe"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
