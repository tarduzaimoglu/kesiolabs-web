export const WHATSAPP_PHONE = "905537538182";

export function buildWhatsAppUrl(message: string) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
}
