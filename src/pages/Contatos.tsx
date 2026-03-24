import { useState } from "react";
import Layout from "@/components/Layout";
import { Phone, Mail, MapPin, Instagram, Send } from "lucide-react";
import { ReviewsCarousel } from "@/components/ReviewsSection";
import { WHATSAPP_URL } from "@/lib/constants";

const Contatos = () => {
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", mensagem: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Vim do site, gostaria de fazer uma reserva direta!\n\nSou ${form.nome}.\nEmail: ${form.email}\nTelefone: ${form.telefone}\n\n${form.mensagem}`
    );
    window.open(`https://wa.me/5594992854456?text=${msg}`, "_blank");
  };

  return (
    <Layout>
      <section className="relative h-[40vh] min-h-[250px] flex items-center justify-center bg-foreground">
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white text-shadow-hero mb-3">
            Fale Conosco
          </h1>
          <p className="text-white/85 text-lg">Estamos prontos para atendê-lo</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-2xl font-bold mb-6">Informações de Contato</h2>
              <div className="space-y-5">
                <a href="tel:+5594992854456" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reservas (WhatsApp)</p>
                    <p className="font-semibold">(94) 99285-4456</p>
                  </div>
                </a>
                <a href="mailto:gaivotahotelpara@gmail.com" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="font-semibold">gaivotahotelpara@gmail.com</p>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Endereço</p>
                    <p className="font-semibold">Av. São Geraldo n. 4, Centro</p>
                    <p className="text-sm text-muted-foreground">Eldorado dos Carajás, PA — CEP 68524-000</p>
                  </div>
                </div>
                <a
                  href="https://www.instagram.com/gaivotahotel_eldorado/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Instagram className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Instagram</p>
                    <p className="font-semibold">@gaivotahotel_eldorado</p>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold mb-6">Envie uma Mensagem</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Seu nome"
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="tel"
                  placeholder="Seu telefone"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <textarea
                  placeholder="Sua mensagem"
                  rows={4}
                  required
                  value={form.mensagem}
                  onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Enviar via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Carousel */}
      <ReviewsCarousel />

      {/* Map */}
      <section className="h-[400px]">
        <iframe
          title="Localização Gaivota Hotel"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.5!2d-49.354!3d-6.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92d6a1!2sGaivota+Hotel!5e0!3m2!1spt-BR!2sbr!4v1"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </Layout>
  );
};

export default Contatos;
