import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { getInsights } from "../utils/api";

function Skeleton() {
  return (
    <div className="space-y-2.5">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="h-3.5 rounded animate-pulse"
          style={{ background: "var(--hairline)", width: `${85 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

function AIInsights() {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchInsights = () => {
    setLoading(true);
    getInsights()
      .then(data => setInsight(data.insight))
      .catch(() => setInsight("Couldn't generate insights right now. Try again later."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const points = insight.split("\n").filter(line => line.trim().startsWith("-"));

  return (
    <div className="surface p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--brass-tint)" }}>
            <Sparkles size={16} style={{ color: "var(--brass-strong)" }} />
          </div>
          <p className="font-semibold" style={{ color: "var(--ink)" }}>AI Insights</p>
        </div>
        <motion.button
          onClick={fetchInsights}
          disabled={loading}
          whileTap={{ scale: 0.9 }}
          className="p-1 rounded-md transition-colors"
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
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2.5">
            {points.length > 0 ? points.map((point, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="text-sm flex gap-2"
                style={{ color: "var(--ink-soft)" }}
              >
                <span style={{ color: "var(--brass)" }}>•</span>
                {point.replace(/^-\s*/, "")}
              </motion.p>
            )) : (
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>{insight}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AIInsights;
