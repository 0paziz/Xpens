import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";

// -------- VALIDATION HELPERS --------

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

  // Derived validation state
  const emailValid = EMAIL_REGEX.test(form.email);
  const passwordResults = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(form.password),
  }));
  const passwordStrong = passwordResults.every((r) => r.passed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Mark everything as touched so errors surface
    setTouched({ name: true, email: true, password: true });

    // Client-side guards
    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!form.email) {
      setError("Please enter your email address.");
      return;
    }
    if (!emailValid) {
      setError("Please enter a valid email address (e.g. user@example.com).");
      return;
    }
    if (!passwordStrong) {
      setError("Password does not meet the strength requirements below.");
      return;
    }

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
    if (error) setError(""); // clear top-level error as user types
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl w-96 shadow-2xl border border-white/10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">Xpens</h1>
          <p className="text-gray-400 text-sm">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* -------- NAME -------- */}
          <input
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          {/* -------- EMAIL -------- */}
          <div>
            <input
              type="email"
              className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition ${
                touched.email && !emailValid && form.email
                  ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                  : "border-white/20 focus:border-emerald-400 focus:ring-emerald-400"
              }`}
              placeholder="Email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {touched.email && form.email && !emailValid && (
              <p className="text-red-400 text-xs mt-1.5 ml-1">
                Enter a valid email (e.g. user@example.com)
              </p>
            )}
          </div>

          {/* -------- PASSWORD -------- */}
          <div>
            <input
              type="password"
              className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition ${
                touched.password && !passwordStrong && form.password
                  ? "border-amber-400 focus:border-amber-400 focus:ring-amber-400"
                  : "border-white/20 focus:border-emerald-400 focus:ring-emerald-400"
              }`}
              placeholder="Password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />

            {/* Password strength checklist — shown once user starts typing */}
            {touched.password && form.password && (
              <ul className="mt-2 ml-1 space-y-0.5">
                {passwordResults.map((rule) => (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-1.5 text-xs transition ${
                      rule.passed ? "text-emerald-400" : "text-gray-500"
                    }`}
                  >
                    <span>{rule.passed ? "✓" : "○"}</span>
                    {rule.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}