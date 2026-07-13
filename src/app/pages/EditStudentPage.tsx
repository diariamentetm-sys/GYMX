import { useState, FormEvent, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router";
import { Sidebar } from "../components/dashboard/Sidebar";
import { FormInput } from "../components/FormInput";
import { FormSelect } from "../components/FormSelect";
import { ToggleButtons } from "../components/ToggleButtons";
import { MultiSelectChips } from "../components/MultiSelectChips";
import { FormSectionHeader } from "../components/FormSectionHeader";
import { SignaturePad } from "../components/SignaturePad";
import {
  User,
  Heart,
  Zap,
  Target,
  Activity,
  CreditCard,
  FileText,
  ArrowLeft,
  Printer,
  Save,
  AlertTriangle,
  Radio,
  Camera,
  Upload,
} from "lucide-react";

// Mock data - In real app, fetch from API
const mockStudentData: Record<string, any> = {
  "1": {
    photo: null,
    fullName: "Maria Santos",
    birthDate: "1995-03-15",
    cpf: "123.456.789-00",
    rg: "12.345.678-9",
    gender: "F",
    civilStatus: "solteiro",
    occupation: "Designer",
    phone: "(11) 98765-4321",
    email: "maria.santos@email.com",
    address: "Rua das Flores, 123 - Centro, São Paulo, SP, 01234-567",
    emergencyContact: "João Santos",
    emergencyPhone: "(11) 98765-1234",
  },
  "2": {
    photo: null,
    fullName: "João Silva",
    birthDate: "1988-07-22",
    cpf: "987.654.321-00",
    rg: "98.765.432-1",
    gender: "M",
    civilStatus: "casado",
    occupation: "Engenheiro",
    phone: "(11) 97654-3210",
    email: "joao.silva@email.com",
    address: "Av. Paulista, 456 - Bela Vista, São Paulo, SP, 01310-000",
    emergencyContact: "Ana Silva",
    emergencyPhone: "(11) 97654-9999",
  },
};

export default function EditStudentPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Section 1: Personal Data
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [gender, setGender] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [occupation, setOccupation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  // Section 2: Health Data (Anamnese)
  const [healthQ1, setHealthQ1] = useState("");
  const [healthQ2, setHealthQ2] = useState("");
  const [healthQ3, setHealthQ3] = useState("");
  const [healthQ4, setHealthQ4] = useState("");
  const [healthQ5, setHealthQ5] = useState("");
  const [healthQ6, setHealthQ6] = useState("");
  const [healthQ7, setHealthQ7] = useState("");
  const [healthQ8, setHealthQ8] = useState("");
  const [healthQ9, setHealthQ9] = useState("");
  const [healthQ10, setHealthQ10] = useState("");
  const [healthQ11, setHealthQ11] = useState("");
  const [healthQ12, setHealthQ12] = useState("");

  // Section 3: PAR-Q
  const [parQ1, setParQ1] = useState("");
  const [parQ2, setParQ2] = useState("");
  const [parQ3, setParQ3] = useState("");
  const [parQ4, setParQ4] = useState("");
  const [parQ5, setParQ5] = useState("");
  const [parQ6, setParQ6] = useState("");

  // Section 4: Goals
  const [goals, setGoals] = useState<string[]>([]);
  const [hasTrainedBefore, setHasTrainedBefore] = useState("");
  const [trainingDuration, setTrainingDuration] = useState("");
  const [weeklyFrequency, setWeeklyFrequency] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  // Section 5: Body Info
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [measurements, setMeasurements] = useState("");

  // Section 6: Plan
  const [planType, setPlanType] = useState("");
  const [planValue, setPlanValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // Section 7: Signature
  const [signatureEmpty, setSignatureEmpty] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  // Load student data
  useEffect(() => {
    if (id && mockStudentData[id]) {
      const student = mockStudentData[id];
      setFullName(student.fullName);
      setBirthDate(student.birthDate);
      setCpf(student.cpf);
      setRg(student.rg);
      setGender(student.gender);
      setCivilStatus(student.civilStatus);
      setOccupation(student.occupation);
      setPhone(student.phone);
      setEmail(student.email);
      setAddress(student.address);
      setEmergencyContact(student.emergencyContact);
      setEmergencyPhone(student.emergencyPhone);
      if (student.photo) {
        setPhotoPreview(student.photo);
      }
    }
  }, [id]);

  // Check if any PAR-Q answer is YES
  const hasParQAlert =
    parQ1 === "SIM" ||
    parQ2 === "SIM" ||
    parQ3 === "SIM" ||
    parQ4 === "SIM" ||
    parQ5 === "SIM" ||
    parQ6 === "SIM";

  // Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-calculate BMI
  const calculateBMI = () => {
    if (weight && height) {
      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height) / 100; // convert cm to m
      if (!isNaN(weightNum) && !isNaN(heightNum) && heightNum > 0) {
        const calculatedBMI = weightNum / (heightNum * heightNum);
        setBmi(calculatedBMI.toFixed(1));
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate save
    setTimeout(() => {
      setIsLoading(false);
      alert("Dados do aluno atualizados com sucesso!");
      navigate(`/dashboard/alunos/${id}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <Sidebar />

      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between max-w-[1200px] mx-auto">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate(`/dashboard/alunos/${id}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-neutral-400 hover:text-yellow-400 transition-colors text-sm font-semibold uppercase tracking-wide"
              >
                <ArrowLeft size={16} strokeWidth={2.5} />
                Voltar
              </motion.button>
              <div className="w-px h-6 bg-neutral-700" />
              <div>
                <h1 className="font-display text-2xl font-black uppercase text-white">
                  EDITAR DADOS DO ALUNO
                </h1>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <motion.button
                onClick={() => navigate("/modo-recepcao")}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-md text-sm font-bold uppercase tracking-wide transition-colors shadow-lg shadow-orange-500/20"
              >
                <Radio size={16} strokeWidth={2.5} />
                Ativar Recepção
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md text-white text-sm font-semibold uppercase tracking-wide transition-colors"
              >
                <Printer size={16} strokeWidth={2.5} />
                Imprimir
              </motion.button>
              <motion.button
                type="submit"
                form="student-form"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-md text-sm font-bold uppercase tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} strokeWidth={2.5} />
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 lg:p-8">
          <form
            id="student-form"
            onSubmit={handleSubmit}
            className="max-w-[1200px] mx-auto space-y-12"
          >
            {/* SECTION 1: Personal Data */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FormSectionHeader
                number={1}
                title="Dados Pessoais"
                icon={User}
                subtitle="Informações básicas do aluno"
              />

              {/* Photo Upload */}
              <div className="mb-8">
                <label className="block text-neutral-300 text-sm font-semibold mb-3">
                  Foto do Aluno
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer group"
                  >
                    {photoPreview ? (
                      <div className="relative">
                        <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-neutral-700 group-hover:border-yellow-400 transition-all">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <Camera className="text-white" size={32} strokeWidth={2} />
                        </div>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-xl border-2 border-dashed border-neutral-700 group-hover:border-yellow-400 bg-neutral-900/50 flex flex-col items-center justify-center gap-2 transition-all">
                        <Upload className="text-neutral-500 group-hover:text-yellow-400 transition-colors" size={32} strokeWidth={2} />
                        <span className="text-neutral-500 group-hover:text-yellow-400 text-xs font-semibold transition-colors">
                          Adicionar foto
                        </span>
                      </div>
                    )}
                  </label>
                  {photoPreview && (
                    <div className="text-sm">
                      <p className="text-neutral-300 font-medium mb-1">
                        {photoFile?.name || "Foto atual"}
                      </p>
                      <p className="text-neutral-500 text-xs">
                        Clique na imagem para alterar
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <FormInput
                    label="Nome Completo"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nome completo do aluno"
                    required
                  />
                </div>

                <FormInput
                  label="Data de Nascimento"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />

                <FormInput
                  label="CPF"
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  required
                />

                <FormInput
                  label="RG"
                  type="text"
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                  placeholder="RG do aluno"
                />

                <FormSelect
                  label="Sexo"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  options={[
                    { value: "", label: "Selecione" },
                    { value: "M", label: "Masculino" },
                    { value: "F", label: "Feminino" },
                    { value: "O", label: "Outro" },
                  ]}
                />

                <FormSelect
                  label="Estado Civil"
                  value={civilStatus}
                  onChange={(e) => setCivilStatus(e.target.value)}
                  options={[
                    { value: "", label: "Selecione" },
                    { value: "solteiro", label: "Solteiro(a)" },
                    { value: "casado", label: "Casado(a)" },
                    { value: "divorciado", label: "Divorciado(a)" },
                    { value: "viuvo", label: "Viúvo(a)" },
                  ]}
                />

                <FormInput
                  label="Profissão"
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="Profissão do aluno"
                />

                <FormInput
                  label="Telefone (WhatsApp)"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                />

                <FormInput
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  required
                />

                <div className="md:col-span-2">
                  <FormInput
                    label="Endereço Completo"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, Número, Bairro, Cidade, Estado, CEP"
                    required
                  />
                </div>

                <FormInput
                  label="Contato de Emergência"
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="Nome completo do contato"
                  required
                />

                <FormInput
                  label="Telefone do Contato de Emergência"
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
            </motion.section>

            {/* SECTION 2: Health Data */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <FormSectionHeader
                number={2}
                title="Dados de Saúde"
                icon={Heart}
                subtitle="Anamnese básica"
              />

              <div className="space-y-3">
                <ToggleButtons
                  question="Possui alguma doença diagnosticada?"
                  options={[
                    { value: "SIM", label: "Sim" },
                    { value: "NÃO", label: "Não" },
                  ]}
                  value={healthQ1}
                  onChange={setHealthQ1}
                  name="healthQ1"
                />

                <ToggleButtons
                  question="Problemas cardíacos?"
                  options={[
                    { value: "SIM", label: "Sim" },
                    { value: "NÃO", label: "Não" },
                  ]}
                  value={healthQ2}
                  onChange={setHealthQ2}
                  name="healthQ2"
                />

                <ToggleButtons
                  question="Pressão alta ou baixa?"
                  options={[
                    { value: "NÃO", label: "Não" },
                    { value: "ALTA", label: "Alta" },
                    { value: "BAIXA", label: "Baixa" },
                  ]}
                  value={healthQ3}
                  onChange={setHealthQ3}
                  name="healthQ3"
                />

                <ToggleButtons
                  question="Possui diabetes?"
                  options={[
                    { value: "SIM", label: "Sim" },
                    { value: "NÃO", label: "Não" },
                  ]}
                  value={healthQ4}
                  onChange={setHealthQ4}
                  name="healthQ4"
                />

                <ToggleButtons
                  question="Desmaios ou tonturas frequentes?"
                  options={[
                    { value: "SIM", label: "Sim" },
                    { value: "NÃO", label: "Não" },
                  ]}
                  value={healthQ5}
                  onChange={setHealthQ5}
                  name="healthQ5"
                />

                <ToggleButtons
                  question="Problemas respiratórios?"
                  options={[
                    { value: "SIM", label: "Sim" },
                    { value: "NÃO", label: "Não" },
                  ]}
                  value={healthQ6}
                  onChange={setHealthQ6}
                  name="healthQ6"
                />

                <ToggleButtons
                  question="Problemas articulares?"
                  options={[
                    { value: "SIM", label: "Sim" },
                    { value: "NÃO", label: "Não" },
                  ]}
                  value={healthQ7}
                  onChange={setHealthQ7}
                  name="healthQ7"
                />

                <ToggleButtons
                  question="Já realizou cirurgia?"
                  options={[
                    { value: "SIM", label: "Sim" },
                    { value: "NÃO", label: "Não" },
                  ]}
                  value={healthQ8}
                  onChange={setHealthQ8}
                  name="healthQ8"
                />

                <ToggleButtons
                  question="Faz uso de medicação contínua?"
                  options={[
                    { value: "SIM", label: "Sim" },
                    { value: "NÃO", label: "Não" },
                  ]}
                  value={healthQ9}
                  onChange={setHealthQ9}
                  name="healthQ9"
                />

                <ToggleButtons
                  question="Está gestante?"
                  options={[
                    { value: "SIM", label: "Sim" },
                    { value: "NÃO", label: "Não" },
                    { value: "N/A", label: "N/A" },
                  ]}
                  value={healthQ10}
                  onChange={setHealthQ10}
                  name="healthQ10"
                />

                <ToggleButtons
                  question="Possui limitação física?"
                  options={[
                    { value: "SIM", label: "Sim" },
                    { value: "NÃO", label: "Não" },
                  ]}
                  value={healthQ11}
                  onChange={setHealthQ11}
                  name="healthQ11"
                />

                <ToggleButtons
                  question="Possui recomendação médica para prática de exercícios?"
                  options={[
                    { value: "SIM", label: "Sim" },
                    { value: "NÃO", label: "Não" },
                  ]}
                  value={healthQ12}
                  onChange={setHealthQ12}
                  name="healthQ12"
                />
              </div>
            </motion.section>

            {/* SECTION 3: PAR-Q */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FormSectionHeader
                number={3}
                title="Questionário PAR-Q"
                icon={Zap}
                subtitle="Prontidão para Atividade Física"
              />

              <div className="space-y-3">
                <ToggleButtons
                  question="Algum médico já disse que você possui problema cardíaco?"
                  options={[
                    { value: "SIM", label: "Sim" },
                    { value: "NÃO", label: "Não" },
                  ]}
                  value={parQ1}
                  onChange={setParQ1}
                  name="parQ1"
                />

                <ToggleButtons
                  question="Sente dor no peito ao realizar atividade física?"
                  options={[
                    { value: "SIM", label: "Sim" },
                    { value: "NÃO", label: "Não" },
                  ]}
                  value={parQ2}
                  onChange={setParQ2}
                  name="parQ2"
                />

                <ToggleButtons
                  question="Sentiu dor no peito no último mês?"
                  options={[
                    { value: "SIM", label: "Sim" },
                    { value: "NÃO", label: "Não" },
                  ]}
                  value={parQ3}
                  onChange={setParQ3}
                  name="parQ3"
                />

                <ToggleButtons
                  question="Perde o equilíbrio por tontura ou já perdeu a consciência?"
                  options={[
                    { value: "SIM", label: "Sim" },
                    { value: "NÃO", label: "Não" },
                  ]}
                  value={parQ4}
                  onChange={setParQ4}
                  name="parQ4"
                />

                <ToggleButtons
                  question="Possui problema ósseo ou articular que pode piorar com exercício?"
                  options={[
                    { value: "SIM", label: "Sim" },
                    { value: "NÃO", label: "Não" },
                  ]}
                  value={parQ5}
                  onChange={setParQ5}
                  name="parQ5"
                />

                <ToggleButtons
                  question="Seu médico já recomendou restrição de atividade física?"
                  options={[
                    { value: "SIM", label: "Sim" },
                    { value: "NÃO", label: "Não" },
                  ]}
                  value={parQ6}
                  onChange={setParQ6}
                  name="parQ6"
                />

                {/* PAR-Q Alert */}
                {hasParQAlert && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-orange-500/10 border-2 border-orange-500 rounded-md p-4 flex items-start gap-3"
                  >
                    <AlertTriangle
                      className="text-orange-500 flex-shrink-0 mt-0.5"
                      size={20}
                      strokeWidth={2.5}
                    />
                    <div>
                      <p className="text-orange-500 font-semibold text-sm">
                        Atenção: Avaliação médica recomendada
                      </p>
                      <p className="text-neutral-300 text-sm mt-1">
                        Se assinalou 1 ou mais respostas 'SIM', recomenda-se
                        avaliação médica antes de iniciar.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.section>

            {/* SECTION 4: Goals */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <FormSectionHeader
                number={4}
                title="Objetivos do Aluno"
                icon={Target}
              />

              <div className="space-y-6">
                <MultiSelectChips
                  label="Qual seu principal objetivo?"
                  options={[
                    { value: "emagrecimento", label: "Emagrecimento" },
                    { value: "hipertrofia", label: "Hipertrofia" },
                    {
                      value: "condicionamento",
                      label: "Condicionamento Físico",
                    },
                    { value: "reabilitacao", label: "Reabilitação" },
                    { value: "saude", label: "Saúde Geral" },
                    { value: "outro", label: "Outro" },
                  ]}
                  value={goals}
                  onChange={setGoals}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormSelect
                    label="Já treinou antes?"
                    value={hasTrainedBefore}
                    onChange={(e) => setHasTrainedBefore(e.target.value)}
                    options={[
                      { value: "", label: "Selecione" },
                      { value: "nunca", label: "Nunca treinei" },
                      { value: "mais1ano", label: "Treinei há mais de 1 ano" },
                      { value: "regular", label: "Treino regularmente" },
                    ]}
                  />

                  <FormInput
                    label="Há quanto tempo pratica exercícios?"
                    type="text"
                    value={trainingDuration}
                    onChange={(e) => setTrainingDuration(e.target.value)}
                    placeholder="Ex: 6 meses, 1 ano..."
                  />

                  <FormSelect
                    label="Quantas vezes por semana pretende treinar?"
                    value={weeklyFrequency}
                    onChange={(e) => setWeeklyFrequency(e.target.value)}
                    options={[
                      { value: "", label: "Selecione" },
                      { value: "1", label: "1x por semana" },
                      { value: "2", label: "2x por semana" },
                      { value: "3", label: "3x por semana" },
                      { value: "4", label: "4x por semana" },
                      { value: "5+", label: "5x ou mais por semana" },
                    ]}
                  />

                  <FormInput
                    label="Preferência de horário?"
                    type="text"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    placeholder="Ex: Manhã, Tarde, Noite"
                  />
                </div>
              </div>
            </motion.section>

            {/* SECTION 5: Body Info */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <FormSectionHeader
                number={5}
                title="Informações Corporais"
                icon={Activity}
                subtitle="Avaliação inicial - Opcional"
              />

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <FormInput
                    label="Peso (kg)"
                    type="number"
                    value={weight}
                    onChange={(e) => {
                      setWeight(e.target.value);
                      setTimeout(calculateBMI, 100);
                    }}
                    placeholder="Ex: 70"
                  />

                  <FormInput
                    label="Altura (cm)"
                    type="number"
                    value={height}
                    onChange={(e) => {
                      setHeight(e.target.value);
                      setTimeout(calculateBMI, 100);
                    }}
                    placeholder="Ex: 170"
                  />

                  <FormInput
                    label="IMC"
                    type="text"
                    value={bmi}
                    onChange={(e) => setBmi(e.target.value)}
                    placeholder="Ex: 24.2"
                  />

                  <FormInput
                    label="% Gordura"
                    type="text"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                    placeholder="Ex: 18%"
                  />
                </div>

                <FormInput
                  label="Medidas Corporais"
                  type="text"
                  value={measurements}
                  onChange={(e) => setMeasurements(e.target.value)}
                  placeholder="Ex: Braço 35cm, Cintura 80cm, Quadril 95cm"
                />
              </div>
            </motion.section>

            {/* SECTION 6: Plan */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <FormSectionHeader
                number={6}
                title="Plano Contratado"
                icon={CreditCard}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect
                  label="Tipo de Plano"
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value)}
                  required
                  options={[
                    { value: "", label: "Selecione o plano" },
                    { value: "basico", label: "Básico - Mensal" },
                    { value: "premium", label: "Premium - Trimestral" },
                    { value: "elite", label: "Elite - Semestral" },
                    { value: "anual", label: "Anual - 12 meses" },
                  ]}
                />

                <FormInput
                  label="Valor (R$)"
                  type="text"
                  value={planValue}
                  onChange={(e) => setPlanValue(e.target.value)}
                  placeholder="R$ 0,00"
                  required
                />

                <FormInput
                  label="Data de Início"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />

                <FormInput
                  label="Data de Vencimento"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />

                <div className="md:col-span-2">
                  <FormSelect
                    label="Forma de Pagamento"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                    options={[
                      { value: "", label: "Selecione" },
                      { value: "dinheiro", label: "Dinheiro" },
                      { value: "credito", label: "Cartão de Crédito" },
                      { value: "debito", label: "Cartão de Débito" },
                      { value: "pix", label: "PIX" },
                      { value: "boleto", label: "Boleto" },
                    ]}
                  />
                </div>
              </div>
            </motion.section>

            {/* Mobile Submit Button */}
            <div className="md:hidden flex flex-col gap-3">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-md text-sm font-bold uppercase tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} strokeWidth={2.5} />
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </motion.button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
