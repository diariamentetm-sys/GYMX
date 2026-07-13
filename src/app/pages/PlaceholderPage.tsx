import { motion } from "motion/react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
}

export default function PlaceholderPage({
  title,
  subtitle,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <Sidebar />

      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 lg:px-8 py-6">
          <div className="max-w-[1600px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-display text-4xl lg:text-5xl font-black uppercase text-white mb-2">
                {title}
              </h1>
              <p className="text-neutral-500 text-sm">{subtitle}</p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="w-20 h-20 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Construction
                  className="text-yellow-400"
                  size={40}
                  strokeWidth={2}
                />
              </motion.div>
              <h2 className="font-display text-3xl font-black uppercase text-white mb-3">
                EM DESENVOLVIMENTO
              </h2>
              <p className="text-neutral-500 text-base max-w-md mx-auto">
                Esta funcionalidade está sendo desenvolvida e estará disponível
                em breve.
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
