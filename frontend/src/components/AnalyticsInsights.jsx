import { useState, useEffect } from "react";
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Sparkles size={16} className="text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">AI Spending Analysis</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Daily patterns, trends & saving tips</p>
          </div>
        </div>
        <button onClick={fetchInsights} disabled={loading} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">Analyzing your spending patterns...</p>
      ) : sections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sections.map((s, i) => {
            const meta = SECTION_META[s.key];
            const Icon = meta.icon;
            return (
              <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={15} className="text-slate-500 dark:text-slate-400" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">{meta.label}</p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{s.text}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-400 dark:text-slate-500">{insight || "No insights available yet."}</p>
      )}
    </div>
  );
}

export default AnalyticsInsights;
