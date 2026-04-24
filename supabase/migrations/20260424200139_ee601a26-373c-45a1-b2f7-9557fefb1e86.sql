-- Habilitar REPLICA IDENTITY FULL para realtime detectar eventos DELETE corretamente.
-- Sem isso, quando o admin remove uma imagem/quarto/banner/avaliação, o site público
-- não recebe a notificação e continua exibindo o item até refresh manual.
ALTER TABLE public.rooms REPLICA IDENTITY FULL;
ALTER TABLE public.room_images REPLICA IDENTITY FULL;
ALTER TABLE public.banners REPLICA IDENTITY FULL;
ALTER TABLE public.reviews REPLICA IDENTITY FULL;
ALTER TABLE public.page_content REPLICA IDENTITY FULL;
ALTER TABLE public.site_settings REPLICA IDENTITY FULL;