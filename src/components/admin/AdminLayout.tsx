import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, BedDouble, Star, Image, Settings, FileText,
  LogOut, Menu, X, ChevronRight
} from "lucide-react";
import logoGaivota from "@/assets/logo-gaivota.png";

const navItems = [
  { label: "Início", path: "/admin", icon: LayoutDashboard, hint: "Visão geral" },
  { label: "Quartos", path: "/admin/quartos", icon: BedDouble, hint: "Editar quartos e fotos" },
  { label: "Banners", path: "/admin/banners", icon: Image, hint: "Imagens de topo" },
  { label: "Avaliações", path: "/admin/avaliacoes", icon: Star, hint: "Depoimentos de hóspedes" },
  { label: "Textos do site", path: "/admin/conteudo", icon: FileText, hint: "Editar conteúdo" },
  { label: "Contatos", path: "/admin/contatos", icon: Settings, hint: "Telefone, e-mail, endereço" },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoGaivota} alt="Gaivota Hotel" className="h-8 w-auto" />
              <span className="font-display font-bold text-sm">Admin</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div>{item.label}</div>
                    <div className={`text-[10px] font-normal leading-tight ${active ? "text-primary-foreground/80" : "text-muted-foreground/70"}`}>
                      {item.hint}
                    </div>
                  </div>
                  {active && <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t space-y-2">
            <p className="text-xs text-muted-foreground truncate px-3">{user?.email}</p>
            <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">
              <ChevronRight className="w-4 h-4" /> Ver site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b px-4 py-3 flex items-center gap-3 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-display font-bold text-lg">
            {navItems.find((i) => i.path === location.pathname)?.label || "Admin"}
          </h1>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
