function StatsCards({ total, income, expenses, count }) {
  const savingsRate = income > 0 ? Math.round((total / income) * 100) : 0;

  const stats = [
    { label: "Net Balance", value: `₹${Math.abs(total).toLocaleString()}`, sub: `${savingsRate}% savings rate`, color: "text-slate-900" },
    { label: "Total Income", value: `₹${income.toLocaleString()}`, sub: "This period", color: "text-green-600" },
    { label: "Total Expenses", value: `₹${Math.abs(expenses).toLocaleString()}`, sub: "This period", color: "text-orange-600" },
    { label: "Transactions", value: count, sub: "Total entries", color: "text-violet-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100">
          <p className="text-xs md:text-sm text-slate-500 font-medium mb-2">{stat.label}</p>
          <p className={`text-xl md:text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</p>
          <p className="text-xs text-slate-400">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
