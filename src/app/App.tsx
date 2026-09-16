import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthFlowRedirect } from "./components/auth/AuthFlowRedirect";
import { RequireStaff } from "./components/auth/RequireStaff";
import { StaffAccessPage } from "./pages/StaffAccessPage";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { isSupabaseConfigured } from "./lib/supabase";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { VerifyAccountPage } from "./pages/VerifyAccountPage";
import { RecoverPasswordPage } from "./pages/RecoverPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import MemberHomePage from "./pages/member/MemberHomePage";
import MemberWorkoutPage from "./pages/member/MemberWorkoutPage";
import MemberCheckinPage from "./pages/member/MemberCheckinPage";
import MemberClassesPage from "./pages/member/MemberClassesPage";
import MemberPlanPage from "./pages/member/MemberPlanPage";
import MemberProfilePage from "./pages/member/MemberProfilePage";
import { OnboardingPage } from "./pages/member/OnboardingPage";
import TermsReacceptPage from "./pages/member/TermsReacceptPage";
import DashboardPage from "./pages/DashboardPage";
import AlunosPage from "./pages/AlunosPage";
import NewStudentPage from "./pages/NewStudentPage";
import StudentDetailPage from "./pages/StudentDetailPage";
import EditStudentPage from "./pages/EditStudentPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import CheckinsPage from "./pages/CheckinsPage";
import TreinosPage from "./pages/TreinosPage";
import ModoRecepcaoPage from "./pages/ModoRecepcaoPage";

export default function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <div className="max-w-md text-center text-neutral-300">
          <h1 className="text-white font-bold text-xl mb-2">Configuração pendente</h1>
          <p className="text-sm">
            Crie o arquivo <code className="text-yellow-400">.env</code> com{" "}
            <code className="text-yellow-400">VITE_SUPABASE_URL</code> e{" "}
            <code className="text-yellow-400">VITE_SUPABASE_ANON_KEY</code>, depois reinicie o
            servidor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AppErrorBoundary>
    <AuthProvider>
      <BrowserRouter>
      <AuthFlowRedirect />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/cadastro/verificacao" element={<VerifyAccountPage />} />
        <Route path="/recuperar-senha" element={<RecoverPasswordPage />} />
        <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
        <Route path="/portal" element={<MemberHomePage />} />
        <Route path="/portal/onboarding" element={<OnboardingPage />} />
        <Route path="/portal/termos" element={<TermsReacceptPage />} />
        <Route path="/portal/treino" element={<MemberWorkoutPage />} />
        <Route path="/portal/check-in" element={<MemberCheckinPage />} />
        <Route path="/portal/aulas" element={<MemberClassesPage />} />
        <Route path="/portal/plano" element={<MemberPlanPage />} />
        <Route path="/portal/perfil" element={<MemberProfilePage />} />
        <Route path="/acesso-equipe" element={<StaffAccessPage />} />
        <Route path="/dashboard" element={<RequireStaff><DashboardPage /></RequireStaff>} />
        <Route path="/dashboard/alunos" element={<RequireStaff><AlunosPage /></RequireStaff>} />
        <Route path="/dashboard/alunos/novo" element={<RequireStaff><NewStudentPage /></RequireStaff>} />
        <Route path="/dashboard/alunos/:id" element={<RequireStaff><StudentDetailPage /></RequireStaff>} />
        <Route path="/dashboard/alunos/:id/editar" element={<RequireStaff><EditStudentPage /></RequireStaff>} />
        <Route path="/dashboard/checkins" element={<RequireStaff><CheckinsPage /></RequireStaff>} />
        <Route path="/dashboard/treinos" element={<RequireStaff><TreinosPage /></RequireStaff>} />
        <Route path="/dashboard/config" element={<RequireStaff><ConfiguracoesPage /></RequireStaff>} />
        <Route path="/modo-recepcao" element={<RequireStaff><ModoRecepcaoPage /></RequireStaff>} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
    </AppErrorBoundary>
  );
}