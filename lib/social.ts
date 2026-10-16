export type SocialNetwork =
  | "instagram"
  | "telegram"
  | "whatsapp"
  | "rubika"
  | "eitaa"
  | "bale";

export function toSocialHref(
  network: SocialNetwork,
  raw?: string | null
): string | null {
  if (!raw?.trim()) return null;
  const v = raw.trim();

  if (/^https?:\/\//i.test(v)) return v;

  const user = v.replace(/^@/, "").replace(/\s/g, "");

  switch (network) {
    case "instagram":
      return `https://instagram.com/${user}`;

    case "telegram":
      return `https://t.me/${user}`;

    case "whatsapp": {
      const phone = user.replace(/[^\d]/g, "");
      const normalized = phone.startsWith("0")
        ? `98${phone.slice(1)}`
        : phone;
      return `https://wa.me/${normalized}`;
    }

    case "rubika":
      if (v.includes(".") || v.includes("/")) {
        return v.startsWith("http") ? v : `https://${v}`;
      }
      return `https://rubika.ir/${user}`;

    case "eitaa":
      return `https://eitaa.com/${user}`;

    case "bale":
      return `https://ble.ir/${user}`;

    default:
      return null;
  }
}