// src/pages/Register.jsx
import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /\d/.test(p) },
  { label: "One special character (!@#$%...)", test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p) },
];

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const emailValid = EMAIL_REGEX.test(form.email);
  const passwordResults = PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(form.password) }));
  const passwordStrong = passwordResults.every((r) => r.passed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTouched({ name: true, email: true, password: true });

    if (!form.name.trim()) return setError("Please enter your full name.");
    if (!form.email) return setError("Please enter your email address.");
    if (!emailValid) return setError("Please enter a valid email address.");
    if (!passwordStrong) return setError("Password doesn't meet the requirements below.");

    setLoading(true);
    try {
      await API.post("/user/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setTouched({ ...touched, [field]: true });
    if (error) setError("");
  };

  const inputClass = (field) => {
    const isErr =
      (field === "email" && touched.email && form.email && !emailValid) ||
      (field === "password" && touched.password && form.password && !passwordStrong);
    return `w-full px-0 py-3 bg-transparent border-b text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-700 focus:outline-none transition-colors duration-200 ${
      isErr ? "border-red-800 focus:border-red-600" : "border-gray-300 dark:border-gray-800 focus:border-emerald-500"
    }`;
  };

  const passedCount = passwordResults.filter((r) => r.passed).length;
  const strengthLabel = passedCount <= 1 ? "Weak" : passedCount <= 3 ? "Fair" : passedCount === 4 ? "Good" : "Strong";
  const strengthColor = passedCount <= 1 ? "bg-red-800" : passedCount <= 3 ? "bg-amber-700" : passedCount === 4 ? "bg-emerald-600" : "bg-emerald-500";

  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display@0;1&display=swap');`}</style>

      {/* Minimal top bar */}
      <header className="max-w-3xl mx-auto w-full px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-sm font-medium text-gray-900 dark:text-gray-50 tracking-tight">
          Xpens
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Have an account?{" "}
          <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200">
            Sign in
          </Link>
        </p>
      </header>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[400px] bg-white dark:bg-transparent border border-gray-200 dark:border-transparent rounded-2xl shadow-sm dark:shadow-none p-6 sm:p-8">
          <p className="text-xs tracking-widest text-emerald-500 uppercase mb-7">Get started</p>
          <h1
            className="text-[32px] font-normal leading-tight tracking-tight text-gray-900 dark:text-gray-50 mb-10"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Create your account.
          </h1>

          {error && (
            <p className="text-xs text-red-500 mb-6 pb-4 border-b border-gray-200 dark:border-gray-900">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Name */}
            <div>
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={inputClass("name")}
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={inputClass("email")}
              />
              {touched.email && form.email && !emailValid && (
                <p className="text-xs text-red-500 mt-2">Enter a valid email (e.g. user@example.com)</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={inputClass("password")}
              />

              {touched.password && form.password && (
                <div className="mt-4">
                  {/* Strength bar */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strengthColor} transition-all duration-300`}
                        style={{ width: `${(passedCount / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-500 dark:text-gray-600 shrink-0">{strengthLabel}</span>
                  </div>

                  {/* Rules */}
                  <ul className="flex flex-col gap-1.5">
                    {passwordResults.map((rule) => (
                      <li
                        key={rule.label}
                        className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                          rule.passed ? "text-emerald-500" : "text-gray-400 dark:text-gray-700"
                        }`}
                      >
                        <span className="text-[10px]">{rule.passed ? "✓" : "○"}</span>
                        {rule.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 px-7 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:-translate-y-px self-start"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}