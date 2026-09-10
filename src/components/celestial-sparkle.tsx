import { motion } from "framer-motion";

interface CelestialSparkleProps {
  className?: string;
  size?: number;
  color?: string;
  delay?: number;
  duration?: number;
  floatAmplitude?: number;
  floatDuration?: number;
}

export function FourPointSparkle({
  className = "",
  size = 20,
  color = "#ffffff",
  delay = 0,
  duration = 3.2,
  floatAmplitude = 8,
  floatDuration = 3.6,
}: CelestialSparkleProps) {
  return (
    <motion.div
      className={`pointer-events-none inline-flex items-center justify-center ${className}`}
      animate={{
        y: [-floatAmplitude, floatAmplitude, -floatAmplitude],
      }}
      transition={{
        duration: floatDuration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay * 0.3,
      }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{
          scale: [0.55, 1.15, 0.7, 1.25, 0.55],
          opacity: [0.35, 1, 0.5, 0.95, 0.35],
          rotate: [0, 6, -4, 2, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
        style={{ filter: `drop-shadow(0 0 ${size * 0.4}px ${color})` }}
      >
        <path
          d="M12 0C12 8 16 12 24 12C16 12 12 16 12 24C12 16 8 12 0 12C8 12 12 8 12 0Z"
          fill={color}
        />
        <circle cx="12" cy="12" r="2.2" fill="#ffffff" />
      </motion.svg>
    </motion.div>
  );
}

interface SparkleClusterProps {
  className?: string;
  sparkles?: Array<{
    top?: string | number;
    bottom?: string | number;
    left?: string | number;
    right?: string | number;
    size?: number;
    delay?: number;
    duration?: number;
    floatAmplitude?: number;
    color?: string;
  }>;
}

export function SparkleCluster({ className = "", sparkles = [] }: SparkleClusterProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-visible ${className}`}
      aria-hidden
    >
      {sparkles.map((sp, idx) => (
        <div
          key={idx}
          className="absolute"
          style={{
            top: sp.top,
            bottom: sp.bottom,
            left: sp.left,
            right: sp.right,
          }}
        >
          <FourPointSparkle
            size={sp.size ?? 18}
            delay={sp.delay ?? idx * 0.4}
            duration={sp.duration ?? 2.8 + (idx % 3) * 0.8}
            floatAmplitude={sp.floatAmplitude ?? 6 + (idx % 4) * 2}
            color={sp.color ?? (idx % 2 === 0 ? "#ffffff" : "#c6ccff")}
          />
        </div>
      ))}
    </div>
  );
}
