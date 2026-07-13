import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Sidebar } from "../components/dashboard/Sidebar";
import { FormInput } from "../components/FormInput";
import {
  Building2,
  User,
  CreditCard,
  Settings as SettingsIcon,
  Save,
  X,
  Radio,
} from "lucide-react";

type Tab = "geral" | "perfil" | "planos" | "sistema";

interface GymSettings {
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface AdminProfile {
  nomeCompleto: string;
  email: string;
  telefone: string;
}

interface PasswordChange {
  senhaAtual: string;
  novaSenha: string;
}

interface PlanBenefit {
  id: string;
  text: string;
}

interface Plan {
  id: string;
  nome: string;
  descricao: string;
  valor: string;
  beneficios: PlanBenefit[];
  status: "ativo" | "inativo";
}

interface SystemSettings {
  horarioAbertura: string;
  horarioFechamento: string;
  diasSemCheckinRisco: string;
  diasAntesVencimentoAlerta: string;
}

const initialSettings: GymSettings = {
  nome: "PulseGym Academia",
  cnpj: "12.345.678/0001-90",
  telefone: "(11) 3456-7890",
  email: "contato@pulsegym.com.br",
  endereco: "Rua das Academias, 123 - Centro",
  cidade: "São Paulo",
  estado: "SP",
  cep: "01234-567",
};

const initialAdminProfile: AdminProfile = {
  nomeCompleto: "Admin PulseGym",
  email: "admin@pulsegym.com.br",
  telefone: "(11) 98765-4321",
};

const initialPasswordChange: PasswordChange = {
  senhaAtual: "",
  novaSenha: "",
};

const initialSystemSettings: SystemSettings = {
  horarioAbertura: "06:00",
  horarioFechamento: "22:00",
  diasSemCheckinRisco: "10",
  diasAntesVencimentoAlerta: "5",
};

const initialPlans: Plan[] = [
  {
    id: "1",
    nome: "BÁSICO",
    descricao: "Plano básico",
    valor: "89.90",
    status: "ativo",
    beneficios: [
      { id: "b1", text: "Acesso à área de musculação" },
      { id: "b2", text: "Horário livre" },
      { id: "b3", text: "Armário individual" },
    ],
  },
  {
    id: "2",
    nome: "PREMIUM",
    descricao: "Plano mais popular",
    valor: "199.90",
    status: "ativo",
    beneficios: [
      { id: "b4", text: "Tudo do plano BÁSICO" },
      { id: "b5", text: "Aulas coletivas ilimitadas" },
      { id: "b6", text: "Avaliação física mensal" },
      { id: "b7", text: "Treino personalizado" },
    ],
  },
  {
    id: "3",
    nome: "ELITE",
    descricao: "Plano completo",
    valor: "299.90",
    status: "ativo",
    beneficios: [
      { id: "b8", text: "Tudo do plano PREMIUM" },
      { id: "b9", text: "Personal trainer 2x por semana" },
      { id: "b10", text: "Acompanhamento nutricional" },
      { id: "b11", text: "Acesso a unidades parceiras" },
      { id: "b12", text: "Bebidas proteicas gratuitas" },
    ],
  },
];

export default function ConfiguracoesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("geral");

  // Geral tab state
  const [settings, setSettings] = useState<GymSettings>(initialSettings);
  const [originalSettings] = useState<GymSettings>(initialSettings);
  const [errors, setErrors] = useState<Partial<GymSettings>>({});

  // Perfil Admin tab state
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(initialAdminProfile);
  const [originalAdminProfile] = useState<AdminProfile>(initialAdminProfile);
  const [passwordChange, setPasswordChange] = useState<PasswordChange>(initialPasswordChange);
  const [adminErrors, setAdminErrors] = useState<Partial<AdminProfile & PasswordChange>>({});

  // Planos tab state
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [originalPlans] = useState<Plan[]>(initialPlans);

  // Sistema tab state
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(initialSystemSettings);
  const [originalSystemSettings] = useState<SystemSettings>(initialSystemSettings);
  const [systemErrors, setSystemErrors] = useState<Partial<SystemSettings>>({});

  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<GymSettings> = {};

    if (!settings.nome.trim()) {
      newErrors.nome = "Nome da academia é obrigatório";
    }

    if (!settings.cnpj.trim()) {
      newErrors.cnpj = "CNPJ é obrigatório";
    }

    if (!settings.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    }

    if (!settings.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(settings.email)) {
      newErrors.email = "Email inválido";
    }

    if (!settings.endereco.trim()) {
      newErrors.endereco = "Endereço é obrigatório";
    }

    if (!settings.cidade.trim()) {
      newErrors.cidade = "Cidade é obrigatória";
    }

    if (!settings.estado.trim()) {
      newErrors.estado = "Estado é obrigatório";
    }

    if (!settings.cep.trim()) {
      newErrors.cep = "CEP é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Configurações salvas com sucesso!");
    }, 1500);
  };

  const handleCancel = () => {
    setSettings(originalSettings);
    setErrors({});
  };

  // Admin profile validation
  const validateAdminProfile = (): boolean => {
    const newErrors: Partial<AdminProfile & PasswordChange> = {};

    if (!adminProfile.nomeCompleto.trim()) {
      newErrors.nomeCompleto = "Nome completo é obrigatório";
    }

    if (!adminProfile.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(adminProfile.email)) {
      newErrors.email = "Email inválido";
    }

    if (!adminProfile.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    }

    // Password validation (only if user is trying to change password)
    if (passwordChange.senhaAtual || passwordChange.novaSenha) {
      if (!passwordChange.senhaAtual) {
        newErrors.senhaAtual = "Senha atual é obrigatória para alterar a senha";
      }

      if (!passwordChange.novaSenha) {
        newErrors.novaSenha = "Nova senha é obrigatória";
      } else if (passwordChange.novaSenha.length < 8) {
        newErrors.novaSenha = "Senha deve ter no mínimo 8 caracteres";
      }
    }

    setAdminErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdminSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateAdminProfile()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Perfil atualizado com sucesso!");
      // Clear password fields after successful update
      setPasswordChange(initialPasswordChange);
    }, 1500);
  };

  const handleAdminCancel = () => {
    setAdminProfile(originalAdminProfile);
    setPasswordChange(initialPasswordChange);
    setAdminErrors({});
  };

  // Plans handlers
  const updatePlanField = (
    planId: string,
    field: keyof Plan,
    value: string
  ) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId ? { ...plan, [field]: value } : plan
      )
    );
  };

  const addBenefit = (planId: string) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              beneficios: [
                ...plan.beneficios,
                { id: `b${Date.now()}`, text: "" },
              ],
            }
          : plan
      )
    );
  };

  const updateBenefit = (
    planId: string,
    benefitId: string,
    text: string
  ) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              beneficios: plan.beneficios.map((b) =>
                b.id === benefitId ? { ...b, text } : b
              ),
            }
          : plan
      )
    );
  };

  const removeBenefit = (planId: string, benefitId: string) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              beneficios: plan.beneficios.filter((b) => b.id !== benefitId),
            }
          : plan
      )
    );
  };

  const createNewPlan = () => {
    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      nome: "NOVO PLANO",
      descricao: "Descrição do plano",
      valor: "0.00",
      status: "ativo",
      beneficios: [{ id: `b${Date.now()}`, text: "Novo benefício" }],
    };
    setPlans((prev) => [...prev, newPlan]);
  };

  const handlePlansSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Planos salvos com sucesso!");
    }, 1500);
  };

  const handlePlansCancel = () => {
    setPlans(originalPlans);
  };

  // System settings validation
  const validateSystemSettings = (): boolean => {
    const newErrors: Partial<SystemSettings> = {};

    if (!systemSettings.horarioAbertura.trim()) {
      newErrors.horarioAbertura = "Horário de abertura é obrigatório";
    }

    if (!systemSettings.horarioFechamento.trim()) {
      newErrors.horarioFechamento = "Horário de fechamento é obrigatório";
    }

    if (!systemSettings.diasSemCheckinRisco.trim()) {
      newErrors.diasSemCheckinRisco = "Campo obrigatório";
    } else if (parseInt(systemSettings.diasSemCheckinRisco) < 1) {
      newErrors.diasSemCheckinRisco = "Deve ser no mínimo 1 dia";
    }

    if (!systemSettings.diasAntesVencimentoAlerta.trim()) {
      newErrors.diasAntesVencimentoAlerta = "Campo obrigatório";
    } else if (parseInt(systemSettings.diasAntesVencimentoAlerta) < 0) {
      newErrors.diasAntesVencimentoAlerta = "Deve ser no mínimo 0 dias";
    }

    setSystemErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSystemSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateSystemSettings()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Configurações do sistema salvas com sucesso!");
    }, 1500);
  };

  const handleSystemCancel = () => {
    setSystemSettings(originalSystemSettings);
    setSystemErrors({});
  };

  const tabs = [
    { id: "geral" as Tab, label: "Geral", icon: Building2 },
    { id: "perfil" as Tab, label: "Perfil Admin", icon: User },
    { id: "planos" as Tab, label: "Planos", icon: CreditCard },
    { id: "sistema" as Tab, label: "Sistema", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <Sidebar />

      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 lg:px-8 py-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="font-display text-4xl lg:text-5xl font-black uppercase text-white mb-2">
                  CONFIGURAÇÕES
                </h1>
                <p className="text-neutral-500 text-sm">
                  Gerencie as configurações da academia
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
          <div className="max-w-[1200px] mx-auto">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 mb-8 overflow-x-auto pb-2"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center gap-2 px-5 py-3 rounded-md font-bold text-sm uppercase tracking-wide
                      transition-all duration-200 whitespace-nowrap
                      ${
                        isActive
                          ? "bg-yellow-400 text-yellow-900"
                          : "bg-neutral-900 text-neutral-300 border border-neutral-700 hover:border-yellow-400/50"
                      }
                    `}
                  >
                    <Icon size={18} strokeWidth={2.5} />
                    {tab.label}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Tab Content */}
            {activeTab === "geral" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6 lg:p-8"
              >
                {/* Section Title */}
                <div className="mb-6">
                  <h2 className="font-display text-2xl font-black uppercase text-white mb-2">
                    INFORMAÇÕES DA ACADEMIA
                  </h2>
                  <p className="text-neutral-500 text-sm">
                    Configure os dados básicos da sua academia
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1: Nome e CNPJ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Nome da Academia"
                      type="text"
                      value={settings.nome}
                      onChange={(e) =>
                        setSettings({ ...settings, nome: e.target.value })
                      }
                      error={errors.nome}
                      required
                      placeholder="Ex: GymX Academia"
                    />

                    <FormInput
                      label="CNPJ"
                      type="text"
                      value={settings.cnpj}
                      onChange={(e) =>
                        setSettings({ ...settings, cnpj: e.target.value })
                      }
                      error={errors.cnpj}
                      required
                      placeholder="00.000.000/0000-00"
                    />
                  </div>

                  {/* Row 2: Telefone e Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Telefone"
                      type="tel"
                      value={settings.telefone}
                      onChange={(e) =>
                        setSettings({ ...settings, telefone: e.target.value })
                      }
                      error={errors.telefone}
                      required
                      placeholder="(00) 0000-0000"
                    />

                    <FormInput
                      label="Email"
                      type="email"
                      value={settings.email}
                      onChange={(e) =>
                        setSettings({ ...settings, email: e.target.value })
                      }
                      error={errors.email}
                      required
                      placeholder="contato@academia.com"
                    />
                  </div>

                  {/* Row 3: Endereço */}
                  <FormInput
                    label="Endereço"
                    type="text"
                    value={settings.endereco}
                    onChange={(e) =>
                      setSettings({ ...settings, endereco: e.target.value })
                    }
                    error={errors.endereco}
                    required
                    placeholder="Rua, Número, Complemento"
                  />

                  {/* Row 4: Cidade, Estado, CEP */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormInput
                      label="Cidade"
                      type="text"
                      value={settings.cidade}
                      onChange={(e) =>
                        setSettings({ ...settings, cidade: e.target.value })
                      }
                      error={errors.cidade}
                      required
                      placeholder="São Paulo"
                    />

                    <FormInput
                      label="Estado"
                      type="text"
                      value={settings.estado}
                      onChange={(e) =>
                        setSettings({ ...settings, estado: e.target.value })
                      }
                      error={errors.estado}
                      required
                      placeholder="SP"
                      maxLength={2}
                    />

                    <FormInput
                      label="CEP"
                      type="text"
                      value={settings.cep}
                      onChange={(e) =>
                        setSettings({ ...settings, cep: e.target.value })
                      }
                      error={errors.cep}
                      required
                      placeholder="00000-000"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-3 pt-6 border-t border-neutral-800">
                    <motion.button
                      type="button"
                      onClick={handleCancel}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-md font-bold text-sm uppercase tracking-wide transition-colors"
                    >
                      <X size={18} strokeWidth={2.5} />
                      Cancelar
                    </motion.button>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-md font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-yellow-900 border-t-transparent rounded-full"
                          />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save size={18} strokeWidth={2.5} />
                          Salvar Alterações
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Perfil Admin Tab */}
            {activeTab === "perfil" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6 lg:p-8"
              >
                <form onSubmit={handleAdminSubmit} className="space-y-8">
                  {/* Section 1: Perfil do Administrador */}
                  <div>
                    <div className="mb-6">
                      <h2 className="font-display text-2xl font-black uppercase text-white mb-2">
                        PERFIL DO ADMINISTRADOR
                      </h2>
                      <p className="text-neutral-500 text-sm">
                        Gerencie suas informações pessoais e credenciais
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Row 1: Nome Completo e Email */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                          label="Nome Completo"
                          type="text"
                          value={adminProfile.nomeCompleto}
                          onChange={(e) =>
                            setAdminProfile({
                              ...adminProfile,
                              nomeCompleto: e.target.value,
                            })
                          }
                          error={adminErrors.nomeCompleto}
                          required
                          placeholder="Seu nome completo"
                        />

                        <FormInput
                          label="Email"
                          type="email"
                          value={adminProfile.email}
                          onChange={(e) =>
                            setAdminProfile({
                              ...adminProfile,
                              email: e.target.value,
                            })
                          }
                          error={adminErrors.email}
                          required
                          placeholder="seu@email.com"
                        />
                      </div>

                      {/* Row 2: Telefone */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                          label="Telefone"
                          type="tel"
                          value={adminProfile.telefone}
                          onChange={(e) =>
                            setAdminProfile({
                              ...adminProfile,
                              telefone: e.target.value,
                            })
                          }
                          error={adminErrors.telefone}
                          required
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Alterar Senha */}
                  <div className="pt-8 border-t border-neutral-800">
                    <div className="mb-6">
                      <h2 className="font-display text-2xl font-black uppercase text-white mb-2">
                        ALTERAR SENHA
                      </h2>
                      <p className="text-neutral-500 text-sm">
                        Deixe em branco se não deseja alterar a senha
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Password fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                          label="Senha Atual"
                          type="password"
                          value={passwordChange.senhaAtual}
                          onChange={(e) =>
                            setPasswordChange({
                              ...passwordChange,
                              senhaAtual: e.target.value,
                            })
                          }
                          error={adminErrors.senhaAtual}
                          placeholder="Digite sua senha atual"
                          icon="password"
                        />

                        <FormInput
                          label="Nova Senha"
                          type="password"
                          value={passwordChange.novaSenha}
                          onChange={(e) =>
                            setPasswordChange({
                              ...passwordChange,
                              novaSenha: e.target.value,
                            })
                          }
                          error={adminErrors.novaSenha}
                          placeholder="Digite a nova senha"
                          icon="password"
                        />
                      </div>

                      {passwordChange.novaSenha && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-neutral-500 text-xs"
                        >
                          A senha deve ter no mínimo 8 caracteres
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-3 pt-6 border-t border-neutral-800">
                    <motion.button
                      type="button"
                      onClick={handleAdminCancel}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-md font-bold text-sm uppercase tracking-wide transition-colors"
                    >
                      <X size={18} strokeWidth={2.5} />
                      Cancelar
                    </motion.button>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-md font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-yellow-900 border-t-transparent rounded-full"
                          />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save size={18} strokeWidth={2.5} />
                          Salvar Alterações
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Planos Tab */}
            {activeTab === "planos" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6 lg:p-8"
              >
                <form onSubmit={handlePlansSubmit} className="space-y-6">
                  {/* Section Title */}
                  <div className="mb-6">
                    <h2 className="font-display text-2xl font-black uppercase text-white mb-2">
                      PLANOS E PREÇOS
                    </h2>
                    <p className="text-neutral-500 text-sm">
                      Configure os planos disponíveis para os alunos. As
                      alterações refletem em todo o sistema.
                    </p>
                  </div>

                  {/* Plans Grid */}
                  <div className="space-y-6">
                    {plans.map((plan, index) => (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-neutral-800/50 border border-neutral-700 rounded-md p-6 hover:border-yellow-400/30 transition-all"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Left: Plan Info */}
                          <div className="lg:col-span-2 space-y-4">
                            {/* Plan Name */}
                            <input
                              type="text"
                              value={plan.nome}
                              onChange={(e) =>
                                updatePlanField(plan.id, "nome", e.target.value)
                              }
                              className="bg-transparent border-none text-yellow-400 font-display text-2xl font-black uppercase focus:outline-none focus:ring-0 p-0 w-full placeholder:text-yellow-400/50"
                              placeholder="NOME DO PLANO"
                            />

                            {/* Plan Description */}
                            <input
                              type="text"
                              value={plan.descricao}
                              onChange={(e) =>
                                updatePlanField(
                                  plan.id,
                                  "descricao",
                                  e.target.value
                                )
                              }
                              className="bg-transparent border-none text-neutral-400 text-sm focus:outline-none focus:ring-0 p-0 w-full placeholder:text-neutral-500"
                              placeholder="Descrição do plano"
                            />

                            {/* Benefits */}
                            <div className="space-y-2 mt-4">
                              {plan.beneficios.map((benefit) => (
                                <div
                                  key={benefit.id}
                                  className="flex items-center gap-2"
                                >
                                  <span className="text-yellow-400">•</span>
                                  <input
                                    type="text"
                                    value={benefit.text}
                                    onChange={(e) =>
                                      updateBenefit(
                                        plan.id,
                                        benefit.id,
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 bg-transparent border-none text-neutral-300 text-sm focus:outline-none focus:ring-0 p-0 placeholder:text-neutral-600"
                                    placeholder="Digite o benefício"
                                  />
                                  <motion.button
                                    type="button"
                                    onClick={() =>
                                      removeBenefit(plan.id, benefit.id)
                                    }
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-orange-500 hover:text-orange-400 text-xs"
                                  >
                                    ✕
                                  </motion.button>
                                </div>
                              ))}

                              {/* Add Benefit Button */}
                              <motion.button
                                type="button"
                                onClick={() => addBenefit(plan.id)}
                                whileHover={{ x: 5 }}
                                className="flex items-center gap-2 text-neutral-500 hover:text-yellow-400 text-sm mt-2 transition-colors"
                              >
                                <span>+</span>
                                <span>Adicionar benefício</span>
                              </motion.button>
                            </div>
                          </div>

                          {/* Right: Price */}
                          <div className="flex items-start justify-end">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
                                R$
                              </span>
                              <input
                                type="text"
                                value={plan.valor}
                                onChange={(e) =>
                                  updatePlanField(
                                    plan.id,
                                    "valor",
                                    e.target.value
                                  )
                                }
                                className="w-32 bg-neutral-900 border border-neutral-700 rounded-md pl-10 pr-4 py-2 text-white text-right font-bold focus:outline-none focus:border-yellow-400 transition-colors"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Create New Plan Button */}
                  <motion.button
                    type="button"
                    onClick={createNewPlan}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-md font-bold text-sm uppercase tracking-wide transition-colors"
                  >
                    <span className="text-lg">+</span>
                    Criar Novo Plano
                  </motion.button>

                  {/* Action Buttons */}
                  <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-3 pt-6 border-t border-neutral-800">
                    <motion.button
                      type="button"
                      onClick={handlePlansCancel}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-md font-bold text-sm uppercase tracking-wide transition-colors"
                    >
                      <X size={18} strokeWidth={2.5} />
                      Cancelar
                    </motion.button>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-md font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-yellow-900 border-t-transparent rounded-full"
                          />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save size={18} strokeWidth={2.5} />
                          Salvar Alterações
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Sistema Tab */}
            {activeTab === "sistema" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6 lg:p-8"
              >
                <form onSubmit={handleSystemSubmit} className="space-y-8">
                  {/* Section Title */}
                  <div className="mb-6">
                    <h2 className="font-display text-2xl font-black uppercase text-white mb-2">
                      CONFIGURAÇÕES DO SISTEMA
                    </h2>
                    <p className="text-neutral-500 text-sm">
                      Configure parâmetros operacionais do sistema
                    </p>
                  </div>

                  {/* Horário de Funcionamento */}
                  <div>
                    <h3 className="text-white font-bold text-lg mb-4">
                      Horário de Funcionamento
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Abertura"
                        type="time"
                        value={systemSettings.horarioAbertura}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            horarioAbertura: e.target.value,
                          })
                        }
                        error={systemErrors.horarioAbertura}
                        required
                      />

                      <FormInput
                        label="Fechamento"
                        type="time"
                        value={systemSettings.horarioFechamento}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            horarioFechamento: e.target.value,
                          })
                        }
                        error={systemErrors.horarioFechamento}
                        required
                      />
                    </div>
                  </div>

                  {/* Alertas Automáticos */}
                  <div className="pt-6 border-t border-neutral-800">
                    <h3 className="text-white font-bold text-lg mb-4">
                      Alertas Automáticos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <FormInput
                          label="Dias sem check-in para risco"
                          type="number"
                          value={systemSettings.diasSemCheckinRisco}
                          onChange={(e) =>
                            setSystemSettings({
                              ...systemSettings,
                              diasSemCheckinRisco: e.target.value,
                            })
                          }
                          error={systemErrors.diasSemCheckinRisco}
                          required
                          min="1"
                        />
                        <p className="text-neutral-600 text-xs mt-2">
                          Dias sem frequência para considerar aluno em risco
                        </p>
                      </div>

                      <div>
                        <FormInput
                          label="Dias antes do vencimento para alertar"
                          type="number"
                          value={systemSettings.diasAntesVencimentoAlerta}
                          onChange={(e) =>
                            setSystemSettings({
                              ...systemSettings,
                              diasAntesVencimentoAlerta: e.target.value,
                            })
                          }
                          error={systemErrors.diasAntesVencimentoAlerta}
                          required
                          min="0"
                        />
                        <p className="text-neutral-600 text-xs mt-2">
                          Antecedência para notificar vencimento
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informações do Sistema */}
                  <div className="pt-6 border-t border-neutral-800">
                    <h3 className="text-white font-bold text-lg mb-4">
                      Informações do Sistema
                    </h3>
                    <div className="bg-neutral-800/50 border border-neutral-700 rounded-md p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-neutral-500 mb-1">Versão:</p>
                          <p className="text-white font-semibold">1.0.0</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 mb-1">
                            Última atualização:
                          </p>
                          <p className="text-white font-semibold">
                            23 de fevereiro, 2026
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-500 mb-1">
                            Banco de dados:
                          </p>
                          <p className="text-green-400 font-semibold">
                            Conectado
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Design System */}
                  <div className="pt-6 border-t border-neutral-800">
                    <h3 className="text-white font-bold text-lg mb-4">
                      Design System
                    </h3>
                    <div className="bg-neutral-800/50 border border-neutral-700 rounded-md p-6">
                      <p className="text-neutral-400 text-sm mb-4">
                        Acesse a documentação completa do Design System com
                        tokens, componentes e guias de estilo.
                      </p>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-md font-bold text-sm uppercase tracking-wide transition-colors"
                      >
                        <span className="text-lg">📖</span>
                        Abrir Design System
                      </motion.button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-3 pt-6 border-t border-neutral-800">
                    <motion.button
                      type="button"
                      onClick={handleSystemCancel}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-md font-bold text-sm uppercase tracking-wide transition-colors"
                    >
                      <X size={18} strokeWidth={2.5} />
                      Cancelar
                    </motion.button>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-md font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-yellow-900 border-t-transparent rounded-full"
                          />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save size={18} strokeWidth={2.5} />
                          Salvar Alterações
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
