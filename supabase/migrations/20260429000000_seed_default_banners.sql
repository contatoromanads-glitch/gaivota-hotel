-- Seed banner padrão da homepage se ainda não existir
INSERT INTO public.banners (page, title, subtitle, image_url, is_active, display_order, cta_text, cta_url)
SELECT
  'home',
  'Seu Refúgio na Terra dos Garimpos e das Bacias Leiteiras',
  'Conforto e hospitalidade em Eldorado dos Carajás — onde a história da mineração encontra a riqueza do campo.',
  '',
  true,
  0,
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM public.banners WHERE page = 'home'
);

-- Seed banner padrão da página Quartos se ainda não existir
INSERT INTO public.banners (page, title, subtitle, image_url, is_active, display_order, cta_text, cta_url)
SELECT
  'quartos',
  'Nossas Acomodações',
  'Conforto e privacidade para a sua estadia em Eldorado dos Carajás.',
  '',
  true,
  0,
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM public.banners WHERE page = 'quartos'
);