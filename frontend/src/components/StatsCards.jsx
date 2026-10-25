import { motion } from "framer-motion";
import { useCountUp } from "../utils/useCountUp";

function AnimatedAmount({ value, prefix = "₹" }) {
  const animated = useCountUp(value);
  return <span>{prefix}{Math.round(animated).toLocaleString()}</span>;
}

function StatsCards({ total, income, expenses, count }) {
  const savingsRate = income > 0 ? Math.round((total / income) * 100) : 0;

  const stats = [
    { label: "Net Balance", value: Math.abs(total), sub: `${savingsRate}% savings rate`, color: "var(--ink)" },
    { label: "Total Income", value: income, sub: "This period", color: "var(--forest)" },
    { label: "Total Expenses", value: Math.abs(expenses), sub: "This period", color: "var(--rust)" },
    { label: "Transactions", value: count, sub: "Total entries", color: "var(--ink-soft)", raw: true },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -2 }}
          className="surface p-5"
        >
          <p className="text-xs md:text-sm font-medium mb-2" style={{ color: "var(--ink-soft)" }}>{stat.label}</p>
          <p className="text-xl md:text-2xl font-display font-semibold mb-1 tabular" style={{ color: stat.color }}>
            {stat.raw ? <AnimatedAmount value={stat.value} prefix="" /> : <AnimatedAmount value={stat.value} />}
          </p>
          <p className="text-xs" style={{ color: "var(--ink-faint)" }}>{stat.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default StatsCards;
