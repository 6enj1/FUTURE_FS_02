import { Link, useLocation, Outlet } from "react-router-dom";
import { logout, useMe } from "@/features/auth";

const nav = [
  { to: "/dashboard", label: "Overview" },
  { to: "/leads", label: "Leads" },
];

export default function Layout() {
  const location = useLocation();
  const { data: user } = useMe();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200/60">
        <div className="max-w-[1120px] mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-600 flex items-center justify-center">
                <span className="text-[11px] font-bold text-white">L</span>
              </span>
              <span className="text-sm font-semibold text-gray-900 tracking-tight">
                Leads
              </span>
            </Link>

            <nav className="flex items-center">
              {nav.map((item) => {
                const active = location.pathname === item.to ||
                  (item.to === "/leads" && location.pathname.startsWith("/leads"));
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative px-3 py-1.5 text-[13px] rounded-md transition-colors ${
                      active
                        ? "text-gray-900 font-medium bg-gray-100/60"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">{user?.email}</span>
            <button
              onClick={logout}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1120px] mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
