import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { BedDouble, Star, Image, Settings, FileText, ExternalLink, Sparkles, ArrowRight, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface CardItem {
  label: string;
  description: string;
  count: number | null;
  icon: typeof BedDouble;
  path: string;
  accent: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ rooms: 0, reviews: 0, banners: 0, content: 0 });

  useEffect(() => {
    const load = async () => {
      const [r1, r2, r3, r4] = await Promise.all([
        supabase.from("rooms").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("id", { count: "exact", head: true }),
        supabase.from("banners").select("id", { count: "exact", head: true }),
        supabase.from("page_content").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        rooms: r1.count ?? 0,
        reviews: r2.count ?? 0,
        banners: r3.count ?? 0,
        content: r4.count ?? 0,
      });
    };
    load();
  }, []);

  const cards: CardItem[] = [
    {
      label: "Quartos",
      description: "Cadastre, edite fotos, descrições e comodidades dos quartos.",
      count: stats.rooms,
      icon: BedDouble,
      path: "/admin/quartos",
      accent: "bg-primary/10 text-primary",
    },
    {
      label: "Banners",
      description: "Altere as imagens grandes (banners) e textos das páginas do site.",
      count: stats.banners,
      icon: Image,
      path: "/admin/banners",
      accent: "bg-secondary/15 text-secondary",
    },
    {
      label: "Avaliações",
      description: "Adicione ou esconda depoimentos de hóspedes exibidos no site.",
      count: stats.reviews,
      icon: Star,
      path: "/admin/avaliacoes",
      accent: "bg-accent/15 text-accent",
    },
    {
      label: "Conteúdo das páginas",
      description: "Mude títulos, parágrafos e textos espalhados pelas páginas.",
      count: stats.content,
      icon: FileText,
      path: "/admin/conteudo",
      accent: "bg-muted text-foreground",
    },
    {
      label: "Contatos e endereço",
      description: "Atualize telefone, WhatsApp, e-mail, endereço e Instagram.",
      count: null,
      icon: Settings,
      path: "/admin/contatos",
      accent: "bg-muted text-foreground",
    },
  ];

  const friendlyName = user?.email?.split("@")[0] ?? "Administrador";

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Boas-vindas */}
        <div className="bg-gradient-to-br from-primary/10 via-card to-card border rounded-2xl p-6 md:p-8 mb-6">
          <div className="flex items-start gap-3 mb-2">
            <div className="bg-primary/15 p-2 rounded-xl">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">
                Olá, {friendlyName}! 👋
              </h2>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Este é o painel de controle do site Gaivota Hotel. Tudo que você
                alterar aqui aparece automaticamente no site, em tempo real.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <a
              href="https://gaivotahotelpara.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm bg-card border px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Ver o site público
            </a>
            <Link
              to="/admin/quartos"
              className="inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              <BedDouble className="w-3.5 h-3.5" /> Editar quartos agora
            </Link>
          </div>
        </div>

        {/* Cards das seções */}
        <h3 className="font-display text-lg font-bold mb-3 px-1">O que você quer fazer hoje?</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {cards.map((c) => (
            <Link
              key={c.label}
              to={c.path}
              className="group bg-card border rounded-xl p-5 hover:shadow-lg hover:border-primary/40 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${c.accent}`}>
                  <c.icon className="w-5 h-5" />
                </div>
                {c.count !== null && (
                  <div className="text-right">
                    <div className="text-2xl font-bold leading-none">{c.count}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                      {c.count === 1 ? "item" : "itens"}
                    </div>
                  </div>
                )}
              </div>
              <h4 className="font-semibold text-base mb-1">{c.label}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{c.description}</p>
              <div className="flex items-center gap-1 text-xs font-medium text-primary mt-3 group-hover:gap-2 transition-all">
                Abrir <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>

        {/* Guia rápido */}
        <div className="bg-card border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-lg">Como usar este painel</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-foreground">📷 Para trocar uma foto</p>
              <p className="text-muted-foreground leading-relaxed">
                Vá em <strong>Quartos</strong> ou <strong>Banners</strong>, clique no
                botão de upload (ícone de seta) e escolha a imagem do seu computador.
                A foto aparece no site na hora.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">✍️ Para mudar um texto</p>
              <p className="text-muted-foreground leading-relaxed">
                Vá em <strong>Conteúdo das páginas</strong> e procure a seção que
                você quer editar. Mude o texto e clique em <em>Salvar</em>.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">🗑️ Para remover algo</p>
              <p className="text-muted-foreground leading-relaxed">
                Use o botão da <strong>lixeira</strong> ao lado do item. Vai pedir
                confirmação antes de apagar de vez. Depois disso, some também do site.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">⭐ Para esconder sem apagar</p>
              <p className="text-muted-foreground leading-relaxed">
                Use o botão do <strong>olho</strong> (em Avaliações) ou o
                <em> checkbox "Ativo"</em> (em Banners). Assim o item fica salvo mas
                não aparece no site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
