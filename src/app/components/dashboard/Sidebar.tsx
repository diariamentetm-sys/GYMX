import { motion } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Settings,
  LogOut,
  Dumbbell
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getNameInitials, getStaffRoleLabel } from "../../services/staffService";

interface NavItem {
  icon: any;
  label: string;
  path: string;
  active?: boolean;
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { staffProfile, signOut } = useAuth();
  const staffName = staffProfile?.fullName ?? "Equipe GYMX";
  const staffRole = staffProfile ? getStaffRoleLabel(staffProfile.role) : "Equipe";

  const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Alunos", path: "/dashboard/alunos" },
    { icon: ClipboardCheck, label: "Check-ins", path: "/dashboard/checkins" },
    { icon: Dumbbell, label: "Treinos", path: "/dashboard/treinos" },
    { icon: Settings, label: "Configurações", path: "/dashboard/config" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/acesso-equipe");
  };

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="hidden lg:flex lg:flex-col lg:w-64 bg-neutral-900 border-r border-neutral-800 h-screen fixed left-0 top-0"
    >
      {/* Logo e Título */}
      <div className="p-6 border-b border-neutral-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-yellow-400 rounded flex items-center justify-center">
            <Dumbbell className="text-yellow-900" size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-black text-white tracking-tight">
              GYMX
            </h1>
          </div>
        </div>
        <p className="text-neutral-500 text-xs uppercase tracking-wider font-semibold">
          Administração de alunos
        </p>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          // Dashboard fica ativo apenas na rota exata
          // Outras rotas ficam ativas quando a rota atual for exata ou começar com o path
          const isActive =
            item.path === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/");

          return (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-md
                transition-all duration-300
                ${
                  isActive
                    ? "bg-yellow-400 text-yellow-900"
                    : "text-neutral-300 hover:bg-neutral-800 hover:text-yellow-400"
                }
              `}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-medium text-sm uppercase tracking-wide">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer com usuário */}
      <div className="p-4 border-t border-neutral-800">
        {/* Usuário info */}
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center">
            <span className="text-yellow-400 font-bold text-sm">
              {getNameInitials(staffName)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {staffName}
            </p>
            <p className="text-neutral-500 text-xs uppercase tracking-wider">
              {staffRole}
            </p>
          </div>
        </div>

        {/* Botão Sair */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-orange-500 transition-all"
        >
          <LogOut size={20} strokeWidth={2} />
          <span className="font-medium text-sm uppercase tracking-wide">
            Sair
          </span>
        </motion.button>
      </div>
    </motion.aside>
  );
}
