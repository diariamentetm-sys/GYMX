import { motion } from "motion/react";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  AlertTriangle,
  Camera,
  FileUp,
  Lock,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { MemberLayout } from "../../components/member/MemberLayout";
import { RequireMemberAccess } from "../../components/auth/RequireMemberAccess";
import { FormInput } from "../../components/FormInput";
import { formatCpf } from "../../utils/cpf";
import { useAuth } from "../../contexts/AuthContext";
import {
  confirmEmailChange,
  createLgpdRequest,
  refreshParQStatus,
  requestAccountDeletion,
  requestEmailChange,
  submitParQ,
  updateEditableProfile,
  updateMemberDocument,
} from "../../services/memberService";
import { uploadMemberPhoto, uploadMemberDocument, getMemberDocumentSignedUrl } from "../../services/storageService";
import type { LgpdRequestType, ParQStatus } from "../../types/member";
import {
  ParQForm,
  emptyParQAnswers,
  isParQComplete,
  toParQAnswers,
  type ParQFormState,
} from "../../components/member/ParQForm";

const statusLabels: Record<string, string> = {
  incompleto: "Incompleto",
  pendente_verificacao: "Pendente de verificação",
  pendente_correcao: "Pendente de correção",
  onboarding_pendente: "Onboarding pendente",
  ativo: "Ativo",
  encerramento_solicitado: "Encerramento solicitado",
};

const parQLabels: Record<ParQStatus, string> = {
  nao_preenchido: "Não preenchido",
  apto: "Apto",
  apto_com_restricao: "Apto com restrição",
  encaminhar_avaliacao: "Encaminhar avaliação",
  expirado: "Reavaliação necessária",
};

export default function MemberProfilePage() {
  const navigate = useNavigate();
  const { profile, session, signOut, refreshProfile } = useAuth();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [devEmailCode, setDevEmailCode] = useState("");
  const [lgpdType, setLgpdType] = useState<LgpdRequestType>("acesso");
  const [lgpdDescription, setLgpdDescription] = useState("");
  const [parQAnswers, setParQAnswers] = useState<ParQFormState>(emptyParQAnswers());
  const [parQStatus, setParQStatus] = useState<ParQStatus>("nao_preenchido");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setPhone(profile.phone);
    setAddress(profile.address);
    setEmergencyContact(profile.emergencyContact);
    setEmergencyPhone(profile.emergencyPhone);
    if (profile.parQ) {
      setParQAnswers({
        q1: profile.parQ.q1,
        q2: profile.parQ.q2,
        q3: profile.parQ.q3,
        q4: profile.parQ.q4,
        q5: profile.parQ.q5,
        q6: profile.parQ.q6,
        q7: profile.parQ.q7,
      });
    }
    refreshParQStatus(profile).then(setParQStatus);
  }, [profile]);

  if (!profile || !session) return null;

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    await updateEditableProfile(session.user.id, {
      phone,
      address,
      emergencyContact,
      emergencyPhone,
    });
    await refreshProfile();
    setMessage("Dados atualizados com sucesso.");
    setError("");
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setIsUploadingPhoto(true);

    const upload = await uploadMemberPhoto(session.user.id, file);

    if (upload.error || !upload.url) {
      setIsUploadingPhoto(false);
      setError(upload.error ?? "Falha ao enviar foto.");
      return;
    }

    await updateEditableProfile(session.user.id, { photoUrl: upload.url });
    await refreshProfile();
    setIsUploadingPhoto(false);
    setMessage("Foto enviada ao Supabase Storage.");
  };

  const handleDocumentReupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setIsUploadingDocument(true);

    const upload = await uploadMemberDocument(session.user.id, file);

    if (upload.error || !upload.path) {
      setIsUploadingDocument(false);
      setError(upload.error ?? "Falha ao enviar documento.");
      return;
    }

    await updateMemberDocument(session.user.id, upload.path);
    await refreshProfile();
    setIsUploadingDocument(false);
    setMessage("Documento reenviado. Status: pendente de validação.");
  };

  const handleViewDocument = async () => {
    if (!current?.documentStoragePath) return;

    const result = await getMemberDocumentSignedUrl(current.documentStoragePath);

    if (result.error || !result.url) {
      setError(result.error ?? "Não foi possível abrir o documento.");
      return;
    }

    window.open(result.url, "_blank", "noopener,noreferrer");
  };

  const handleRequestEmailChange = async () => {
    setError("");
    setMessage("");
    const result = await requestEmailChange(session.user.id, newEmail);

    if (!result.success) {
      setError(result.error ?? "Erro ao solicitar alteração.");
      return;
    }

    setDevEmailCode(result.code ?? "");
    setMessage(
      "Código registrado. O e-mail atual permanece ativo até a confirmação."
    );
  };

  const handleConfirmEmailChange = async () => {
    const result = await confirmEmailChange(session.user.id, emailCode);

    if (!result.success) {
      setError(result.error ?? "Código inválido.");
      return;
    }

    await refreshProfile();
    setMessage("E-mail alterado com sucesso.");
  };

  const handleParQSubmit = async () => {
    if (!isParQComplete(parQAnswers)) {
      setError("Responda todas as perguntas do PAR-Q.");
      return;
    }

    const result = await submitParQ(session.user.id, toParQAnswers(parQAnswers));
    await refreshProfile();
    setParQStatus(result.status);
    setMessage(`PAR-Q atualizado. Status: ${parQLabels[result.status]}.`);
  };

  const handleLgpdRequest = async () => {
    if (!lgpdDescription.trim()) {
      setError("Descreva sua solicitação LGPD.");
      return;
    }

    await createLgpdRequest(session.user.id, lgpdType, lgpdDescription);
    setLgpdDescription("");
    await refreshProfile();
    setMessage("Solicitação LGPD registrada. Prazo de resposta: até 15 dias.");
  };

  const handleDeleteAccount = async () => {
    await requestAccountDeletion(session.user.id);
    await signOut();
    navigate("/");
  };

  const current = profile;

  return (
    <RequireMemberAccess requireActive={false}>
      <MemberLayout
        title="Meu Perfil"
        subtitle="Dados pessoais, anamnese e preferências de privacidade"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-neutral-900 border border-neutral-700 rounded-md p-6 text-center"
          >
            <label className={`relative inline-block group ${isUploadingPhoto ? "cursor-wait" : "cursor-pointer"}`}>
              <div className="w-24 h-24 bg-neutral-800 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center">
                {current?.photoUrl ? (
                  <img
                    src={current.photoUrl}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="text-yellow-400" size={40} />
                )}
              </div>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                disabled={isUploadingPhoto}
                onChange={handlePhotoChange}
              />
              <span className="flex items-center justify-center gap-1 text-neutral-400 text-xs group-hover:text-yellow-400">
                <Camera size={14} />
                {isUploadingPhoto ? "Enviando..." : "Alterar foto"}
              </span>
            </label>

            <h2 className="text-white font-bold text-lg">{current?.fullName}</h2>
            <p className="text-neutral-500 text-sm">{current?.email}</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-400 text-xs font-semibold uppercase px-3 py-1 rounded-full">
              {statusLabels[current?.status ?? "ativo"]}
            </div>
            <p className="text-neutral-500 text-xs mt-4">
              PAR-Q: {parQLabels[parQStatus]}
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            onSubmit={handleSaveProfile}
            className="lg:col-span-2 bg-neutral-900 border border-neutral-700 rounded-md p-6 space-y-5"
          >
            <h3 className="text-white font-bold uppercase text-sm tracking-wide">
              Dados editáveis
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FormInput label="CPF" value={formatCpf(current?.cpf ?? "")} disabled readOnly />
                <p className="text-neutral-600 text-xs mt-1 flex items-center gap-1">
                  <Lock size={12} />
                  Alteração exige validação da recepção
                </p>
              </div>
              <div>
                <FormInput
                  label="Data de nascimento"
                  value={current?.birthDate ?? ""}
                  disabled
                  readOnly
                />
                <p className="text-neutral-600 text-xs mt-1 flex items-center gap-1">
                  <Lock size={12} />
                  Alteração exige validação da recepção
                </p>
              </div>
            </div>

            <FormInput
              label="Telefone / WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <FormInput
              label="Endereço"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormInput
                label="Contato de emergência"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
              />
              <FormInput
                label="Telefone de emergência"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
              />
            </div>

            {message && <p className="text-green-400 text-sm">{message}</p>}
            {error && <p className="text-orange-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300 transition-colors"
            >
              Salvar alterações
            </button>
          </motion.form>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 bg-neutral-900 border border-neutral-700 rounded-md p-6 space-y-4"
        >
          <h3 className="text-white font-bold uppercase text-sm tracking-wide">
            Alterar e-mail
          </h3>
          <p className="text-neutral-400 text-sm">
            O e-mail atual ({current?.email}) permanece ativo até você confirmar o novo.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Novo e-mail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleRequestEmailChange}
                className="w-full border border-neutral-600 text-neutral-300 py-3.5 rounded-md text-sm font-semibold uppercase hover:border-yellow-400 hover:text-yellow-400 transition-colors"
              >
                Enviar código
              </button>
            </div>
          </div>
          {devEmailCode && (
            <p className="text-yellow-400 text-sm font-mono">
              Código (dev): {devEmailCode}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Código de confirmação"
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value)}
            />
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleConfirmEmailChange}
                className="w-full bg-neutral-800 text-white py-3.5 rounded-md text-sm font-semibold uppercase hover:bg-neutral-700 transition-colors"
              >
                Confirmar novo e-mail
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-6 bg-neutral-900 border border-neutral-700 rounded-md p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <FileUp className="text-yellow-400" size={18} />
            <h3 className="text-white font-bold uppercase text-sm tracking-wide">
              Documento de identidade
            </h3>
          </div>

          <p className="text-neutral-400 text-sm">
            Status:{" "}
            <span className="text-white capitalize">
              {current?.documentStatus?.replace(/_/g, " ") ?? "não enviado"}
            </span>
            {current?.documentRejectionReason && (
              <span className="block text-orange-400 text-xs mt-1">
                Motivo: {current.documentRejectionReason}
              </span>
            )}
          </p>

          <div className="flex flex-wrap gap-3">
            {current?.documentStoragePath && (
              <button
                type="button"
                onClick={handleViewDocument}
                className="border border-neutral-600 text-neutral-300 px-4 py-2 rounded-md text-xs font-semibold uppercase hover:border-yellow-400 hover:text-yellow-400 transition-colors"
              >
                Visualizar documento
              </button>
            )}

            <label className={`border border-neutral-600 text-neutral-300 px-4 py-2 rounded-md text-xs font-semibold uppercase transition-colors ${
              isUploadingDocument
                ? "opacity-50 cursor-wait"
                : "cursor-pointer hover:border-yellow-400 hover:text-yellow-400"
            }`}>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                className="hidden"
                disabled={isUploadingDocument}
                onChange={handleDocumentReupload}
              />
              {isUploadingDocument ? "Enviando..." : current?.documentStoragePath ? "Reenviar documento" : "Enviar documento"}
            </label>
          </div>
        </motion.div>

        {(parQStatus === "expirado" || parQStatus === "nao_preenchido") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 bg-neutral-900 border border-orange-500/30 rounded-md p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-orange-400" size={18} />
              <h3 className="text-white font-bold uppercase text-sm tracking-wide">
                Reavaliação PAR-Q
              </h3>
            </div>
            <p className="text-neutral-400 text-sm">
              Se passaram 12 meses desde o último PAR-Q. Preencha novamente para liberar treinos.
            </p>
            <ParQForm answers={parQAnswers} onChange={setParQAnswers} />
            <button
              type="button"
              onClick={handleParQSubmit}
              className="bg-orange-500 text-white px-6 py-3 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-orange-400 transition-colors"
            >
              Enviar PAR-Q
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-neutral-900 border border-neutral-700 rounded-md p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Shield className="text-yellow-400" size={18} />
            <h3 className="text-white font-bold uppercase text-sm tracking-wide">
              Direitos LGPD
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(["acesso", "correcao", "portabilidade", "exclusao"] as LgpdRequestType[]).map(
              (type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLgpdType(type)}
                  className={`py-2 px-3 rounded-md text-xs font-semibold uppercase ${
                    lgpdType === type
                      ? "bg-yellow-400 text-yellow-900"
                      : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>

          <textarea
            value={lgpdDescription}
            onChange={(e) => setLgpdDescription(e.target.value)}
            placeholder="Descreva sua solicitação..."
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-4 text-neutral-200 text-sm min-h-[100px] focus:outline-none focus:border-yellow-400"
          />

          <button
            type="button"
            onClick={handleLgpdRequest}
            className="border border-yellow-400/50 text-yellow-400 px-6 py-3 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-400/10 transition-colors"
          >
            Registrar solicitação
          </button>

          {current && current.lgpdRequests.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-neutral-800">
              <p className="text-neutral-500 text-xs uppercase tracking-wider">
                Histórico de solicitações
              </p>
              {current.lgpdRequests.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="flex justify-between items-center text-sm bg-neutral-800 rounded-md px-4 py-2"
                >
                  <span className="text-neutral-300 capitalize">{req.type}</span>
                  <span className="text-neutral-500 text-xs">{req.status}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6 bg-neutral-900 border border-red-500/20 rounded-md p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Trash2 className="text-red-400" size={18} />
            <h3 className="text-white font-bold uppercase text-sm tracking-wide">
              Exclusão de conta
            </h3>
          </div>
          <p className="text-neutral-400 text-sm mb-4">
            A exclusão segue o fluxo de encerramento de conta (módulo 12), não apenas ocultação
            dos dados na interface.
          </p>

          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-400 border border-red-500/30 px-6 py-3 rounded-md text-sm font-semibold uppercase hover:bg-red-500/10 transition-colors"
            >
              Solicitar exclusão
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white px-6 py-3 rounded-md text-sm font-semibold uppercase hover:bg-red-400 transition-colors"
              >
                Confirmar exclusão
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="text-neutral-400 px-6 py-3 text-sm uppercase"
              >
                Cancelar
              </button>
            </div>
          )}
        </motion.div>
      </MemberLayout>
    </RequireMemberAccess>
  );
}
