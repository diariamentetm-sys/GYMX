import { motion } from "motion/react";
import { useRef, useState, useId } from "react";
import { useInView } from "motion/react";
import { useNavigate } from "react-router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowRight, TrendingUp } from "lucide-react";

const data = [
  { month: "Abr 25", members: 184 },
  { month: "Mai 25", members: 195 },
  { month: "Jun 25", members: 212 },
  { month: "Jul 25", members: 228 },
  { month: "Ago 25", members: 245 },
  { month: "Set 25", members: 267 },
  { month: "Out 25", members: 289 },
  { month: "Nov 25", members: 312 },
  { month: "Dez 25", members: 338 },
  { month: "Jan 26", members: 365 },
  { month: "Fev 26", members: 398 },
  { month: "Mar 26", members: 420 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-900 border border-neutral-700 rounded-md p-3">
        <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
          {payload[0].payload.month}
        </p>
        <p className="text-white font-display text-2xl font-black">
          {payload[0].value}
        </p>
        <p className="text-neutral-400 text-xs">membros ativos</p>
      </div>
    );
  }
  return null;
};

export function MemberGrowthChart() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [period, setPeriod] = useState("Últimos 12 meses");
  const gradientId = useId();

  const firstValue = data[0].members;
  const lastValue = data[data.length - 1].members;
  const growth = lastValue - firstValue;
  const growthPercentage = ((growth / firstValue) * 100).toFixed(0);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6 hover:border-yellow-400/50 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-display text-3xl font-black uppercase text-white">
              +{growth} MEMBROS
            </h3>
            <div className="flex items-center gap-1 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded">
              <TrendingUp size={14} className="text-green-400" strokeWidth={2.5} />
              <span className="text-green-400 font-bold text-sm">
                +{growthPercentage}%
              </span>
            </div>
          </div>
          <p className="text-neutral-500 text-sm">
            Crescimento nos últimos 12 meses
          </p>
        </div>

        {/* Period Selector */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="
            bg-neutral-800
            border border-neutral-700
            text-neutral-300
            text-sm
            px-3 py-2
            rounded
            focus:outline-none
            focus:border-yellow-400
            cursor-pointer
          "
        >
          <option>Últimos 6 meses</option>
          <option>Últimos 12 meses</option>
          <option>Últimos 24 meses</option>
        </select>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="w-full h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E5C000" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E5C000" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2E2E2E"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#888888"
              style={{
                fontSize: "11px",
                fontFamily: "Inter, sans-serif",
              }}
              tick={{ fill: "#888888" }}
            />
            <YAxis
              stroke="#888888"
              style={{
                fontSize: "11px",
                fontFamily: "Inter, sans-serif",
              }}
              tick={{ fill: "#888888" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#E5C000" }} />
            <Area
              type="monotone"
              dataKey="members"
              stroke="#E5C000"
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              animationDuration={2000}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
        <p className="text-neutral-500 text-sm">
          Base atual: <span className="text-white font-semibold">{lastValue} membros</span>
        </p>
        <button
          onClick={() => navigate("/dashboard/alunos")}
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-semibold uppercase tracking-wide"
        >
          Ver todos os membros
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  );
}
