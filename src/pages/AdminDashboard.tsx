import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { BedDouble, Star, Image, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ rooms: 0, reviews: 0, banners: 0 });

  useEffect(() => {
    const load = async () => {
      const [r1, r2, r3] = await Promise.all([
        supabase.from("rooms").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("id", { count: "exact", head: true }),
        supabase.from("banners").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        rooms: r1.count ?? 0,
        reviews: r2.count ?? 0,
        banners: r3.count ?? 0,
      });
    };
    load();
  }, []);

  const cards = [
    { label: "Quartos", count: stats.rooms, icon: BedDouble, path: "/admin/quartos", color: "text-primary" },
    { label: "Avaliações", count: stats.reviews, icon: Star, path: "/admin/avaliacoes", color: "text-accent" },
    { label: "Banners", count: stats.banners, icon: Image, path: "/admin/banners", color: "text-secondary" },
    { label: "Configurações", count: null, icon: Settings, path: "/admin/contatos", color: "text-muted-foreground" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-2xl font-bold mb-6">Bem-vindo ao Painel</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <Link key={c.label} to={c.path} className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <c.icon className={`w-8 h-8 ${c.color}`} />
                {c.count !== null && <span className="text-3xl font-bold">{c.count}</span>}
              </div>
              <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-card border rounded-xl p-6">
          <h3 className="font-display font-semibold text-lg mb-3">Guia Rápido</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>📌 <strong>Quartos:</strong> Adicione, edite ou remova quartos com fotos e comodidades.</li>
            <li>⭐ <strong>Avaliações:</strong> Gerencie os depoimentos exibidos no site.</li>
            <li>🖼️ <strong>Banners:</strong> Troque as imagens e textos dos banners de cada página.</li>
            <li>📞 <strong>Contatos:</strong> Atualize telefone, e-mail, endereço e redes sociais.</li>
            <li>📝 <strong>Conteúdo:</strong> Edite textos das páginas Estrutura e Política.</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
