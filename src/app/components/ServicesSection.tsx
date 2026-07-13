import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    {
      title: "BOXING CLASSES",
      image:
        "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: "MUSCLE BUILDING",
      image:
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: "YOGA & PILATES",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-32 bg-neutral-900"
      id="services"
    >
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-orange-500 text-lg">✦</span>
            <span className="text-orange-500 text-xs font-semibold uppercase tracking-widest">
              Our Services
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black uppercase">
            Discover Fitness{" "}
            <span className="text-yellow-400">Services</span>
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group relative aspect-[3/4] overflow-hidden rounded-none cursor-pointer"
            >
              {/* Image */}
              <ImageWithFallback
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-display text-3xl font-black uppercase text-white leading-tight">
                  {service.title}
                </h3>
              </div>

              {/* Decorative Element (visible on hover) */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute top-8 right-8 w-12 h-12 border-2 border-yellow-400 rounded-full flex items-center justify-center"
              >
                <span className="text-yellow-400 text-xl">→</span>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-500 text-white px-10 py-4 rounded font-semibold uppercase text-sm tracking-wide transition-colors hover:bg-orange-700"
          >
            View All Services
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
