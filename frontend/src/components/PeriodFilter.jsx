import { PERIODS } from "../utils/dateFilters";

function PeriodFilter({ period, setPeriod }) {
  return (
    <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-full sm:w-fit overflow-x-auto">
      {PERIODS.map(p => (
        <button
          key={p.id}
          onClick={() => setPeriod(p.id)}
          className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
            period === p.id
              ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

export default PeriodFilter;
