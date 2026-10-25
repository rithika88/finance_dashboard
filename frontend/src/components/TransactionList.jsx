import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Package } from "lucide-react";
import { CATEGORY_ICON_COMPONENTS, CATEGORY_COLORS } from "../utils/categorize";

function TransactionList({ transactions, onEdit, onDelete, limit }) {
  const data = limit ? transactions.slice(0, limit) : transactions;

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-sm" style={{ color: "var(--ink-faint)" }}>
        No transactions yet. Click "Add Transaction" to get started.
      </div>
    );
  }

  return (
    <div>
      <AnimatePresence initial={false}>
        {data.map((t, i) => {
          const Icon = CATEGORY_ICON_COMPONENTS[t.category] || Package;
          const chipColor = CATEGORY_COLORS[t.category] || "#a3a3a3";
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
              className="flex items-center justify-between py-3 group"
              style={{ borderBottom: "1px solid var(--hairline)" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${chipColor}22` }}
                >
                  <Icon size={18} style={{ color: chipColor }} />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: "var(--ink)" }}>{t.description}</p>
                  <p className="text-xs" style={{ color: "var(--ink-faint)" }}>{t.date} · {t.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <p className="font-semibold text-sm tabular" style={{ color: t.amount < 0 ? "var(--rust)" : "var(--forest)" }}>
                  {t.amount < 0 ? "-" : "+"}₹{Math.abs(t.amount).toLocaleString()}
                </p>
                <div className="hidden group-hover:flex gap-1">
                  <button onClick={() => onEdit(t)} className="icon-btn-hover p-1 transition-colors" style={{ color: "var(--ink-faint)" }}><Pencil size={15} /></button>
                  <button onClick={() => onDelete(t.id)} className="icon-btn-danger p-1 transition-colors" style={{ color: "var(--ink-faint)" }}><Trash2 size={15} /></button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default TransactionList;
