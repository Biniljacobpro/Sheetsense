import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

const FORBIDDEN_LOCAL_PARTS = new Set([
  "admin",
  "administrator",
  "support",
  "help",
  "contact",
  "info",
  "sales",
  "test",
]);

const FORBIDDEN_DOMAINS = new Set(["mailinator.com", "tempmail.com", "example.com", "test.com"]);

const validateEmail = (value) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return { isValid: false, message: "Email is required." };
  }

  if (trimmed !== trimmed.toLowerCase()) {
    return { isValid: false, message: "Use lowercase only for email." };
  }

  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, message: "Use format: name@company.com" };
  }

  const [localPart, domain] = trimmed.split("@");
  if (FORBIDDEN_LOCAL_PARTS.has(localPart)) {
    return { isValid: false, message: "Role-based emails like admin/support are not allowed." };
  }

  if (FORBIDDEN_DOMAINS.has(domain)) {
    return { isValid: false, message: "Use a real business or personal domain." };
  }

  const domainRoot = domain.split(".")[0] || "";
  if (domainRoot.length < 4) {
    return { isValid: false, message: "Domain name should be at least 4 characters before the dot." };
  }

  return { isValid: true, message: "Looks good." };
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const emailValidation = validateEmail(email);

    if (!emailValidation.isValid) {
      setError(emailValidation.message);
      return;
    }

    setIsLoading(true);

    try {
      const data = await login({ email: email.trim().toLowerCase(), password });
      setAuth(data);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="overflow-hidden bg-white">
        <div className="grid min-h-screen lg:grid-cols-[1.02fr_1fr]">
          <aside className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-cyan-700 to-sky-700 p-8 text-white sm:p-10">
            <div className="absolute -left-12 top-24 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-10 right-10 h-36 w-36 rounded-full bg-cyan-200/20 blur-2xl" />

            <img
              src="/sheetsense.png"
              alt="SheetSense logo"
              className="relative h-auto w-40 object-contain sm:w-48"
            />

            <div className="relative mt-8 max-w-md">
              <h2 className="font-serif text-4xl font-semibold leading-tight text-white">
                Make data stories from every sheet
              </h2>
              <p className="mt-4 text-sm text-cyan-100 sm:text-base">
                Upload Excel or CSV files, generate dynamic charts, and export clean PDF reports in minutes.
              </p>
            </div>

            <div className="relative mt-8 grid gap-3 text-sm">
              <div className="rounded-xl border border-white/25 bg-white/10 px-4 py-3">
                Fast upload parsing with automatic cleanup
              </div>
              <div className="rounded-xl border border-white/25 bg-white/10 px-4 py-3">
                Interactive chart view with filters
              </div>
              <div className="rounded-xl border border-white/25 bg-white/10 px-4 py-3">
                One-click downloadable PDF insights
              </div>
            </div>
          </aside>

          <section className="flex items-center justify-center bg-slate-50 p-8 sm:p-10">
            <div className="w-full max-w-md">
              <h1 className="font-serif text-4xl text-slate-900">Welcome back</h1>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">Login to manage your file reports.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  required
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 102.8 2.8" />
                        <path d="M9.36 5.18A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7-1 2.24-2.84 4.14-5.15 5.32" />
                        <path d="M6.23 6.23C4.28 7.36 2.71 9.06 1 12c1.73 3.89 6 7 11 7 1.61 0 3.15-.32 4.55-.9" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-teal-600 py-3 font-medium text-white transition hover:bg-teal-700 disabled:opacity-60"
                >
                  {isLoading ? "Signing in..." : "Login"}
                </button>
              </form>

              <p className="mt-4 text-sm text-slate-600">
                New here?{" "}
                <Link to="/signup" className="font-medium text-teal-700 underline">
                  Create account
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
