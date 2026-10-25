import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Calendar, TrendingUp, PiggyBank } from "lucide-react";
import { getAnalyticsInsights } from "../utils/api";

const SECTION_META = {
  "DAILY PATTERN": { icon: Calendar, label: "Daily Pattern" },
  "MONTHLY TREND": { icon: TrendingUp, label: "Monthly Trend" },
  "REDUCE EXPENSES": { icon: PiggyBank, label: "Reduce Expenses" },
};

function parseSections(text) {
  const lines = text.split("\n").filter(l => l.trim());
  return lines.map(line => {
    const [key, ...rest] = line.split(":");
    return { key: key.trim().toUpperCase(), text: rest.join(":").trim() };
  }).filter(s => SECTION_META[s.key]);
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[0, 1, 2].map(i => (
        <div key={i} className="rounded-xl p-4" style={{ background: "var(--brass-tint)" }}>
          <div className="h-3 w-2/3 rounded animate-pulse mb-3" style={{ background: "var(--hairline)" }} />
          <div className="h-3 w-full rounded animate-pulse mb-1.5" style={{ background: "var(--hairline)" }} />
          <div className="h-3 w-4/5 rounded animate-pulse" style={{ background: "var(--hairline)" }} />
        </div>
      ))}
    </div>
  );
}

function AnalyticsInsights() {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchInsights = () => {
    setLoading(true);
    getAnalyticsInsights()
      .then(data => setInsight(data.insight))
      .catch(() => setInsight(""))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const sections = parseSections(insight);

  return (
    <div className="surface p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--brass-tint)" }}>
            <Sparkles size={16} style={{ color: "var(--brass-strong)" }} />
          </div>
          <div>
            <p className="font-semibold" style={{ color: "var(--ink)" }}>AI Spending Analysis</p>
            <p className="text-xs" style={{ color: "var(--ink-faint)" }}>Daily patterns, trends & saving tips</p>
          </div>
        </div>
        <motion.button
          onClick={fetchInsights}
          disabled={loading}
          whileTap={{ scale: 0.9 }}
          className="p-1 rounded-md"
          style={{ color: "var(--ink-faint)" }}
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="skeleton" exit={{ opacity: 0 }}>
            <Skeleton />
          </motion.div>
        ) : sections.length > 0 ? (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sections.map((s, i) => {
              const meta = SECTION_META[s.key];
              const Icon = meta.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl p-4"
                  style={{ background: "var(--brass-tint)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={15} style={{ color: "var(--brass-strong)" }} />
                    <p className="text-xs font-semibold" style={{ color: "var(--ink)" }}>{meta.label}</p>
                  </div>
                  <p className="text-sm" style={{ color: "var(--ink-soft)" }}>{s.text}</p>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <p className="text-sm" style={{ color: "var(--ink-faint)" }}>{insight || "No insights available yet."}</p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AnalyticsInsights;
