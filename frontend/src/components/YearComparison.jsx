import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function YearComparison({ transactions }) {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const getYearTotals = (year) => {
    const yearTransactions = transactions.filter(t => t.date?.startsWith(String(year)));
    const income = yearTransactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const expenses = yearTransactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    return { income, expenses, count: yearTransactions.length };
  };

  const thisYearData = getYearTotals(currentYear);
  const lastYearData = getYearTotals(lastYear);

  const pctChange = (curr, prev) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  };

  const incomeChange = pctChange(thisYearData.income, lastYearData.income);
  const expenseChange = pctChange(thisYearData.expenses, lastYearData.expenses);

  const ChangeIndicator = ({ value, invertGood }) => {
    const isGood = invertGood ? value <= 0 : value >= 0;
    const Icon = value === 0 ? Minus : value > 0 ? TrendingUp : TrendingDown;
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: isGood ? "var(--forest)" : "var(--rust)" }}>
        <Icon size={12} />
        {Math.abs(value)}%
      </span>
    );
  };

  if (lastYearData.count === 0) {
    return (
      <div className="surface p-6 mb-6">
        <p className="font-semibold mb-1" style={{ color: "var(--ink)" }}>Year-over-Year Comparison</p>
        <p className="text-sm" style={{ color: "var(--ink-faint)" }}>Not enough data from {lastYear} to compare yet.</p>
      </div>
    );
  }

  return (
    <div className="surface p-6 mb-6">
      <p className="font-semibold mb-1" style={{ color: "var(--ink)" }}>Year-over-Year Comparison</p>
      <p className="text-xs mb-5" style={{ color: "var(--ink-faint)" }}>{currentYear} vs {lastYear}</p>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Income", change: incomeChange, invert: false, prev: lastYearData.income, curr: thisYearData.income },
          { label: "Expenses", change: expenseChange, invert: true, prev: lastYearData.expenses, curr: thisYearData.expenses },
        ].map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl p-4"
            style={{ border: "1px solid var(--hairline)" }}
          >
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>{row.label}</p>
              <ChangeIndicator value={row.change} invertGood={row.invert} />
            </div>
            <div className="flex justify-between items-baseline">
              <div>
                <p className="text-xs" style={{ color: "var(--ink-faint)" }}>{lastYear}</p>
                <p className="text-sm font-medium tabular" style={{ color: "var(--ink-soft)" }}>₹{row.prev.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color: "var(--ink-faint)" }}>{currentYear}</p>
                <p className="text-base font-display font-semibold tabular" style={{ color: "var(--ink)" }}>₹{row.curr.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default YearComparison;
