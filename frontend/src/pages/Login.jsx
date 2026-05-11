// src/pages/Login.jsx
import { useState, useContext } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/user/login", form);
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-0 py-3 bg-transparent border-b border-gray-300 dark:border-gray-800 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-700 focus:outline-none focus:border-emerald-500 transition-colors duration-200";

  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display@0;1&display=swap');`}</style>

      {/* Minimal top bar */}
      <header className="max-w-3xl mx-auto w-full px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-sm font-medium text-gray-900 dark:text-gray-50 tracking-tight">
          Xpens
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No account?{" "}
          <Link to="/register" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200">
            Sign up
          </Link>
        </p>
      </header>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[400px] bg-white dark:bg-transparent border border-gray-200 dark:border-transparent rounded-2xl shadow-sm dark:shadow-none p-6 sm:p-8">
          <p className="text-xs tracking-widest text-emerald-500 uppercase mb-7">Welcome back</p>
          <h1
            className="text-[32px] font-normal leading-tight tracking-tight text-gray-900 dark:text-gray-50 mb-10"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Sign in to your account.
          </h1>

          {error && (
            <p className="text-xs text-red-500 mb-6 pb-4 border-b border-gray-200 dark:border-gray-900">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 px-7 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:-translate-y-px self-start"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}