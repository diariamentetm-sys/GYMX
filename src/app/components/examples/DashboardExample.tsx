import { motion } from "motion/react";
import {
  StatCard,
  DashboardCard,
  SectionHeader,
  AnimatedButton,
  Badge,
} from "../index";

/**
 * Exemplo de página de Dashboard
 *
 * Este é um template/exemplo de como criar uma página de dashboard
 * usando os componentes do design system GymX.
 *
 * Para usar:
 * 1. Copie este arquivo
 * 2. Renomeie para sua página (ex: MembersDashboard.tsx)
 * 3. Customize o conteúdo
 */

export function DashboardExample() {
  // Dados de exemplo - substitua com dados reais da API
  const stats = [
    {
      label: "Total Members",
      value: "2,543",
      trend: { value: "+12.5%", isPositive: true },
    },
    {
      label: "Active Today",
      value: "842",
      trend: { value: "+8.2%", isPositive: true },
    },
    {
      label: "Revenue",
      value: "$45,230",
      trend: { value: "-2.4%", isPositive: false },
    },
    {
      label: "New Signups",
      value: "127",
      trend: { value: "+18.7%", isPositive: true },
    },
  ];

  const recentActivities = [
    { member: "João Silva", activity: "Check-in", time: "2 min ago" },
    { member: "Maria Santos", activity: "New Signup", time: "15 min ago" },
    { member: "Pedro Costa", activity: "Payment", time: "1 hour ago" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 py-24 px-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <SectionHeader
            eyebrow="Dashboard"
            title="Overview Analytics"
            highlightWord="Analytics"
            align="left"
          />

          <div className="flex gap-4">
            <Badge variant="primary">Today</Badge>
            <AnimatedButton variant="outline" size="sm">
              Export Data
            </AnimatedButton>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart Card */}
            <DashboardCard title="Member Growth">
              <div className="h-[300px] flex items-center justify-center text-neutral-500">
                {/* Aqui você pode adicionar um gráfico usando Recharts */}
                <div className="text-center">
                  <p className="mb-2">Chart placeholder</p>
                  <p className="text-xs">Use Recharts para visualizações de dados</p>
                </div>
              </div>
            </DashboardCard>

            {/* Activity List */}
            <DashboardCard title="Recent Activity">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between py-3 border-b border-neutral-700 last:border-0"
                  >
                    <div>
                      <p className="text-white font-medium">{activity.member}</p>
                      <p className="text-neutral-300 text-sm">{activity.activity}</p>
                    </div>
                    <span className="text-neutral-500 text-xs">
                      {activity.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </DashboardCard>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <DashboardCard title="Quick Actions">
              <div className="space-y-3">
                <AnimatedButton variant="primary" size="sm" fullWidth>
                  Add New Member
                </AnimatedButton>
                <AnimatedButton variant="secondary" size="sm" fullWidth>
                  Schedule Class
                </AnimatedButton>
                <AnimatedButton variant="outline" size="sm" fullWidth>
                  View Reports
                </AnimatedButton>
              </div>
            </DashboardCard>

            {/* Status */}
            <DashboardCard title="System Status">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300 text-sm">API Status</span>
                  <Badge variant="primary" size="sm">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300 text-sm">Database</span>
                  <Badge variant="primary" size="sm">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300 text-sm">Last Backup</span>
                  <span className="text-neutral-500 text-xs">2h ago</span>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* Bottom Section */}
        <DashboardCard title="Performance Metrics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-neutral-300 text-sm mb-2">Class Attendance</p>
              <p className="font-display text-4xl font-black text-yellow-400">
                87%
              </p>
            </div>
            <div className="text-center">
              <p className="text-neutral-300 text-sm mb-2">Member Satisfaction</p>
              <p className="font-display text-4xl font-black text-yellow-400">
                4.8/5
              </p>
            </div>
            <div className="text-center">
              <p className="text-neutral-300 text-sm mb-2">Retention Rate</p>
              <p className="font-display text-4xl font-black text-yellow-400">
                92%
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

/**
 * NOTAS DE USO:
 *
 * 1. DADOS REAIS
 *    - Substitua os arrays de exemplo por chamadas à API
 *    - Use React Query ou SWR para cache e loading states
 *
 * 2. CHARTS
 *    - Instale recharts (já instalado)
 *    - Importe: LineChart, BarChart, etc.
 *    - Use cores do design system: #E5C000, #FF5A1A
 *
 * 3. LOADING STATES
 *    - Use <LoadingSpinner /> durante carregamento
 *    - Adicione skeleton screens para melhor UX
 *
 * 4. ERROR HANDLING
 *    - Adicione error boundaries
 *    - Mostre mensagens de erro claras
 *
 * 5. RESPONSIVIDADE
 *    - Todos os componentes já são responsivos
 *    - Teste em mobile, tablet e desktop
 *
 * 6. ACESSIBILIDADE
 *    - Adicione labels ARIA adequados
 *    - Garanta contraste de cores
 *    - Navegação por teclado
 */
