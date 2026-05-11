// src/pages/Contact.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email format";
    if (!form.message.trim()) errs.message = "Message is required";
    else if (form.message.trim().length < 10) errs.message = "Must be at least 10 characters";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    }, 1200);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const inputClass = (field) =>
    `w-full px-0 py-3 bg-transparent border-b text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-700 focus:outline-none transition-colors duration-200 ${
      errors[field] ? "border-red-800" : "border-gray-300 dark:border-gray-800 focus:border-emerald-500"
    }`;

  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] text-gray-900 dark:text-gray-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display:ital@0;1&display=swap');`}</style>

      <PublicNavbar />

      {/* HERO */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16">
        <p className="text-xs tracking-widest text-emerald-500 uppercase mb-7">Contact</p>
        <h1
          className="text-[clamp(34px,5vw,52px)] font-normal leading-[1.1] tracking-tight text-gray-900 dark:text-gray-50 mb-6 max-w-lg"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Have a question? We'd love to hear from you.
        </h1>
        <p className="text-[17px] font-light text-gray-500 leading-relaxed max-w-md">
          Send us a message and we'll get back to you within 24 hours.
        </p>
      </section>

      {/* CONTACT DETAILS + FORM */}
      <section className="max-w-3xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-16">

          {/* Info */}
          <div className="flex flex-col gap-8">
            {[
              { label: "Email", value: "support@xpens.app", href: "mailto:support@xpens.app" },
              { label: "Location", value: "Kampala, Uganda" },
              { label: "Response time", value: "Within 24 hours" },
            ].map((c, i) => (
              <div key={i}>
                <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-gray-500 dark:text-gray-600 mb-1">{c.label}</p>
                {c.href ? (
                  <a href={c.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors duration-200">
                    {c.value}
                  </a>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{c.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <div className="py-8">
                <p className="text-emerald-500 text-xs tracking-widest uppercase mb-4">Sent</p>
                <p
                  className="text-[22px] font-normal text-gray-900 dark:text-gray-50 tracking-tight mb-3"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  Message received.
                </p>
                <p className="text-sm text-gray-500 mb-8">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200 underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Your name"
                    className={inputClass("name")}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-2">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="your@email.com"
                    className={inputClass("email")}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-2">{errors.email}</p>}
                </div>
                <div>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="What's on your mind?"
                    className={`${inputClass("message")} resize-none`}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-2">{errors.message}</p>}
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-7 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:-translate-y-px flex items-center gap-2"
                  >
                    {sending ? (
                      <>
                        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      "Send message"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-3xl mx-auto px-6 py-7 border-t border-gray-200 dark:border-gray-900 flex items-center justify-between flex-wrap gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-700">© {new Date().getFullYear()} Xpens</span>
        <div className="flex items-center gap-6">
          {[["Home", "/"], ["About", "/about"], ["Log in", "/login"]].map(([label, to]) => (
            <Link key={to} to={to} className="text-sm text-gray-600 hover:text-gray-400 transition-colors duration-200">
              {label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}