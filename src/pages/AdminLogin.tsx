import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import logoGaivota from "@/assets/logo-gaivota.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "reset" | "reset-sent">("login");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const err = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError("Email ou senha incorretos.");
    } else {
      navigate("/admin");
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Informe o e-mail cadastrado."); return; }
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin`,
    });
    setLoading(false);
    if (err) {
      setError("Erro ao enviar. Verifique o e-mail e tente novamente.");
    } else {
      setMode("reset-sent");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-lg border p-8">
        <div className="text-center mb-8">
          <img src={logoGaivota} alt="Gaivota Hotel" className="h-16 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold">
            {mode === "login" ? "Painel Administrativo" : "Recuperar senha"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {mode === "login" ? "Acesse para gerenciar o site" : "Enviaremos um link para o seu e-mail"}
          </p>
        </div>

        {/* Reset sent confirmation */}
        {mode === "reset-sent" && (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto" />
            <p className="font-semibold">Link enviado!</p>
            <p className="text-sm text-muted-foreground">Verifique sua caixa de entrada e clique no link para redefinir sua senha.</p>
            <button onClick={() => setMode("login")} className="text-sm text-primary underline mt-2">
              Voltar ao login
            </button>
          </div>
        )}

        {/* Login form */}
        {mode === "login" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-semibold disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <button
              type="button"
              onClick={() => { setMode("reset"); setError(""); }}
              className="w-full text-sm text-muted-foreground hover:text-primary transition-colors text-center pt-1"
            >
              Esqueci minha senha
            </button>
          </form>
        )}

        {/* Reset password form */}
        {mode === "reset" && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">E-mail cadastrado</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-md border bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-semibold disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </button>
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); }}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors pt-1"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;