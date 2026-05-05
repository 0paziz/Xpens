// src/components/TransactionList.jsx
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function TransactionList({ data, onDelete, onEdit }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));

  // Reset to page 1 if data shrinks below the current page
  const safePage = Math.min(currentPage, totalPages);
  if (safePage !== currentPage) setCurrentPage(safePage);

  const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
  const pageData = data.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const goTo = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  // Build page numbers to show (max 5 visible)
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, safePage - 2);
    let end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">Transactions</h2>
        {data.length > 0 && (
          <span className="text-xs text-gray-400">
            {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, data.length)} of {data.length}
          </span>
        )}
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-lg mb-1">No transactions yet</p>
          <p className="text-sm">Add your first transaction above to get started.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {pageData.map((t) => (
              <div
                key={t._id}
                className="flex justify-between items-center border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-semibold text-gray-800">{t.category}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    {t.description && <span>{t.description}</span>}
                    {t.date && (
                      <span>• {new Date(t.date).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <span
                    className={`font-semibold ${
                      t.type === "income" ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}UGX {t.amount.toLocaleString()}
                  </span>

                  <button
                    onClick={() => onEdit(t)}
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(t._id)}
                    className="text-red-400 hover:text-red-600 text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* -------- PAGINATION CONTROLS -------- */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-5 pt-4 border-t border-gray-100">
              {/* Previous */}
              <button
                onClick={() => goTo(safePage - 1)}
                disabled={safePage === 1}
                className="px-2.5 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                aria-label="Previous page"
              >
                ‹
              </button>

              {/* Page numbers */}
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => goTo(page)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                    page === safePage
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() => goTo(safePage + 1)}
                disabled={safePage === totalPages}
                className="px-2.5 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}