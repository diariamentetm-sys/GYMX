import { BrowserRouter, Routes, Route } from "react-router";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/alunos" element={<AlunosPage />} />
        <Route path="/dashboard/alunos/novo" element={<NewStudentPage />} />
        <Route path="/dashboard/alunos/:id" element={<StudentDetailPage />} />
        <Route path="/dashboard/alunos/:id/editar" element={<EditStudentPage />} />
        <Route path="/dashboard/checkins" element={<CheckinsPage />} />
        <Route path="/dashboard/treinos" element={<TreinosPage />} />
        <Route path="/dashboard/config" element={<ConfiguracoesPage />} />
        <Route path="/modo-recepcao" element={<ModoRecepcaoPage />} />
      </Routes>
    </BrowserRouter>
  );
}