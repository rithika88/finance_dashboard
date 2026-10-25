import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { CATEGORY_COLORS, CATEGORY_ICON_COMPONENTS } from "../utils/categorize";
import AnalyticsInsights from "../components/AnalyticsInsights";
import YearComparison from "../components/YearComparison";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area, CartesianGrid, Legend
} from "recharts";

const tooltipStyle = { background: "var(--ink)", border: "none", borderRadius: 8, color: "var(--paper)", fontSize: 12 };

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
        <h1 className="text-xl md:text-2xl font-display font-semibold" style={{ color: "var(--ink)" }}>Analytics</h1>
        <p className="text-sm mt-1" style={{ color: "var(--ink-faint)" }}>Deeper insights into your spending</p>
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
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className="surface p-5"
          >
            <p className="text-xs md:text-sm mb-2" style={{ color: "var(--ink-soft)" }}>{item.label}</p>
            <p className="text-lg md:text-xl font-display font-semibold tabular" style={{ color: "var(--ink)" }}>{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Monthly Trend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="surface p-6 mb-6 min-w-0"
      >
        <p className="font-semibold mb-1" style={{ color: "var(--ink)" }}>Monthly Trend</p>
        <p className="text-xs mb-4" style={{ color: "var(--ink-faint)" }}>Income vs expenses over the last 6 months</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3C6E56" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3C6E56" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B5533C" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#B5533C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--hairline)" opacity={0.6} />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--ink-faint)", fontSize: 12 }} />
            <YAxis hide />
            <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} contentStyle={tooltipStyle} labelStyle={{ color: "var(--paper)" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="income" stroke="#3C6E56" fill="url(#incomeGrad)" strokeWidth={2} name="Income" animationDuration={800} />
            <Area type="monotone" dataKey="expenses" stroke="#B5533C" fill="url(#expenseGrad)" strokeWidth={2} name="Expenses" animationDuration={800} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Category comparison across months */}
      {last3Months.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="surface p-6 mb-6 min-w-0"
        >
          <p className="font-semibold mb-1" style={{ color: "var(--ink)" }}>Category Comparison</p>
          <p className="text-xs mb-4" style={{ color: "var(--ink-faint)" }}>Top categories over the last {last3Months.length} months</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--hairline)" opacity={0.6} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--ink-faint)", fontSize: 12 }} />
              <YAxis hide />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} contentStyle={tooltipStyle} labelStyle={{ color: "var(--paper)" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {top5Categories.map(cat => (
                <Bar key={cat} dataKey={cat} fill={CATEGORY_COLORS[cat] || "#a3a3a3"} radius={[4, 4, 0, 0]} animationDuration={700} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="surface p-6">
          <p className="font-semibold mb-4" style={{ color: "var(--ink)" }}>Spending Breakdown</p>
          {pieData.length === 0 && <p className="text-sm" style={{ color: "var(--ink-faint)" }}>No expenses yet</p>}
          {pieData.map((entry, i) => {
            const Icon = CATEGORY_ICON_COMPONENTS[entry.name] || Package;
            const pct = (entry.value / Math.abs(expenses)) * 100;
            return (
              <div key={i} className="mb-4">
                <div className="flex justify-between mb-1.5 text-sm">
                  <span className="flex items-center gap-1.5" style={{ color: "var(--ink-soft)" }}>
                    <Icon size={14} /> {entry.name}
                  </span>
                  <span className="font-semibold tabular" style={{ color: "var(--ink)" }}>
                    ₹{entry.value.toLocaleString()} · {Math.round(pct)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "var(--hairline)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    style={{ background: CATEGORY_COLORS[entry.name] || "#a3a3a3" }}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.06 }} className="surface p-6 min-w-0">
          <p className="font-semibold mb-4" style={{ color: "var(--ink)" }}>Spending by Day</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dayData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--ink-faint)", fontSize: 12 }} />
              <YAxis hide />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} contentStyle={tooltipStyle} labelStyle={{ color: "var(--paper)" }} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={28} animationDuration={700}>
                {dayData.map((entry, i) => <Cell key={i} fill={entry.amount === maxDay && maxDay > 0 ? "#A97C2F" : "#E4D2A8"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

export default Analytics;
