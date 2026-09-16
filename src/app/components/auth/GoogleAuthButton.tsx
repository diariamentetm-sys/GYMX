import { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";

export const isGoogleAuthEnabled =
  import.meta.env.VITE_ENABLE_GOOGLE_AUTH === "true";

interface GoogleAuthButtonProps {
  disabled?: boolean;
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

export function GoogleAuthButton({ disabled = false }: GoogleAuthButtonProps) {
  const { signInWithGoogle } = useAuth();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    setError("");
    setIsStarting(true);
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
      setIsStarting(false);
    }
  };

  return (
    <div className="space-y-3">
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={disabled || isStarting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-neutral-900 border-2 border-neutral-700 text-white py-4 rounded-md font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      >
        <GoogleMark />
        {isStarting ? "Redirecionando..." : "Continuar com Google"}
      </motion.button>
      {error ? <p className="text-orange-500 text-sm text-center">{error}</p> : null}
    </div>
  );
}
