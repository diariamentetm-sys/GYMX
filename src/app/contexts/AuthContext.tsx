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
  signOutMember,
} from "../services/memberService";

interface AuthContextValue {
  session: Session | null;
  profile: MemberProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{
    profile: MemberProfile | null;
    error?: string;
  }>;
  signUp: (data: RegisterFormData) => Promise<{
    profile: MemberProfile | null;
    error?: string;
  }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);

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
  }, []);

  const value = useMemo(
    () => ({
      session,
      profile,
      loading,
      refreshProfile,
      signIn,
      signUp,
      signOut,
    }),
    [session, profile, loading, refreshProfile, signIn, signUp, signOut]
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
