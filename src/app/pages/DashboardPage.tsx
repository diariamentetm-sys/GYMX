import { motion } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import { Sidebar } from "../components/dashboard/Sidebar";
import { MetricCard } from "../components/dashboard/MetricCard";
import { MemberGrowthChart } from "../components/dashboard/MemberGrowthChart";
import { RecentMembersList } from "../components/dashboard/RecentMembersList";
import { TouristAlert } from "../components/dashboard/TouristAlert";
import {
  Users,
  UserX,
  ClipboardCheck,
  TrendingUp,
  UserPlus,
  AlertTriangle,
  Menu,
  X,
  Radio,
  Eye,
  FileEdit,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { BrandMark } from "../components/BrandMark";

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoError, setDemoError] = useState("");
  const [demoLoading, setDemoLoading] = useState<"portal" | "onboarding" | null>(null);
  const { signOut, enterMemberDemo } = useAuth();

  const isPathActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const openDemo = async (mode: "portal" | "onboarding") => {
    setDemoError("");
    setDemoLoading(mode);
    const result = await enterMemberDemo(mode);
    setDemoLoading(null);
    if (result.error) {
      setDemoError(result.error);
      return;
    }
    navigate(mode === "onboarding" ? "/portal/onboarding" : "/portal");
  };

  const handleLogout = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate("/acesso-equipe");
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-neutral-900 border-b border-neutral-800 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
              <span className="text-yellow-900 font-display font-black text-lg">
                P
              </span>
            </div>
            <h1 className="font-display text-xl font-black text-white">
              <BrandMark className="text-xl" />
            </h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center text-white hover:text-yellow-400 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900 border-t border-neutral-800 p-4"
          >
            <nav className="space-y-2">
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-md font-semibold text-sm uppercase ${
                  isPathActive("/dashboard")
                    ? "bg-yellow-400 text-yellow-900"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  navigate("/dashboard/alunos");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-md font-semibold text-sm uppercase ${
                  isPathActive("/dashboard/alunos")
                    ? "bg-yellow-400 text-yellow-900"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                Alunos
              </button>
              <button
                onClick={() => {
                  navigate("/dashboard/checkins");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-md font-semibold text-sm uppercase ${
                  isPathActive("/dashboard/checkins")
                    ? "bg-yellow-400 text-yellow-900"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                Check-ins
              </button>
              <button
                onClick={() => {
                  navigate("/dashboard/treinos");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-md font-semibold text-sm uppercase ${
                  isPathActive("/dashboard/treinos")
                    ? "bg-yellow-400 text-yellow-900"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                Treinos
              </button>
              <button
                onClick={() => {
                  navigate("/dashboard/config");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-md font-semibold text-sm uppercase ${
                  isPathActive("/dashboard/config")
                    ? "bg-yellow-400 text-yellow-900"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                Configurações
              </button>
              <button
                type="button"
                onClick={() => {
                  openDemo("portal");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-md font-semibold text-sm uppercase text-yellow-400 hover:bg-neutral-800"
              >
                Ver área do aluno
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-md font-semibold text-sm uppercase text-orange-500 hover:bg-neutral-800"
              >
                Sair
              </button>
            </nav>
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-20 lg:pt-0">
        {/* Desktop Header */}
        <div className="hidden lg:block bg-neutral-900 border-b border-neutral-800 px-8 py-6">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div>
              <h1 className="font-display text-4xl lg:text-5xl font-black uppercase text-white mb-2">
                DASHBOARD
              </h1>
              <p className="text-neutral-500 text-sm">
                Visão geral dos seus alunos e da operação do estúdio
              </p>
              {demoError ? <p className="text-orange-500 text-xs mt-2">{demoError}</p> : null}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                onClick={() => openDemo("portal")}
                disabled={Boolean(demoLoading)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-md font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-60"
              >
                <Eye size={18} strokeWidth={2.5} />
                {demoLoading === "portal" ? "Abrindo..." : "Ver área do aluno"}
              </motion.button>
              <motion.button
                onClick={() => openDemo("onboarding")}
                disabled={Boolean(demoLoading)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-60"
              >
                <FileEdit size={18} strokeWidth={2.5} />
                {demoLoading === "onboarding" ? "Preparando..." : "Simular cadastro"}
              </motion.button>
              <motion.button
                onClick={() => navigate("/modo-recepcao")}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white rounded-md font-bold text-sm uppercase tracking-wide transition-colors shadow-lg shadow-orange-500/20"
            >
              <Radio size={18} strokeWidth={2.5} />
              Ativar Recepção
            </motion.button>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          {/* Mobile Page Title (keep for mobile) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 lg:hidden"
          >
            <h1 className="font-display text-4xl lg:text-5xl font-black uppercase text-white mb-2">
              DASHBOARD
            </h1>
            <p className="text-neutral-500 text-sm mb-4">
              Visão geral dos seus alunos e da operação do estúdio
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openDemo("portal")}
                className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-md font-bold uppercase text-xs"
              >
                Ver área do aluno
              </button>
              <button
                type="button"
                onClick={() => openDemo("onboarding")}
                className="px-4 py-2 bg-neutral-800 text-white rounded-md font-bold uppercase text-xs"
              >
                Simular cadastro
              </button>
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              icon={Users}
              iconColor="text-yellow-400"
              iconBg="bg-yellow-400/10"
              label="Membros Ativos"
              value="248"
              trend={{ value: "+8.2%", isPositive: true }}
              delay={0}
            />
            <MetricCard
              icon={UserX}
              iconColor="text-neutral-400"
              iconBg="bg-neutral-700/30"
              label="Membros Inativos"
              value="20"
              subtitle="7.5% do total"
              delay={0.1}
            />
            <MetricCard
              icon={ClipboardCheck}
              iconColor="text-green-400"
              iconBg="bg-green-400/10"
              label="Check-ins Hoje"
              value="87"
              trend={{ value: "+12.3%", isPositive: true }}
              delay={0.2}
            />
            <MetricCard
              icon={TrendingUp}
              iconColor="text-blue-400"
              iconBg="bg-blue-400/10"
              label="Frequência Média"
              value="3.4x"
              subtitle="por semana"
              delay={0.3}
            />
          </div>

          {/* Second Row Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <MetricCard
              icon={UserPlus}
              iconColor="text-yellow-400"
              iconBg="bg-yellow-400/10"
              label="Novos Este Mês"
              value="23"
              trend={{ value: "+15.0%", isPositive: true }}
              delay={0.4}
            />
            <MetricCard
              icon={AlertTriangle}
              iconColor="text-orange-500"
              iconBg="bg-orange-500/10"
              label="Turistas (10+ dias)"
              value="15"
              subtitle="Necessitam atenção"
              alert={true}
              delay={0.5}
            />
          </div>

          {/* Chart Section */}
          <div className="mb-8">
            <MemberGrowthChart />
          </div>

          {/* Bottom Grid - Recent Members & Tourists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentMembersList />
            <TouristAlert />
          </div>
        </div>
      </main>
    </div>
  );
}
