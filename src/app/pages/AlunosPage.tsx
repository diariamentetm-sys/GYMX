import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Search, UserPlus, Mail, Phone, Radio } from "lucide-react";
import { useState } from "react";

interface Student {
  id: string;
  name: string;
  plan: string;
  status: "active" | "inactive";
  phone: string;
  email: string;
  lastCheckin: string;
  avatar: string;
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Maria Santos",
    plan: "Elite",
    status: "active",
    phone: "(11) 98765-4321",
    email: "maria.santos@email.com",
    lastCheckin: "Hoje às 08:30",
    avatar: "MS",
  },
  {
    id: "2",
    name: "João Silva",
    plan: "Premium",
    status: "active",
    phone: "(11) 97654-3210",
    email: "joao.silva@email.com",
    lastCheckin: "Hoje às 07:15",
    avatar: "JS",
  },
  {
    id: "3",
    name: "Ana Costa",
    plan: "Básico",
    status: "active",
    phone: "(11) 96543-2109",
    email: "ana.costa@email.com",
    lastCheckin: "Ontem às 19:45",
    avatar: "AC",
  },
  {
    id: "4",
    name: "Pedro Alves",
    plan: "Elite",
    status: "active",
    phone: "(11) 95432-1098",
    email: "pedro.alves@email.com",
    lastCheckin: "2 dias atrás",
    avatar: "PA",
  },
  {
    id: "5",
    name: "Carla Souza",
    plan: "Premium",
    status: "active",
    phone: "(11) 94321-0987",
    email: "carla.souza@email.com",
    lastCheckin: "3 dias atrás",
    avatar: "CS",
  },
  {
    id: "6",
    name: "Carlos Mendes",
    plan: "Premium",
    status: "inactive",
    phone: "(11) 93210-9876",
    email: "carlos.mendes@email.com",
    lastCheckin: "12 dias atrás",
    avatar: "CM",
  },
  {
    id: "7",
    name: "Juliana Lima",
    plan: "Básico",
    status: "inactive",
    phone: "(11) 92109-8765",
    email: "juliana.lima@email.com",
    lastCheckin: "15 dias atrás",
    avatar: "JL",
  },
  {
    id: "8",
    name: "Roberto Dias",
    plan: "Elite",
    status: "inactive",
    phone: "(11) 91098-7654",
    email: "roberto.dias@email.com",
    lastCheckin: "18 dias atrás",
    avatar: "RD",
  },
];

export default function AlunosPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const activeCount = mockStudents.filter((s) => s.status === "active").length;
  const inactiveCount = mockStudents.filter((s) => s.status === "inactive").length;

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <Sidebar />

      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 lg:px-8 py-6">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-4xl lg:text-5xl font-black uppercase text-white mb-2">
                  ALUNOS
                </h1>
                <p className="text-neutral-500 text-sm">
                  Gerenciamento de alunos cadastrados
                </p>
              </div>
              <div className="flex items-center gap-3">
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
                <motion.button
                  onClick={() => navigate("/dashboard/alunos/novo")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-md font-bold text-sm uppercase tracking-wide transition-colors"
                >
                  <UserPlus size={18} strokeWidth={2.5} />
                  Novo Aluno
                </motion.button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-md p-4"
              >
                <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                  Total de Alunos
                </p>
                <p className="text-white font-display text-3xl font-black">
                  {mockStudents.length}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-green-500/10 to-neutral-900 border border-green-500/30 rounded-md p-4"
              >
                <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                  Ativos
                </p>
                <p className="text-green-400 font-display text-3xl font-black">
                  {activeCount}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-orange-500/10 to-neutral-900 border border-orange-500/30 rounded-md p-4"
              >
                <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                  Inativos
                </p>
                <p className="text-orange-500 font-display text-3xl font-black">
                  {inactiveCount}
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-6 lg:px-8 py-6 max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border-2 border-neutral-700 rounded-md pl-12 pr-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:border-yellow-400 focus:outline-none transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <motion.button
                onClick={() => setFilterStatus("all")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-3 rounded-md border-2 text-sm font-semibold uppercase tracking-wide transition-all ${
                  filterStatus === "all"
                    ? "bg-yellow-400 border-yellow-400 text-yellow-900"
                    : "bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-yellow-400/50"
                }`}
              >
                Todos
              </motion.button>
              <motion.button
                onClick={() => setFilterStatus("active")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-3 rounded-md border-2 text-sm font-semibold uppercase tracking-wide transition-all ${
                  filterStatus === "active"
                    ? "bg-yellow-400 border-yellow-400 text-yellow-900"
                    : "bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-yellow-400/50"
                }`}
              >
                Ativos
              </motion.button>
              <motion.button
                onClick={() => setFilterStatus("inactive")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-3 rounded-md border-2 text-sm font-semibold uppercase tracking-wide transition-all ${
                  filterStatus === "inactive"
                    ? "bg-yellow-400 border-yellow-400 text-yellow-900"
                    : "bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-yellow-400/50"
                }`}
              >
                Inativos
              </motion.button>
            </div>
          </div>

          {/* Students List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/dashboard/alunos/${student.id}`)}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-4 hover:border-yellow-400/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-900 font-bold text-lg">
                      {student.avatar}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-bold text-lg">
                        {student.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                          student.status === "active"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-orange-500/20 text-orange-500 border border-orange-500/30"
                        }`}
                      >
                        {student.status === "active" ? "Ativo" : "Inativo"}
                      </span>
                      <span className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-xs font-semibold text-neutral-300 uppercase">
                        Plano {student.plan}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <span>{student.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span>{student.email}</span>
                      </div>
                      <div className="text-neutral-600">
                        Último check-in: {student.lastCheckin}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredStudents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-neutral-500 text-lg mb-2">
                Nenhum aluno encontrado
              </p>
              <p className="text-neutral-600 text-sm">
                Tente ajustar os filtros ou buscar por outro termo
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
