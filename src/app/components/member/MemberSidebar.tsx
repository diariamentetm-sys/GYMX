import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Home,
  Dumbbell,
  ClipboardCheck,
  CalendarDays,
  CreditCard,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { fetchMemberSubscription } from "../../services/subscriptionService";
import { SUBSCRIPTION_STATUS_LABELS } from "../../constants/subscriptions";

const navItems = [
  { icon: Home, label: "Início", path: "/portal" },
  { icon: Dumbbell, label: "Meu Treino", path: "/portal/treino" },
  { icon: ClipboardCheck, label: "Check-in", path: "/portal/check-in" },
  { icon: CalendarDays, label: "Aulas", path: "/portal/aulas" },
  { icon: CreditCard, label: "Meu Plano", path: "/portal/plano" },
  { icon: User, label: "Perfil", path: "/portal/perfil" },
];

function getInitialsFromName(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function MemberSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, session, signOut } = useAuth();
  const [planLabel, setPlanLabel] = useState("Sem plano");

  useEffect(() => {
    if (!session?.user.id) return;
    fetchMemberSubscription(session.user.id).then((sub) => {
      if (!sub) {
        setPlanLabel("Sem plano");
        return;
      }
      const name = sub.plan?.name ?? "Plano";
      const status = SUBSCRIPTION_STATUS_LABELS[sub.status];
      setPlanLabel(`${name} · ${status}`);
    });
  }, [session?.user.id]);

  const initials = profile ? getInitialsFromName(profile.fullName) : "AL";

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/portal") {
      return location.pathname === "/portal";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="hidden lg:flex lg:flex-col lg:w-64 bg-neutral-900 border-r border-neutral-800 h-screen fixed left-0 top-0"
    >
      <div className="p-6 border-b border-neutral-800">
        <button
          type="button"
          onClick={() => navigate("/portal")}
          className="w-full text-left group"
          aria-label="Voltar ao início do portal"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-400 rounded flex items-center justify-center group-hover:bg-yellow-300 transition-colors">
              <Dumbbell className="text-yellow-900" size={24} strokeWidth={2.5} />
            </div>
            <h1 className="font-display text-2xl font-black text-white tracking-tight group-hover:text-yellow-400 transition-colors">
              GYMX
            </h1>
          </div>
          <p className="text-neutral-500 text-xs uppercase tracking-wider font-semibold">
            Área do Aluno
          </p>
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 ${
                active
                  ? "bg-yellow-400 text-yellow-900"
                  : "text-neutral-300 hover:bg-neutral-800 hover:text-yellow-400"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="font-medium text-sm uppercase tracking-wide">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center">
            <span className="text-yellow-400 font-bold text-sm">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {profile?.fullName ?? profile?.email ?? "Aluno"}
            </p>
            <p className="text-neutral-500 text-xs uppercase tracking-wider truncate">
              {planLabel}
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-orange-500 transition-all"
        >
          <LogOut size={20} strokeWidth={2} />
          <span className="font-medium text-sm uppercase tracking-wide">Sair</span>
        </motion.button>
      </div>
    </motion.aside>
  );
}

export { navItems as memberNavItems };
