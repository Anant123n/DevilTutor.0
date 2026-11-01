import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBrain, FaChevronDown, FaRightFromBracket, FaUser } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, openAuth, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[64px] border-b border-gray-800 bg-[#0b0b12] text-white">
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-5">
        <Link to="/" className="flex min-w-0 items-center gap-2 font-bold sm:gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 shadow-lg sm:h-10 sm:w-10"><FaBrain /></span>
          <span className="truncate text-base sm:text-lg">DevilTutor <span className="hidden text-indigo-400 sm:inline">2.0</span></span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/pdf-tutor" className="hidden rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white sm:block">Ask PDF</Link>
          <Link to="/viva" className="hidden rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white sm:block">Viva</Link>
          {user ? (
            <div className="relative">
              <button onClick={() => setShowMenu((current) => !current)} className="flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-2 py-1.5 text-sm hover:border-indigo-500 sm:px-3 sm:py-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-600"><FaUser className="text-xs" /></span>
                <span className="hidden max-w-32 truncate sm:block">{user.name}</span>
                <FaChevronDown className="text-xs text-gray-400" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-700 bg-gray-900 p-2 shadow-2xl">
                  <div className="border-b border-gray-800 px-3 py-2">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-gray-400">{user.email}</p>
                  </div>
                  <button onClick={() => { logout(); setShowMenu(false); }} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10">
                    <FaRightFromBracket /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => openAuth("login")} className="whitespace-nowrap rounded-lg px-2 py-2 text-sm font-semibold text-gray-200 hover:bg-white/5 sm:px-4">Login</button>
              <button onClick={() => openAuth("signup")} className="whitespace-nowrap rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold shadow hover:bg-indigo-700 sm:px-4">Sign up</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
