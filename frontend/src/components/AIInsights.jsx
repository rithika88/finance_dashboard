import { useState, useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { getInsights } from "../utils/api";

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
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Sparkles size={16} className="text-slate-600 dark:text-slate-300" />
          </div>
          <p className="font-semibold text-slate-900 dark:text-white">AI Insights</p>
        </div>
        <button onClick={fetchInsights} disabled={loading} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400 dark:text-slate-500">Analyzing your spending...</p>
      ) : (
        <div className="space-y-2.5">
          {points.length > 0 ? points.map((point, i) => (
            <p key={i} className="text-sm text-slate-600 dark:text-slate-300 flex gap-2">
              <span className="text-slate-400 dark:text-slate-500">•</span>
              {point.replace(/^-\s*/, "")}
            </p>
          )) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">{insight}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AIInsights;
