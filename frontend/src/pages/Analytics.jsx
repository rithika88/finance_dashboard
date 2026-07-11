import { Package } from "lucide-react";
import { CATEGORY_COLORS, CATEGORY_ICON_COMPONENTS } from "../utils/categorize";
import AnalyticsInsights from "../components/AnalyticsInsights";
import YearComparison from "../components/YearComparison";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area, CartesianGrid, Legend
} from "recharts";

const tooltipStyle = { background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#fff", fontSize: 12 };

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

  // Monthly trend: income vs expenses over last 6 months
  const monthMap = {};
  transactions.forEach(t => {
    const month = t.date?.slice(0, 7);
    if (!month) return;
    if (!monthMap[month]) monthMap[month] = { month, income: 0, expenses: 0 };
    if (t.amount > 0) monthMap[month].income += t.amount;
    else monthMap[month].expenses += Math.abs(t.amount);
  });
  const monthlyData = Object.values(monthMap)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6)
    .map(m => ({ ...m, label: new Date(m.month + "-01").toLocaleDateString("en-US", { month: "short" }) }));

  // Top 5 categories, monthly comparison for last 3 months
  const top5Categories = pieData.slice(0, 5).map(p => p.name);
  const last3Months = [...new Set(transactions.map(t => t.date?.slice(0, 7)))].filter(Boolean).sort().slice(-3);
  const categoryTrendData = last3Months.map(month => {
    const entry = { month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short" }) };
    top5Categories.forEach(cat => {
      entry[cat] = transactions
        .filter(t => t.date?.slice(0, 7) === month && t.category === cat && t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    });
    return entry;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Deeper insights into your spending</p>
      </div>

      <AnalyticsInsights />

      <YearComparison transactions={transactions} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Transactions", value: transactions.length },
          { label: "Avg Expense", value: `₹${avgExpense.toLocaleString()}` },
          { label: "Largest Expense", value: `₹${largestExpense.toLocaleString()}` },
          { label: "Categories", value: `${pieData.length} types` },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-2">{item.label}</p>
            <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly Trend */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-6 min-w-0">
        <p className="font-semibold text-slate-900 dark:text-white mb-1">Monthly Trend</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Income vs expenses over the last 6 months</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8fae8a" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8fae8a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c68787" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#c68787" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis hide />
            <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} contentStyle={tooltipStyle} labelStyle={{ color: "#fff" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="income" stroke="#8fae8a" fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
            <Area type="monotone" dataKey="expenses" stroke="#c68787" fill="url(#expenseGrad)" strokeWidth={2} name="Expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Category comparison across months */}
      {last3Months.length > 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-6 min-w-0">
          <p className="font-semibold text-slate-900 dark:text-white mb-1">Category Comparison</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Top categories over the last {last3Months.length} months</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis hide />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} contentStyle={tooltipStyle} labelStyle={{ color: "#fff" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {top5Categories.map(cat => (
                <Bar key={cat} dataKey={cat} fill={CATEGORY_COLORS[cat] || "#a3a3a3"} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
          <p className="font-semibold text-slate-900 dark:text-white mb-4">Spending Breakdown</p>
          {pieData.length === 0 && <p className="text-sm text-slate-400 dark:text-slate-500">No expenses yet</p>}
          {pieData.map((entry, i) => {
            const Icon = CATEGORY_ICON_COMPONENTS[entry.name] || Package;
            return (
              <div key={i} className="mb-4">
                <div className="flex justify-between mb-1.5 text-sm">
                  <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Icon size={14} /> {entry.name}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ₹{entry.value.toLocaleString()} · {Math.round((entry.value / Math.abs(expenses)) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(entry.value / Math.abs(expenses)) * 100}%`, background: CATEGORY_COLORS[entry.name] || "#a3a3a3" }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 min-w-0">
          <p className="font-semibold text-slate-900 dark:text-white mb-4">Spending by Day</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dayData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis hide />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} contentStyle={tooltipStyle} labelStyle={{ color: "#fff" }} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={28}>
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
