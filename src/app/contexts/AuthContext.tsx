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
import type { StaffProfile } from "../types/staff";
import type { OperatorProfile } from "../types/operator";
import {
  loadMemberProfile,
  registerMember,
  signInMember,
  signOutMember,
} from "../services/memberService";
import { loadStaffProfile, registerStaffAccount, startStaffMemberDemo } from "../services/staffService";
import { loadOperatorProfile } from "../services/operatorService";

interface SignInResult {
  profile: MemberProfile | null;
  staff: StaffProfile | null;
  operator: OperatorProfile | null;
  error?: string;
}

interface AuthContextValue {
  session: Session | null;
  profile: MemberProfile | null;
  staffProfile: StaffProfile | null;
  operatorProfile: OperatorProfile | null;
  loading: boolean;
  isPasswordRecovery: boolean;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signUp: (data: RegisterFormData) => Promise<{
    profile: MemberProfile | null;
    sessionCreated?: boolean;
    error?: string;
  }>;
  signUpStaff: (input: {
    fullName: string;
    email: string;
    password: string;
  }) => Promise<{ staff: StaffProfile | null; error?: string }>;
  signOut: () => Promise<void>;
  clearPasswordRecovery: () => void;
  enterMemberDemo: (mode: "portal" | "onboarding") => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadAccount(userId: string) {
  const [staff, profile, operator] = await Promise.all([
    loadStaffProfile(userId),
    loadMemberProfile(userId),
    loadOperatorProfile(userId),
  ]);
  return { staff, profile, operator };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [staffProfile, setStaffProfile] = useState<StaffProfile | null>(null);
  const [operatorProfile, setOperatorProfile] = useState<OperatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  const applyAccount = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      setStaffProfile(null);
      setOperatorProfile(null);
      return;
    }

    const account = await loadAccount(userId);
    setStaffProfile(account.staff);
    setProfile(account.profile);
    setOperatorProfile(account.operator);
  }, []);

  const refreshProfile = useCallback(async () => {
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

    await applyAccount(currentSession?.user.id);
  }, [applyAccount]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(initialSession);
      if (initialSession?.user) {
        const account = await loadAccount(initialSession.user.id);
        if (!mounted) return;
        setStaffProfile(account.staff);
        setProfile(account.profile);
        setOperatorProfile(account.operator);
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
        const account = await loadAccount(nextSession.user.id);
        setStaffProfile(account.staff);
        setProfile(account.profile);
        setOperatorProfile(account.operator);
      } else {
        setStaffProfile(null);
        setProfile(null);
        setOperatorProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<SignInResult> => {
    const result = await signInMember(email, password);
    if (result.error) {
      return { profile: null, staff: null, operator: null, error: result.error };
    }

    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

    if (!currentSession?.user) {
      return { profile: null, staff: null, operator: null, error: "Falha ao autenticar." };
    }

    const account = await loadAccount(currentSession.user.id);
    setStaffProfile(account.staff);
    setProfile(account.profile);
    setOperatorProfile(account.operator);
    return account;
  }, []);

  const signUp = useCallback(async (data: RegisterFormData) => {
    const result = await registerMember(data);
    if (result.profile) {
      setProfile(result.profile);
      setStaffProfile(null);
      setOperatorProfile(null);
    }
    return result;
  }, []);

  const signUpStaff = useCallback(
    async (input: { fullName: string; email: string; password: string }) => {
      const result = await registerStaffAccount(input);
      if (result.staff) {
        setStaffProfile(result.staff);
        setProfile(null);
        setOperatorProfile(null);
      }
      return result;
    },
    []
  );

  const signOut = useCallback(async () => {
    await signOutMember();
    setProfile(null);
    setStaffProfile(null);
    setOperatorProfile(null);
    setSession(null);
    setIsPasswordRecovery(false);
  }, []);

  const enterMemberDemo = useCallback(
    async (mode: "portal" | "onboarding") => {
      const result = await startStaffMemberDemo(mode);
      if (!result.success) {
        return { error: result.error };
      }
      await refreshProfile();
      return {};
    },
    [refreshProfile]
  );

  const clearPasswordRecovery = useCallback(() => {
    setIsPasswordRecovery(false);
  }, []);

  const value = useMemo(
    () => ({
      session,
      profile,
      staffProfile,
      operatorProfile,
      loading,
      isPasswordRecovery,
      refreshProfile,
      signIn,
      signUp,
      signUpStaff,
      signOut,
      clearPasswordRecovery,
      enterMemberDemo,
    }),
    [
      session,
      profile,
      staffProfile,
      operatorProfile,
      loading,
      isPasswordRecovery,
      refreshProfile,
      signIn,
      signUp,
      signUpStaff,
      signOut,
      clearPasswordRecovery,
      enterMemberDemo,
    ]
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
