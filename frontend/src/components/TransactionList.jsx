import { Pencil, Trash2, Package } from "lucide-react";
import { CATEGORY_ICON_COMPONENTS } from "../utils/categorize";

function TransactionList({ transactions, onEdit, onDelete, limit }) {
  const data = limit ? transactions.slice(0, limit) : transactions;

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
        No transactions yet. Click "Add Transaction" to get started!
      </div>
    );
  }

  return (
    <div>
      {data.map((t) => {
        const Icon = CATEGORY_ICON_COMPONENTS[t.category] || Package;
        return (
          <div key={t.id} className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-800 last:border-0 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                <Icon size={18} className="text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="font-medium text-sm text-slate-900 dark:text-white">{t.description}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{t.date} · {t.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className={`font-semibold text-sm ${t.amount < 0 ? "text-red-500" : "text-green-600 dark:text-green-400"}`}>
                {t.amount < 0 ? "-" : "+"}₹{Math.abs(t.amount).toLocaleString()}
              </p>
              <div className="hidden group-hover:flex gap-1">
                <button onClick={() => onEdit(t)} className="text-slate-400 hover:text-slate-800 p-1"><Pencil size={15} /></button>
                <button onClick={() => onDelete(t.id)} className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TransactionList;
