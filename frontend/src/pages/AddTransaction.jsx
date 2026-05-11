import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import EditTransactionModal from "../components/EditTransactionModal";
import API from "../api/api";

export default function AddTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchAll = async () => {
    try {
      const t = await API.get("/transactions/");
      setTransactions(t.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAdd = async (data) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await API.post("/transactions/create", data);
      setSuccess("Transaction added successfully!");
      fetchAll();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error adding transaction:", err);
      setError("Failed to add transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const del = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchAll();
    } catch (err) {
      console.error("Error deleting transaction:", err);
      alert("Failed to delete transaction");
    }
  };

  const editOpen = (item) => {
    setSelected(item);
    setOpen(true);
  };

  const update = async (updatedData) => {
    try {
      await API.put(`/transactions/${selected._id}`, updatedData);
      setOpen(false);
      fetchAll();
    } catch (err) {
      console.error("Error updating transaction:", err);
      alert("Failed to update transaction");
    }
  };

  return (
    <Layout
      title="Add Transaction"
      subtitle="Create a new income or expense record."
    >
      {/* -------- ALERTS -------- */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-lg mb-4 text-sm">
          {success}
        </div>
      )}

      {/* -------- FORM + LIST -------- */}
      <div className="max-w-5xl">
        <TransactionForm onAdd={handleAdd} loading={loading} />

        <div className="mt-6 sm:mt-8">
          <h2 className="text-base sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">
            All Transactions
          </h2>
          <TransactionList
            data={transactions}
            onDelete={del}
            onEdit={editOpen}
          />
        </div>
      </div>

      {/* -------- EDIT MODAL -------- */}
      <EditTransactionModal
        isOpen={open}
        onClose={() => setOpen(false)}
        data={selected}
        onUpdate={update}
      />
    </Layout>
  );
}