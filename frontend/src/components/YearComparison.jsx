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
      <span className={`inline-flex items-center gap-1 text-xs font-medium ${isGood ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
        <Icon size={12} />
        {Math.abs(value)}%
      </span>
    );
  };

  if (lastYearData.count === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-6">
        <p className="font-semibold text-slate-900 dark:text-white mb-1">Year-over-Year Comparison</p>
        <p className="text-sm text-slate-400 dark:text-slate-500">Not enough data from {lastYear} to compare yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-6">
      <p className="font-semibold text-slate-900 dark:text-white mb-1">Year-over-Year Comparison</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">{currentYear} vs {lastYear}</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">Income</p>
            <ChangeIndicator value={incomeChange} />
          </div>
          <div className="flex justify-between items-baseline">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500">{lastYear}</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">₹{lastYearData.income.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 dark:text-slate-500">{currentYear}</p>
              <p className="text-base font-bold text-slate-900 dark:text-white">₹{thisYearData.income.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">Expenses</p>
            <ChangeIndicator value={expenseChange} invertGood />
          </div>
          <div className="flex justify-between items-baseline">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500">{lastYear}</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">₹{lastYearData.expenses.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 dark:text-slate-500">{currentYear}</p>
              <p className="text-base font-bold text-slate-900 dark:text-white">₹{thisYearData.expenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YearComparison;
