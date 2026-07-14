import { motion } from "motion/react";
import { useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import { Menu, X, Dumbbell, LogOut } from "lucide-react";
import { MemberSidebar, memberNavItems } from "./MemberSidebar";
import { useAuth } from "../../contexts/AuthContext";

interface MemberLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function MemberLayout({ title, subtitle, children }: MemberLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === "/portal") {
      return location.pathname === "/portal";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <MemberSidebar />

      <div className="lg:hidden fixed top-0 left-0 right-0 bg-neutral-900 border-b border-neutral-800 z-50">
        <div className="flex items-center justify-between p-4">
          <button
            type="button"
            onClick={() => navigate("/portal")}
            className="flex items-center gap-3 text-left group"
            aria-label="Voltar ao início do portal"
          >
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center group-hover:bg-yellow-300 transition-colors">
              <Dumbbell className="text-yellow-900" size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-display text-xl font-black text-white leading-none group-hover:text-yellow-400 transition-colors">
                GYMX
              </h1>
              <p className="text-neutral-500 text-[10px] uppercase tracking-wider">
                Área do Aluno
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center text-white hover:text-yellow-400 transition-colors"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900 border-t border-neutral-800 p-4 max-h-[70vh] overflow-y-auto"
          >
            <nav className="space-y-2">
              {memberNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-md font-semibold text-sm uppercase ${
                      active
                        ? "bg-yellow-400 text-yellow-900"
                        : "text-neutral-300 hover:bg-neutral-800"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-md font-semibold text-sm uppercase text-orange-500 hover:bg-neutral-800"
              >
                <LogOut size={18} />
                Sair
              </button>
            </nav>
          </motion.div>
        )}
      </div>

      <main className="flex-1 lg:ml-64 pt-20 lg:pt-0">
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 lg:px-8 py-6">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-display text-3xl lg:text-5xl font-black uppercase text-white mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-neutral-500 text-sm">{subtitle}</p>
              )}
            </motion.div>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <div className="max-w-[1200px] mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
