import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { InfoCard } from "../components/InfoCard";
import {
  ArrowLeft,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  ClipboardCheck,
  Hash,
  Edit,
  MessageCircle,
  Loader,
  Radio,
} from "lucide-react";

interface Payment {
  id: string;
  date: string;
  status: "paid" | "overdue" | "pending";
  method: string;
  amount: number;
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  photo?: string | null;
  email: string;
  phone: string;
  plan: string;
  startDate: string;
  lastCheckin: string;
  totalCheckins: number;
  status: "active" | "inactive";
  financialStatus: "paid" | "overdue";
  payments: Payment[];
}

// Mock data - In a real app, fetch from API
const mockStudents: Record<string, Student> = {
  "1": {
    id: "1",
    name: "Maria Santos",
    avatar: "MS",
    photo: null,
    email: "maria.santos@email.com",
    phone: "(11) 98765-4321",
    plan: "Elite",
    startDate: "15/01/2026",
    lastCheckin: "Hoje às 08:30",
    totalCheckins: 82,
    status: "active",
    financialStatus: "paid",
    payments: [
      {
        id: "1",
        date: "10/04/2026",
        status: "paid",
        method: "PIX",
        amount: 149.9,
      },
      {
        id: "2",
        date: "10/03/2026",
        status: "paid",
        method: "Cartão de Crédito",
        amount: 149.9,
      },
      {
        id: "3",
        date: "10/02/2026",
        status: "paid",
        method: "PIX",
        amount: 149.9,
      },
    ],
  },
  "2": {
    id: "2",
    name: "João Silva",
    avatar: "JS",
    photo: null,
    email: "joao.silva@email.com",
    phone: "(11) 97654-3210",
    plan: "Premium",
    startDate: "09/03/2024",
    lastCheckin: "Hoje às 07:15",
    totalCheckins: 54,
    status: "active",
    financialStatus: "overdue",
    payments: [
      {
        id: "1",
        date: "09/02/2026",
        status: "overdue",
        method: "Boleto",
        amount: 89.9,
      },
      {
        id: "2",
        date: "09/01/2026",
        status: "paid",
        method: "PIX",
        amount: 89.9,
      },
      {
        id: "3",
        date: "09/12/2025",
        status: "paid",
        method: "PIX",
        amount: 89.9,
      },
    ],
  },
  "3": {
    id: "3",
    name: "Ana Costa",
    avatar: "AC",
    photo: null,
    email: "ana.costa@email.com",
    phone: "(11) 96543-2109",
    plan: "Básico",
    startDate: "20/02/2026",
    lastCheckin: "Ontem às 19:45",
    totalCheckins: 38,
    status: "active",
    financialStatus: "paid",
    payments: [
      {
        id: "1",
        date: "20/04/2026",
        status: "paid",
        method: "PIX",
        amount: 59.9,
      },
      {
        id: "2",
        date: "20/03/2026",
        status: "paid",
        method: "Débito",
        amount: 59.9,
      },
    ],
  },
  "4": {
    id: "4",
    name: "Pedro Alves",
    avatar: "PA",
    photo: null,
    email: "pedro.alves@email.com",
    phone: "(11) 95432-1098",
    plan: "Elite",
    startDate: "05/12/2025",
    lastCheckin: "2 dias atrás",
    totalCheckins: 95,
    status: "active",
    financialStatus: "paid",
    payments: [
      {
        id: "1",
        date: "05/04/2026",
        status: "paid",
        method: "Cartão de Crédito",
        amount: 149.9,
      },
      {
        id: "2",
        date: "05/03/2026",
        status: "paid",
        method: "Cartão de Crédito",
        amount: 149.9,
      },
    ],
  },
  "5": {
    id: "5",
    name: "Carla Souza",
    avatar: "CS",
    photo: null,
    email: "carla.souza@email.com",
    phone: "(11) 94321-0987",
    plan: "Premium",
    startDate: "12/01/2026",
    lastCheckin: "3 dias atrás",
    totalCheckins: 67,
    status: "active",
    financialStatus: "paid",
    payments: [
      {
        id: "1",
        date: "12/04/2026",
        status: "paid",
        method: "PIX",
        amount: 89.9,
      },
    ],
  },
  "6": {
    id: "6",
    name: "Carlos Mendes",
    avatar: "CM",
    photo: null,
    email: "carlos.mendes@email.com",
    phone: "(11) 93210-9876",
    plan: "Premium",
    startDate: "08/10/2025",
    lastCheckin: "12 dias atrás",
    totalCheckins: 112,
    status: "inactive",
    financialStatus: "overdue",
    payments: [
      {
        id: "1",
        date: "08/03/2026",
        status: "overdue",
        method: "Boleto",
        amount: 89.9,
      },
      {
        id: "2",
        date: "08/02/2026",
        status: "overdue",
        method: "Boleto",
        amount: 89.9,
      },
    ],
  },
};

export default function StudentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  // In a real app, fetch student by id from API
  const student = id ? mockStudents[id] : null;

  // If student not found, redirect to list
  if (!isLoading && !student) {
    navigate("/dashboard/alunos");
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Loader className="text-yellow-400" size={48} strokeWidth={2} />
            </motion.div>
            <p className="text-neutral-500 mt-4 text-sm uppercase tracking-wide">
              Carregando dados do aluno...
            </p>
          </motion.div>
        </main>
      </div>
    );
  }

  // Safety check
  if (!student) return null;

  const handleWhatsApp = () => {
    const phoneNumber = student.phone.replace(/\D/g, "");
    window.open(`https://wa.me/55${phoneNumber}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <Sidebar />

      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 lg:px-8 py-4">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between">
              <motion.button
                onClick={() => navigate("/dashboard/alunos")}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: -5 }}
                className="flex items-center gap-2 text-neutral-400 hover:text-yellow-400 transition-all text-sm font-semibold uppercase tracking-wide"
              >
                <ArrowLeft size={16} strokeWidth={2.5} />
                Voltar para lista
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

        {/* Content */}
        <div className="p-6 lg:p-8">
          <div className="max-w-[1200px] mx-auto space-y-6">
            {/* Student Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                {/* Left: Avatar + Name + Status */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  {student.photo ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-yellow-400 flex-shrink-0">
                      <img
                        src={student.photo}
                        alt={student.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-900 font-bold text-2xl">
                        {student.avatar}
                      </span>
                    </div>
                  )}

                  {/* Name + Status */}
                  <div>
                    <h1 className="font-display text-3xl font-black uppercase text-white mb-2">
                      {student.name}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                          student.status === "active"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-neutral-700/30 text-neutral-400 border border-neutral-600/30"
                        }`}
                      >
                        {student.status === "active" ? "Ativo" : "Inativo"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                          student.financialStatus === "paid"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-orange-500/20 text-orange-500 border border-orange-500/30"
                        }`}
                      >
                        {student.financialStatus === "paid"
                          ? "Em dia"
                          : "Em atraso"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={handleWhatsApp}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-400 text-white rounded-md font-bold text-sm uppercase tracking-wide transition-colors"
                  >
                    <MessageCircle size={18} strokeWidth={2.5} />
                    WhatsApp
                  </motion.button>

                  <motion.button
                    onClick={() => navigate(`/dashboard/alunos/${id}/editar`)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-md font-bold text-sm uppercase tracking-wide transition-colors"
                  >
                    <Edit size={18} strokeWidth={2.5} />
                    Editar
                  </motion.button>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard label="Email" value={student.email} icon={Mail} />
                <InfoCard
                  label="Telefone"
                  value={student.phone}
                  icon={Phone}
                />
                <InfoCard
                  label="Plano"
                  value={student.plan}
                  icon={CreditCard}
                />
                <InfoCard
                  label="Data de Início"
                  value={student.startDate}
                  icon={Calendar}
                />
                <InfoCard
                  label="Último Check-in"
                  value={student.lastCheckin}
                  icon={ClipboardCheck}
                />
                <InfoCard
                  label="Total de Check-ins"
                  value={student.totalCheckins.toString()}
                  icon={Hash}
                />
              </div>
            </motion.div>

            {/* Payment History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6"
            >
              <h2 className="font-display text-2xl font-black uppercase text-white mb-6">
                HISTÓRICO DE PAGAMENTOS
              </h2>

              <div className="space-y-3">
                {student.payments.map((payment, index) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="bg-neutral-800/50 border border-neutral-700/50 rounded-md p-4 hover:border-neutral-600/50 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      {/* Left: Date + Status */}
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-white font-bold text-base mb-1">
                            {payment.date}
                          </p>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                payment.status === "paid"
                                  ? "bg-green-500/20 text-green-400"
                                  : payment.status === "overdue"
                                  ? "bg-orange-500/20 text-orange-500"
                                  : "bg-neutral-600/20 text-neutral-400"
                              }`}
                            >
                              {payment.status === "paid"
                                ? "Pago"
                                : payment.status === "overdue"
                                ? "Atrasado"
                                : "Pendente"}
                            </span>
                            <span className="text-neutral-500 text-xs">
                              {payment.method}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Amount */}
                      <div className="text-right">
                        <p className="text-white font-display text-2xl font-black">
                          R$ {payment.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {student.payments.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-neutral-500 text-base">
                    Nenhum pagamento registrado
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
