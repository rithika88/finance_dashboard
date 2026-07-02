import { CATEGORY_ICONS } from "../utils/categorize";

function TransactionList({ transactions, onEdit, onDelete, limit }) {
  const data = limit ? transactions.slice(0, limit) : transactions;

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">
        No transactions yet. Click "Add Transaction" to get started!
      </div>
    );
  }

  return (
    <div>
      {data.map((t) => (
        <div key={t.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg">
              {CATEGORY_ICONS[t.category] || "📦"}
            </div>
            <div>
              <p className="font-medium text-sm text-slate-900">{t.description}</p>
              <p className="text-xs text-slate-400">{t.date} · {t.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className={`font-semibold text-sm ${t.amount < 0 ? "text-red-500" : "text-green-600"}`}>
              {t.amount < 0 ? "-" : "+"}₹{Math.abs(t.amount).toLocaleString()}
            </p>
            <div className="hidden group-hover:flex gap-1">
              <button onClick={() => onEdit(t)} className="text-slate-400 hover:text-violet-600 text-sm px-1.5">✏️</button>
              <button onClick={() => onDelete(t.id)} className="text-slate-400 hover:text-red-500 text-sm px-1.5">🗑️</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TransactionList;
