export type EmojiGroup = {
  id: string;
  label: string;
  emojis: string[];
};

export const EMOJI_GROUPS: EmojiGroup[] = [
  {
    id: "all",
    label: "همه",
    emojis: ["⭐", "🔥", "❤️", "✨", "👑", "🏪", "🛒", "📦"],
  },
  {
    id: "cafe",
    label: "کافه",
    emojis: ["☕", "🍵", "🧋", "🥐", "🧁", "🍪", "🥛", "🫖"],
  },
  {
    id: "fastfood",
    label: "فست‌فود",
    emojis: ["🍕", "🍔", "🍟", "🌭", "🥪", "🌮", "🌯", "🍗"],
  },
  {
    id: "restaurant",
    label: "رستوران",
    emojis: ["🍝", "🍜", "🍲", "🍛", "🍣", "🥗", "🥘", "🍱"],
  },
  {
    id: "drinks",
    label: "نوشیدنی",
    emojis: ["🧃", "🧊", "🍹", "🍸", "💧", "🍋", "🍊", "🧉"],
  },
  {
    id: "dessert",
    label: "دسر",
    emojis: ["🍰", "🎂", "🍩", "🍦", "🍨", "🍫", "🍮", "🧇"],
  },
  {
    id: "shop",
    label: "فروشگاه",
    emojis: ["🛒", "🛍️", "📦", "🎁", "🏪", "💳", "🏷️", "📋"],
  },
  {
    id: "other",
    label: "سایر",
    emojis: ["🌿", "🌶️", "🧄", "🍄", "🥜", "🧀", "🥚", "🥑"],
  },
];