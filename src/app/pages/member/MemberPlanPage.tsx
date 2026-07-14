import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Check,
  PauseCircle,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { MemberLayout } from "../../components/member/MemberLayout";
import { RequireMemberAccess } from "../../components/auth/RequireMemberAccess";
import { PlanCard, PaymentModal } from "../../components/member/PlanCard";
import { useAuth } from "../../contexts/AuthContext";
import {
  SUBSCRIPTION_STATUS_LABELS,
  CANCELLATION_NOTICE_DAYS,
  FREEZE_DAYS_PER_CYCLE,
} from "../../constants/subscriptions";
import {
  contractPlan,
  fetchGymPlans,
  fetchMemberSubscription,
  fetchPendingPayment,
  processPayment,
  requestCancellation,
  requestDowngrade,
  requestFreeze,
  requestUpgrade,
  simulateCancellation,
  toggleAutoRenew,
} from "../../services/subscriptionService";
import type { GymPlan, MemberSubscription, SubscriptionPayment } from "../../types/subscription";
import {
  formatCurrency,
  formatDateBR,
  getFreezeDaysAvailable,
} from "../../utils/subscriptionCalculations";

type ModalMode = "contract" | "upgrade" | "payment" | null;

export default function MemberPlanPage() {
  const { session } = useAuth();
  const [plans, setPlans] = useState<GymPlan[]>([]);
  const [subscription, setSubscription] = useState<MemberSubscription | null>(null);
  const [pendingPayment, setPendingPayment] = useState<SubscriptionPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [selectedPlan, setSelectedPlan] = useState<GymPlan | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentTitle, setPaymentTitle] = useState("");

  const [freezeDays, setFreezeDays] = useState("30");
  const [freezeReason, setFreezeReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);

  const memberId = session?.user.id;

  const loadData = async () => {
    if (!memberId) return;
    setLoading(true);
    const [plansData, subData, payData] = await Promise.all([
      fetchGymPlans(),
      fetchMemberSubscription(memberId),
      fetchPendingPayment(memberId),
    ]);
    setPlans(plansData);
    setSubscription(subData);
    setPendingPayment(payData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [memberId]);

  const hasActivePlan =
    subscription &&
    ["ativo", "congelado", "cancelamento_agendado", "inadimplente"].includes(
      subscription.status
    );

  const handleSelectPlan = async (plan: GymPlan, mode: "contract" | "upgrade" | "downgrade") => {
    if (!memberId) return;
    setError("");
    setMessage("");

    if (mode === "contract") {
      setSelectedPlan(plan);
      setModalMode("contract");
      return;
    }

    if (mode === "upgrade") {
      setActionLoading(true);
      const result = await requestUpgrade(memberId, plan.id);
      setActionLoading(false);

      if (result.error) {
        setError(result.error);
        return;
      }

      setPendingPayment(result.payment ?? null);
      setPaymentAmount(result.prorata ?? 0);
      setPaymentTitle("Pagamento de upgrade (pro rata)");
      setModalMode("payment");
      return;
    }

    if (mode === "downgrade") {
      const withinLoyalty =
        subscription?.loyaltyEnd &&
        new Date(subscription.loyaltyEnd) > new Date();

      if (withinLoyalty) {
        const confirmDowngrade = window.confirm(
          "Seu plano possui fidelidade vigente. O downgrade no próximo ciclo pode gerar ajustes conforme contrato. Deseja continuar?"
        );
        if (!confirmDowngrade) return;
      }

      setActionLoading(true);
      const result = await requestDowngrade(memberId, plan.id);
      setActionLoading(false);

      if (!result.success) {
        setError(result.error ?? "Erro no downgrade.");
        return;
      }

      setMessage(
        `Downgrade agendado para ${formatDateBR(result.effectiveDate ?? "")}. Benefícios atuais mantidos até lá.`
      );
      await loadData();
    }
  };

  const handleConfirmContract = async () => {
    if (!memberId || !selectedPlan) return;

    setActionLoading(true);
    const result = await contractPlan(memberId, selectedPlan.id);
    setActionLoading(false);

    if (result.error) {
      setError(result.error);
      setModalMode(null);
      return;
    }

    setPendingPayment(result.payment ?? null);
    setPaymentAmount(selectedPlan.monthlyPrice);
    setPaymentTitle("Primeira mensalidade / matrícula");
    setModalMode("payment");
    await loadData();
  };

  const handlePayment = async (approved: boolean) => {
    if (!pendingPayment) return;

    setActionLoading(true);
    await processPayment(pendingPayment.id, approved);
    setActionLoading(false);
    setModalMode(null);

    if (approved) {
      setMessage("Pagamento aprovado. Plano ativado com sucesso!");
    } else {
      setMessage("Pagamento recusado. O plano permanece pendente por até 24h.");
    }

    await loadData();
  };

  const handleFreeze = async () => {
    if (!memberId || !subscription?.plan) return;

    const days = Number(freezeDays);
    const available = getFreezeDaysAvailable(subscription, subscription.plan);

    if (days > available) {
      setError(
        `Saldo insuficiente (${available} dias). Anexe atestado médico na recepção para prazo estendido.`
      );
      return;
    }

    setActionLoading(true);
    const result = await requestFreeze(memberId, days, freezeReason);
    setActionLoading(false);

    if (!result.success) {
      setError(result.error ?? "Erro ao solicitar trancamento.");
      return;
    }

    setMessage(`Trancamento de ${days} dias ativado. Check-in e cobranças suspensos.`);
    await loadData();
  };

  const handleCancel = async () => {
    if (!memberId || !subscription?.plan) return;

    setActionLoading(true);
    const result = await requestCancellation(memberId, cancelReason);
    setActionLoading(false);

    if (!result.success) {
      setError(result.error ?? "Erro ao solicitar cancelamento.");
      return;
    }

    setShowCancelForm(false);
    setMessage(
      `Cancelamento agendado. Acesso mantido por ${CANCELLATION_NOTICE_DAYS} dias. Encerramento em ${formatDateBR(result.simulation?.effectiveDate ?? "")}.`
    );
    await loadData();
  };

  const handleToggleRenew = async () => {
    if (!memberId || !subscription) return;
    await toggleAutoRenew(memberId, !subscription.autoRenew);
    setMessage(
      subscription.autoRenew
        ? "Renovação automática desativada."
        : "Renovação automática ativada."
    );
    await loadData();
  };

  const cancelSimulation =
    subscription?.plan && showCancelForm
      ? simulateCancellation(subscription, subscription.plan, subscription.outstandingBalance)
      : null;

  if (loading) {
    return (
      <RequireMemberAccess>
        <MemberLayout title="Meu Plano" subtitle="Assinatura, pagamentos e renovação">
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </MemberLayout>
      </RequireMemberAccess>
    );
  }

  return (
    <RequireMemberAccess>
      <MemberLayout title="Meu Plano" subtitle="Assinatura, pagamentos e renovação">
        {message && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-md p-4 text-green-400 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-orange-500/10 border border-orange-500/30 rounded-md p-4 text-orange-400 text-sm">
            {error}
          </div>
        )}

        {pendingPayment && subscription?.status === "pendente_pagamento" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-yellow-400/10 border border-yellow-400/30 rounded-md p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-yellow-400 font-semibold text-sm">Pagamento pendente</p>
              <p className="text-neutral-400 text-xs mt-1">
                Válido por 24h. Após isso a solicitação é cancelada automaticamente.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPaymentAmount(pendingPayment.amount);
                setPaymentTitle("Confirmar pagamento");
                setModalMode("payment");
              }}
              className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-md text-xs font-bold uppercase"
            >
              Pagar {formatCurrency(pendingPayment.amount)}
            </button>
          </motion.div>
        )}

        {subscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-br from-neutral-900 to-neutral-800 border border-yellow-400/30 rounded-md p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                  Plano vigente
                </p>
                <h2 className="font-display text-3xl font-black text-white">
                  {subscription.plan?.name ?? subscription.planId}
                </h2>
                <p className="text-yellow-400 font-bold mt-1">
                  {formatCurrency(subscription.monthlyPrice)}/mês
                </p>
              </div>
              <span className="bg-neutral-800 text-yellow-400 text-xs font-bold uppercase px-3 py-1 rounded-full">
                {SUBSCRIPTION_STATUS_LABELS[subscription.status]}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              {subscription.loyaltyStart && (
                <div className="bg-neutral-800/50 rounded-md p-3">
                  <p className="text-neutral-500 text-xs">Fidelidade</p>
                  <p className="text-white">
                    {formatDateBR(subscription.loyaltyStart)} —{" "}
                    {subscription.loyaltyEnd ? formatDateBR(subscription.loyaltyEnd) : "—"}
                  </p>
                </div>
              )}
              {subscription.nextBillingDate && (
                <div className="bg-neutral-800/50 rounded-md p-3">
                  <p className="text-neutral-500 text-xs">Próxima cobrança</p>
                  <p className="text-white">{formatDateBR(subscription.nextBillingDate)}</p>
                </div>
              )}
              {subscription.scheduledPlan && (
                <div className="bg-neutral-800/50 rounded-md p-3">
                  <p className="text-neutral-500 text-xs">Downgrade agendado</p>
                  <p className="text-white">
                    {subscription.scheduledPlan.name} em{" "}
                    {subscription.scheduledChangeAt
                      ? formatDateBR(subscription.scheduledChangeAt)
                      : "—"}
                  </p>
                </div>
              )}
              {subscription.status === "congelado" && subscription.freezeEnd && (
                <div className="bg-neutral-800/50 rounded-md p-3">
                  <p className="text-neutral-500 text-xs">Trancamento até</p>
                  <p className="text-white">{formatDateBR(subscription.freezeEnd)}</p>
                </div>
              )}
              {subscription.status === "cancelamento_agendado" &&
                subscription.cancellationEffectiveAt && (
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-md p-3">
                    <p className="text-orange-400 text-xs">Encerramento em</p>
                    <p className="text-white">
                      {formatDateBR(subscription.cancellationEffectiveAt)}
                    </p>
                  </div>
                )}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleRenew}
                className={`flex items-center gap-2 text-xs font-semibold uppercase px-3 py-2 rounded-md border transition-colors ${
                  subscription.autoRenew
                    ? "border-green-500/50 text-green-400"
                    : "border-neutral-600 text-neutral-400"
                }`}
              >
                <RefreshCw size={14} />
                Renovação automática: {subscription.autoRenew ? "Ativa" : "Desativada"}
              </button>
            </div>
          </motion.div>
        )}

        {!hasActivePlan && (
          <section className="mb-10">
            <h3 className="text-white font-bold uppercase text-sm tracking-wide mb-4">
              Contratar plano
            </h3>
            <p className="text-neutral-400 text-sm mb-6">
              Exibimos valor, periodicidade, benefícios e fidelidade antes da confirmação.
              {profile?.parQStatus === "encaminhar_avaliacao" &&
                " O plano será ativado administrativamente, mas treinos automáticos permanecem bloqueados até avaliação do PAR-Q."}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  featured={plan.id === "plus"}
                  actionLabel="Contratar"
                  onSelect={() => handleSelectPlan(plan, "contract")}
                />
              ))}
            </div>
          </section>
        )}

        {subscription?.status === "ativo" && (
          <>
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-yellow-400" size={18} />
                <h3 className="text-white font-bold uppercase text-sm tracking-wide">
                  Upgrade
                </h3>
              </div>
              <p className="text-neutral-400 text-sm mb-4">
                Upgrade aplica benefícios imediatamente com cobrança pro rata do período restante.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans
                  .filter((p) => p.monthlyPrice > (subscription.monthlyPrice ?? 0))
                  .map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      actionLabel="Fazer upgrade"
                      onSelect={() => handleSelectPlan(plan, "upgrade")}
                      disabled={actionLoading}
                    />
                  ))}
              </div>
            </section>

            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="text-neutral-400" size={18} />
                <h3 className="text-white font-bold uppercase text-sm tracking-wide">
                  Downgrade
                </h3>
              </div>
              <p className="text-neutral-400 text-sm mb-4">
                Mudança aplicada apenas no próximo ciclo, sem reembolso do período já pago.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans
                  .filter((p) => p.monthlyPrice < (subscription.monthlyPrice ?? 0))
                  .map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      actionLabel="Agendar downgrade"
                      onSelect={() => handleSelectPlan(plan, "downgrade")}
                      disabled={actionLoading}
                    />
                  ))}
              </div>
            </section>

            <section className="mb-10 bg-neutral-900 border border-neutral-700 rounded-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <PauseCircle className="text-blue-400" size={18} />
                <h3 className="text-white font-bold uppercase text-sm tracking-wide">
                  Congelamento (trancamento)
                </h3>
              </div>
              <p className="text-neutral-400 text-sm mb-4">
                Até {FREEZE_DAYS_PER_CYCLE} dias por ciclo contratual. Suspende cobranças e
                check-in. Saldo disponível:{" "}
                {subscription.plan
                  ? getFreezeDaysAvailable(subscription, subscription.plan)
                  : 0}{" "}
                dias.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={freezeDays}
                  onChange={(e) => setFreezeDays(e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 rounded-md px-4 py-3 text-white text-sm"
                  placeholder="Dias"
                />
                <input
                  type="text"
                  value={freezeReason}
                  onChange={(e) => setFreezeReason(e.target.value)}
                  className="sm:col-span-2 bg-neutral-800 border border-neutral-700 rounded-md px-4 py-3 text-white text-sm"
                  placeholder="Motivo do trancamento"
                />
              </div>
              <button
                type="button"
                disabled={actionLoading || !freezeReason.trim()}
                onClick={handleFreeze}
                className="mt-4 bg-blue-500/20 text-blue-400 border border-blue-500/30 px-6 py-3 rounded-md text-sm font-bold uppercase hover:bg-blue-500/30 disabled:opacity-50"
              >
                Solicitar trancamento
              </button>
            </section>
          </>
        )}

        {subscription &&
          ["ativo", "congelado", "inadimplente"].includes(subscription.status) && (
            <section className="bg-neutral-900 border border-red-500/20 rounded-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="text-red-400" size={18} />
                <h3 className="text-white font-bold uppercase text-sm tracking-wide">
                  Cancelamento
                </h3>
              </div>

              {!showCancelForm ? (
                <button
                  type="button"
                  onClick={() => setShowCancelForm(true)}
                  className="text-red-400 border border-red-500/30 px-6 py-3 rounded-md text-sm font-bold uppercase hover:bg-red-500/10"
                >
                  Solicitar cancelamento
                </button>
              ) : (
                <div className="space-y-4">
                  {cancelSimulation && (
                    <div className="bg-neutral-800 rounded-md p-4 text-sm space-y-2">
                      <p className="text-neutral-300 font-semibold">Simulação rescisória</p>
                      <div className="grid grid-cols-2 gap-2 text-neutral-400 text-xs">
                        <span>Saldo restante (pro rata):</span>
                        <span className="text-white text-right">
                          {formatCurrency(cancelSimulation.remainingBalance)}
                        </span>
                        <span>Multa ({cancelSimulation.penaltyPercent}%):</span>
                        <span className="text-orange-400 text-right">
                          {formatCurrency(cancelSimulation.penaltyAmount)}
                        </span>
                        <span>Aviso prévio:</span>
                        <span className="text-white text-right">
                          {cancelSimulation.noticeDays} dias
                        </span>
                        <span>Encerramento efetivo:</span>
                        <span className="text-white text-right">
                          {formatDateBR(cancelSimulation.effectiveDate)}
                        </span>
                        {cancelSimulation.outstandingBalance > 0 && (
                          <>
                            <span>Débito pendente:</span>
                            <span className="text-orange-400 text-right">
                              {formatCurrency(cancelSimulation.outstandingBalance)}
                            </span>
                          </>
                        )}
                      </div>
                      {cancelSimulation.withinLoyalty && (
                        <p className="text-orange-400 text-xs flex items-start gap-1">
                          <AlertTriangle size={12} className="mt-0.5" />
                          Cancelamento dentro do período de fidelidade — multa aplicável.
                        </p>
                      )}
                    </div>
                  )}

                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Motivo do cancelamento (opcional)"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-4 text-white text-sm min-h-[80px]"
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={handleCancel}
                      className="bg-red-500 text-white px-6 py-3 rounded-md text-sm font-bold uppercase hover:bg-red-400 disabled:opacity-50"
                    >
                      Confirmar cancelamento
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCancelForm(false)}
                      className="text-neutral-400 px-6 py-3 text-sm"
                    >
                      Voltar
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

        {modalMode === "contract" && selectedPlan && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-neutral-900 border border-neutral-700 rounded-md p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="font-display text-2xl font-black text-white mb-2">
                Confirmar {selectedPlan.name}
              </h3>
              <p className="text-neutral-400 text-sm mb-4">{selectedPlan.description}</p>

              <div className="bg-neutral-800 rounded-md p-4 mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Valor mensal</span>
                  <span className="text-yellow-400 font-bold">
                    {formatCurrency(selectedPlan.monthlyPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Fidelidade</span>
                  <span className="text-white">{selectedPlan.loyaltyMonths} meses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Horário</span>
                  <span className="text-white">{selectedPlan.scheduleLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Congelamento</span>
                  <span className="text-white">
                    até {selectedPlan.freezeDaysPerCycle} dias/ciclo
                  </span>
                </div>
              </div>

              <ul className="space-y-1 mb-6">
                {selectedPlan.benefits.map((b) => (
                  <li key={b} className="text-neutral-300 text-xs flex items-center gap-2">
                    <Check size={12} className="text-yellow-400" /> {b}
                  </li>
                ))}
              </ul>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleConfirmContract}
                  className="flex-1 bg-yellow-400 text-yellow-900 py-3 rounded-md font-bold uppercase text-sm hover:bg-yellow-300 disabled:opacity-50"
                >
                  Confirmar contratação
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="text-neutral-400 px-4"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {modalMode === "payment" && pendingPayment && (
          <PaymentModal
            amount={paymentAmount}
            title={paymentTitle}
            description="Ao aprovar, o plano será ativado e o acesso liberado (check-in, aulas, etc.)."
            onApprove={() => handlePayment(true)}
            onReject={() => handlePayment(false)}
            onClose={() => setModalMode(null)}
            isLoading={actionLoading}
          />
        )}
      </MemberLayout>
    </RequireMemberAccess>
  );
}