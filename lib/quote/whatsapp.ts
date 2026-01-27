export const WHATSAPP_PHONE = "905537538182";

export const WHATSAPP_DEFAULT_MESSAGE =
`Merhabalar,
STL dosyam üzerinden 3D baskı üretimi hakkında bilgi almak istiyorum.
Üretim seçenekleri ve net fiyatlandırma konusunda yardımcı olabilir misiniz?`;

export function buildWhatsAppUrl(message: string) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
}
