import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Sidebar } from "../components/dashboard/Sidebar";
import {
  Search,
  Download,
  Clock,
  Calendar,
  TrendingUp,
  Hash,
  Radio,
} from "lucide-react";

interface Checkin {
  id: string;
  alunoId: string;
  alunoNome: string;
  alunoAvatar: string;
  plano: string;
  statusFinanceiro: "paid" | "overdue" | "due-soon";
  data: string;
  hora: string;
  dataHora: Date;
}

type FilterType = "hoje" | "semana" | "mes";

// Mock data
const mockCheckins: Checkin[] = [
  {
    id: "1",
    alunoId: "1",
    alunoNome: "Maria Santos",
    alunoAvatar: "MS",
    plano: "PREMIUM",
    statusFinanceiro: "paid",
    data: "22/02/2026",
    hora: "08:30",
    dataHora: new Date("2026-02-22T08:30:00"),
  },
  {
    id: "2",
    alunoId: "2",
    alunoNome: "João Silva",
    alunoAvatar: "JS",
    plano: "BASIC",
    statusFinanceiro: "overdue",
    data: "22/02/2026",
    hora: "14:20",
    dataHora: new Date("2026-02-22T14:20:00"),
  },
  {
    id: "3",
    alunoId: "3",
    alunoNome: "Carlos Oliveira",
    alunoAvatar: "CO",
    plano: "PREMIUM",
    statusFinanceiro: "due-soon",
    data: "22/02/2026",
    hora: "07:15",
    dataHora: new Date("2026-02-22T07:15:00"),
  },
  {
    id: "4",
    alunoId: "1",
    alunoNome: "Maria Santos",
    alunoAvatar: "MS",
    plano: "PREMIUM",
    statusFinanceiro: "paid",
    data: "22/02/2026",
    hora: "18:45",
    dataHora: new Date("2026-02-22T18:45:00"),
  },
  {
    id: "5",
    alunoId: "4",
    alunoNome: "Ana Costa",
    alunoAvatar: "AC",
    plano: "ELITE",
    statusFinanceiro: "paid",
    data: "22/02/2026",
    hora: "19:30",
    dataHora: new Date("2026-02-22T19:30:00"),
  },
  {
    id: "6",
    alunoId: "1",
    alunoNome: "Maria Santos",
    alunoAvatar: "MS",
    plano: "PREMIUM",
    statusFinanceiro: "paid",
    data: "21/02/2026",
    hora: "08:15",
    dataHora: new Date("2026-02-21T08:15:00"),
  },
  {
    id: "7",
    alunoId: "2",
    alunoNome: "João Silva",
    alunoAvatar: "JS",
    plano: "BASIC",
    statusFinanceiro: "overdue",
    data: "21/02/2026",
    hora: "19:45",
    dataHora: new Date("2026-02-21T19:45:00"),
  },
  {
    id: "8",
    alunoId: "3",
    alunoNome: "Carlos Oliveira",
    alunoAvatar: "CO",
    plano: "PREMIUM",
    statusFinanceiro: "due-soon",
    data: "21/02/2026",
    hora: "14:30",
    dataHora: new Date("2026-02-21T14:30:00"),
  },
  {
    id: "9",
    alunoId: "4",
    alunoNome: "Ana Costa",
    alunoAvatar: "AC",
    plano: "ELITE",
    statusFinanceiro: "paid",
    data: "21/02/2026",
    hora: "10:00",
    dataHora: new Date("2026-02-21T10:00:00"),
  },
  {
    id: "10",
    alunoId: "2",
    alunoNome: "João Silva",
    alunoAvatar: "JS",
    plano: "BASIC",
    statusFinanceiro: "overdue",
    data: "20/02/2026",
    hora: "18:20",
    dataHora: new Date("2026-02-20T18:20:00"),
  },
  {
    id: "11",
    alunoId: "1",
    alunoNome: "Maria Santos",
    alunoAvatar: "MS",
    plano: "PREMIUM",
    statusFinanceiro: "paid",
    data: "20/02/2026",
    hora: "08:35",
    dataHora: new Date("2026-02-20T08:35:00"),
  },
  {
    id: "12",
    alunoId: "3",
    alunoNome: "Carlos Oliveira",
    alunoAvatar: "CO",
    plano: "PREMIUM",
    statusFinanceiro: "due-soon",
    data: "20/02/2026",
    hora: "16:50",
    dataHora: new Date("2026-02-20T16:50:00"),
  },
  {
    id: "13",
    alunoId: "1",
    alunoNome: "Maria Santos",
    alunoAvatar: "MS",
    plano: "PREMIUM",
    statusFinanceiro: "paid",
    data: "19/02/2026",
    hora: "18:00",
    dataHora: new Date("2026-02-19T18:00:00"),
  },
  {
    id: "14",
    alunoId: "4",
    alunoNome: "Ana Costa",
    alunoAvatar: "AC",
    plano: "ELITE",
    statusFinanceiro: "paid",
    data: "19/02/2026",
    hora: "11:25",
    dataHora: new Date("2026-02-19T11:25:00"),
  },
];

export default function CheckinsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("hoje");

  // Filter checkins based on search and filter type
  const filteredCheckins = mockCheckins.filter((checkin) => {
    const matchesSearch = checkin.alunoNome
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Simple filter logic (in real app, use proper date comparison)
    const today = new Date("2026-02-22");
    const checkinDate = new Date(checkin.dataHora);

    let matchesFilter = true;
    if (filterType === "hoje") {
      matchesFilter = checkin.data === "22/02/2026";
    } else if (filterType === "semana") {
      // Last 7 days
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      matchesFilter = checkinDate >= weekAgo;
    }
    // "mes" shows all for demo

    return matchesSearch && matchesFilter;
  });

  // Calculate KPIs
  const checkinsHoje = mockCheckins.filter((c) => c.data === "22/02/2026").length;
  const checkinsEstaSemana = mockCheckins.filter((c) => {
    const date = new Date(c.dataHora);
    const weekAgo = new Date("2026-02-22");
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  }).length;
  const checkinsEsteMes = mockCheckins.length;
  const horarioPico = "18:00-19:00";

  const handleExport = () => {
    alert("Exportando relatório de check-ins...");
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <Sidebar />

      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 lg:px-8 py-6">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="font-display text-4xl lg:text-5xl font-black uppercase text-white mb-2">
                  CHECK-INS
                </h1>
                <p className="text-neutral-500 text-sm">
                  Histórico e controle de frequência
                </p>
              </motion.div>

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

        {/* Content */}
        <div className="p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Check-ins Hoje */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6 hover:border-yellow-400/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-md flex items-center justify-center">
                    <Hash className="text-orange-500" size={24} strokeWidth={2.5} />
                  </div>
                  <p className="text-neutral-500 text-xs uppercase tracking-wider font-semibold">
                    Hoje
                  </p>
                </div>
                <p className="text-white font-display text-4xl font-black mb-1">
                  {checkinsHoje}
                </p>
                <p className="text-neutral-500 text-xs">Check-ins hoje</p>
              </motion.div>

              {/* Esta Semana */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6 hover:border-yellow-400/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-md flex items-center justify-center">
                    <Calendar className="text-green-500" size={24} strokeWidth={2.5} />
                  </div>
                  <p className="text-neutral-500 text-xs uppercase tracking-wider font-semibold">
                    Semana
                  </p>
                </div>
                <p className="text-white font-display text-4xl font-black mb-1">
                  {checkinsEstaSemana}
                </p>
                <p className="text-neutral-500 text-xs">Esta semana</p>
              </motion.div>

              {/* Este Mês */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6 hover:border-yellow-400/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-md flex items-center justify-center">
                    <TrendingUp className="text-purple-500" size={24} strokeWidth={2.5} />
                  </div>
                  <p className="text-neutral-500 text-xs uppercase tracking-wider font-semibold">
                    Mês
                  </p>
                </div>
                <p className="text-white font-display text-4xl font-black mb-1">
                  {checkinsEsteMes}
                </p>
                <p className="text-neutral-500 text-xs">Este mês</p>
              </motion.div>

              {/* Horário de Pico */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6 hover:border-yellow-400/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-400/10 rounded-md flex items-center justify-center">
                    <Clock className="text-yellow-400" size={24} strokeWidth={2.5} />
                  </div>
                  <p className="text-neutral-500 text-xs uppercase tracking-wider font-semibold">
                    Pico
                  </p>
                </div>
                <p className="text-white font-display text-2xl font-black mb-1">
                  {horarioPico}
                </p>
                <p className="text-neutral-500 text-xs">Horário de pico</p>
              </motion.div>
            </div>

            {/* Histórico Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6"
            >
              {/* Section Header */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                <h2 className="font-display text-2xl font-black uppercase text-white">
                  HISTÓRICO DE CHECK-INS
                </h2>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Export Button */}
                  <motion.button
                    onClick={handleExport}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-md font-bold text-sm uppercase tracking-wide transition-colors"
                  >
                    <Download size={16} strokeWidth={2.5} />
                    Baixar Relatório
                  </motion.button>

                  {/* Filter Buttons */}
                  <div className="flex gap-2">
                    {(["hoje", "semana", "mes"] as FilterType[]).map((filter) => (
                      <motion.button
                        key={filter}
                        onClick={() => setFilterType(filter)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wide transition-all ${
                          filterType === filter
                            ? "bg-yellow-400 text-yellow-900"
                            : "bg-neutral-800 text-neutral-300 border border-neutral-700 hover:border-yellow-400/50"
                        }`}
                      >
                        {filter === "hoje"
                          ? "Hoje"
                          : filter === "semana"
                          ? "Semana"
                          : "Mês"}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="mb-6 relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Buscar por nome do aluno..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-800 border-2 border-neutral-700 rounded-md pl-12 pr-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:border-yellow-400 focus:outline-none transition-all"
                />
              </div>

              {/* Checkins List */}
              <div className="space-y-3">
                {filteredCheckins.map((checkin, index) => (
                  <motion.div
                    key={checkin.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-neutral-800/50 border border-neutral-700/50 rounded-md p-4 hover:border-yellow-400/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-yellow-900 font-bold text-sm">
                          {checkin.alunoAvatar}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3 className="text-white font-bold text-base">
                            {checkin.alunoNome}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                              checkin.statusFinanceiro === "paid"
                                ? "bg-green-500/20 text-green-400"
                                : checkin.statusFinanceiro === "overdue"
                                ? "bg-orange-500/20 text-orange-500"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {checkin.statusFinanceiro === "paid"
                              ? "Em dia"
                              : checkin.statusFinanceiro === "overdue"
                              ? "Em atraso"
                              : "Vencendo"}
                          </span>
                          <span className="px-2 py-0.5 bg-neutral-700 rounded text-xs font-semibold text-neutral-300 uppercase">
                            {checkin.plano}
                          </span>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-neutral-400 text-sm font-medium">
                          {checkin.data}
                        </p>
                        <p className="text-neutral-500 text-xs">
                          {checkin.hora}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {filteredCheckins.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-neutral-500 text-lg mb-2">
                    Nenhum check-in encontrado
                  </p>
                  <p className="text-neutral-600 text-sm">
                    Tente ajustar os filtros ou o termo de busca
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
