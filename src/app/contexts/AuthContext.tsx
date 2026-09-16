import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { MemberProfile, RegisterFormData } from "../types/member";
import {
  loadMemberProfile,
  registerMember,
  signInMember,
  signInWithGoogle as startGoogleSignIn,
  signOutMember,
} from "../services/memberService";

interface AuthContextValue {
  session: Session | null;
  profile: MemberProfile | null;
  loading: boolean;
  isPasswordRecovery: boolean;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{
    profile: MemberProfile | null;
    error?: string;
  }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signUp: (data: RegisterFormData) => Promise<{
    profile: MemberProfile | null;
    sessionCreated?: boolean;
    error?: string;
  }>;
  signOut: () => Promise<void>;
  clearPasswordRecovery: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  const refreshProfile = useCallback(async () => {
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

    if (!currentSession?.user) {
      setProfile(null);
      return;
    }

    const memberProfile = await loadMemberProfile(currentSession.user.id);
    setProfile(memberProfile);
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(initialSession);

      if (initialSession?.user) {
        const memberProfile = await loadMemberProfile(initialSession.user.id);
        if (mounted) setProfile(memberProfile);
      }

      if (mounted) setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      setSession(nextSession);

      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true);
      }

      if (event === "SIGNED_OUT") {
        setIsPasswordRecovery(false);
      }

      if (nextSession?.user) {
        const memberProfile = await loadMemberProfile(nextSession.user.id);
        setProfile(memberProfile);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await signInMember(email, password);
    if (result.profile) {
      setProfile(result.profile);
    }
    return result;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    return startGoogleSignIn();
  }, []);

  const signUp = useCallback(async (data: RegisterFormData) => {
    const result = await registerMember(data);
    if (result.profile) {
      setProfile(result.profile);
    }
    return result;
  }, []);

  const signOut = useCallback(async () => {
    await signOutMember();
    setProfile(null);
    setSession(null);
    setIsPasswordRecovery(false);
  }, []);

  const clearPasswordRecovery = useCallback(() => {
    setIsPasswordRecovery(false);
  }, []);

  const value = useMemo(
    () => ({
      session,
      profile,
      loading,
      isPasswordRecovery,
      refreshProfile,
      signIn,
      signInWithGoogle,
      signUp,
      signOut,
      clearPasswordRecovery,
    }),
    [session, profile, loading, isPasswordRecovery, refreshProfile, signIn, signInWithGoogle, signUp, signOut, clearPasswordRecovery]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
