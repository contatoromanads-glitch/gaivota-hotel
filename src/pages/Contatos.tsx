import { useState } from "react";
import Layout from "@/components/Layout";
import { Phone, Mail, MapPin, Instagram, Send } from "lucide-react";
import { ReviewsCarousel } from "@/components/ReviewsSection";
import { WHATSAPP_URL } from "@/lib/constants";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqData = [
  {
    q: "O Gaivota Hotel oferece condições especiais para empresas e hospedagem de funcionários?",
    a: "Sim, o Gaivota Hotel possui condições diferenciadas e flexíveis para hospedagem corporativa e faturamento para empresas que desejam acomodar seus funcionários em Eldorado dos Carajás. Entre em contato para mais detalhes sobre nossas soluções para empresas de diversos setores e necessidades de hospedagem.",
  },
  {
    q: "O hotel está preparado para receber hóspedes a trabalho, como empresários e executivos?",
    a: "Absolutamente. Nossas acomodações são projetadas para oferecer o máximo de conforto e funcionalidade para executivos e empresários, com Wi-Fi de alta velocidade, ambientes climatizados e mesa de trabalho, garantindo uma estadia produtiva e relaxante.",
  },
  {
    q: "Qual a localização do Gaivota Hotel em relação às principais empresas e áreas de negócio em Eldorado dos Carajás?",
    a: "Estamos estrategicamente localizados no centro de Eldorado dos Carajás, com fácil acesso às principais vias e áreas de interesse comercial e industrial, ideal para quem busca hotel próximo a grandes empresas e centros de negócio na região.",
  },
  {
    q: "O café da manhã está incluído na diária e atende às necessidades de quem precisa começar o dia cedo para o trabalho?",
    a: "Sim, nosso delicioso café da manhã buffet com opções regionais está sempre incluído na diária. Servimos um desjejum completo e reforçado, perfeito para garantir a energia necessária para um dia de trabalho intenso.",
  },
  {
    q: "O hotel oferece estacionamento seguro para veículos de empresas?",
    a: "Sim, dispomos de um amplo estacionamento coberto e seguro com capacidade para 30 carros, proporcionando tranquilidade para hóspedes que viajam com veículos próprios ou da empresa.",
  },
  {
    q: "Como posso solicitar um orçamento ou fazer uma reserva para um grupo de funcionários da minha empresa?",
    a: "Para orçamentos e reservas corporativas, por favor, entre em contato diretamente pelo telefone (94) 99285-4456 ou pelo nosso formulário de contato. Nossa equipe está pronta para oferecer a melhor solução para a sua empresa.",
  },
];

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
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white text-shadow-hero mb-3 animate-fade-in-up">
            Fale Conosco
          </h1>
          <p className="text-white/85 text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>Estamos prontos para atendê-lo</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            <ScrollReveal direction="left">
              <h2 className="font-display text-2xl font-bold mb-6">Informações de Contato</h2>
              <div className="space-y-5">
                <a href="tel:+5594992854456" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reservas (WhatsApp)</p>
                    <p className="font-semibold">(94) 99285-4456</p>
                  </div>
                </a>
                <a href="mailto:gaivotahotelpara@gmail.com" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
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
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Instagram className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Instagram</p>
                    <p className="font-semibold">@gaivotahotel_eldorado</p>
                  </div>
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <h2 className="font-display text-2xl font-bold mb-6">Envie uma Mensagem</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Seu nome"
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                />
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                />
                <input
                  type="tel"
                  placeholder="Seu telefone"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                />
                <textarea
                  placeholder="Sua mensagem"
                  rows={4}
                  required
                  value={form.mensagem}
                  onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-shadow"
                />
                <button
                  type="submit"
                  className="cta-pulse flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold"
                >
                  <Send className="w-4 h-4" />
                  Enviar via WhatsApp
                </button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <ReviewsCarousel />

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-3xl">
          <ScrollReveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          </ScrollReveal>
          <ScrollReveal>
            <Accordion type="single" collapsible className="space-y-3">
              {faqData.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-xl px-5 shadow-sm">
                  <AccordionTrigger className="text-left text-sm md:text-base font-semibold hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </section>

      {/* Map */}
      <section className="h-[400px]">
        <iframe
          title="Localização Gaivota Hotel"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.123!2d-49.3541234!3d-6.1012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92d6a17f1c9b3a1d%3A0x1234567890abcdef!2sGaivota%20Hotel!5e0!3m2!1spt-BR!2sbr!4v1"
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
