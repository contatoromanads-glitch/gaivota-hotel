import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthCtx {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  user: null, isAdmin: false, loading: true,
  signIn: async () => null, signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const checkAdmin = async (userId: string): Promise<boolean> => {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return !!data;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Listen ONLY — never call Supabase queries inside this callback (deadlock).
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setIsAdmin(false);
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // React to user changes outside the auth callback to safely query DB.
  useEffect(() => {
    if (user === undefined) return;
    if (!user) { setLoading(false); return; }
    let cancelled = false;
    checkAdmin(user.id).then((admin) => {
      if (cancelled) return;
      setIsAdmin(admin);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user]);

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user: user ?? null, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
