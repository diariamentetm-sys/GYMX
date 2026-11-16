import { ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  X,
} from "lucide-react";
import { BrandMark } from "../BrandMark";
import { useAuth } from "../../contexts/AuthContext";
import { INTERNAL_LOGIN_PATH, INTERNAL_PATH } from "../../constants/internal";
import { getNameInitials } from "../../services/staffService";

interface InternalLayoutProps {
  children: ReactNode;
}

export function InternalLayout({ children }: InternalLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { operatorProfile, staffProfile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const operatorName =
    operatorProfile?.fullName ?? staffProfile?.fullName ?? "Operação GYMX";
  const docsActive =
    location.pathname.startsWith(INTERNAL_PATH) &&
    location.pathname !== INTERNAL_LOGIN_PATH;

  const handleLogout = async () => {
    await signOut();
    setMobileOpen(false);
    navigate(INTERNAL_LOGIN_PATH);
  };

  const NavButtons = () => (
    <>
      <button
        type="button"
        onClick={() => {
          navigate(INTERNAL_PATH);
          setMobileOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium uppercase tracking-wide transition-all duration-300 ${
          docsActive
            ? "bg-yellow-400 text-yellow-900"
            : "text-neutral-300 hover:bg-neutral-800 hover:text-yellow-400"
        }`}
      >
        <BookOpen size={20} strokeWidth={docsActive ? 2.5 : 2} />
        Documentação
      </button>
      <p className="px-4 pt-4 text-[11px] uppercase tracking-widest text-neutral-500">
        Em breve
      </p>
      {["Contratos", "Personais", "Take-rate"].map((label) => (
        <div
          key={label}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium uppercase tracking-wide text-neutral-600 cursor-not-allowed"
        >
          {label}
        </div>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-neutral-900 border-r border-neutral-800 h-screen fixed left-0 top-0">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3 mb-2 group">
            <div className="w-10 h-10 bg-yellow-400 rounded-md flex items-center justify-center">
              <Shield className="text-yellow-900" size={22} strokeWidth={2.5} />
            </div>
            <BrandMark stacked className="text-2xl" />
          </div>
          <p className="text-neutral-500 text-xs uppercase tracking-wider font-semibold">
            Controle interno
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavButtons />
        </nav>
        {staffProfile ? (
          <div className="px-4 pb-2">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-yellow-400 hover:bg-neutral-800 transition-all text-sm font-medium uppercase tracking-wide"
            >
              <LayoutDashboard size={20} />
              Painel do personal
            </button>
          </div>
        ) : null}
        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 font-bold text-sm">
                {getNameInitials(operatorName)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{operatorName}</p>
              <p className="text-neutral-500 text-xs uppercase tracking-wider">Operador</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-orange-500 transition-all text-sm font-medium uppercase tracking-wide"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 bg-neutral-900 border-b border-neutral-800 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center">
              <Shield className="text-yellow-900" size={16} />
            </div>
            <BrandMark className="text-xl" />
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="w-10 h-10 flex items-center justify-center text-white hover:text-yellow-400"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {mobileOpen ? (
          <div className="p-4 space-y-2 border-t border-neutral-800 bg-neutral-900">
            <NavButtons />
            {staffProfile ? (
              <button
                type="button"
                onClick={() => {
                  navigate("/dashboard");
                  setMobileOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-yellow-400 text-sm font-medium uppercase tracking-wide"
              >
                <LayoutDashboard size={20} />
                Painel do personal
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-orange-500 text-sm font-medium uppercase tracking-wide"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        ) : null}
      </div>

      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen">{children}</main>
    </div>
  );
}
