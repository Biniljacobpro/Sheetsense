import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <Link to="/dashboard" className="flex items-center font-serif text-2xl font-semibold text-slate-900">
          <img
            src="/sheetsense.png"
            alt="SheetSense logo"
            className="h-auto w-36 object-contain sm:w-40"
          />
        </Link>

        {isAuthenticated && (
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <span>{user?.email}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-300 px-3 py-1 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
