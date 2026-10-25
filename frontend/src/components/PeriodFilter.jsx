import { motion } from "framer-motion";
import { PERIODS } from "../utils/dateFilters";

function PeriodFilter({ period, setPeriod }) {
  return (
    <div className="flex gap-1 rounded-lg p-1 w-full sm:w-fit overflow-x-auto" style={{ background: "var(--brass-tint)" }}>
      {PERIODS.map(p => {
        const active = period === p.id;
        return (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className="relative px-3.5 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors"
            style={{ color: active ? "var(--ink)" : "var(--ink-soft)" }}
          >
            {active && (
              <motion.div
                layoutId="period-active-pill"
                className="absolute inset-0 rounded-md -z-10"
                style={{ background: "var(--paper-surface)", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            {p.label}
          </button>
        );
      })}
    </div>
  );
}

export default PeriodFilter;
