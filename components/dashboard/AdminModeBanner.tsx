export function AdminModeBanner({
  businessName,
  businessId,
}: {
  businessName: string;
  businessId: string;
}) {
  return (
    <div
      className="bg-[#0B1B33] text-white rounded-2xl p-3 mb-4 flex items-center justify-between gap-3"
      dir="rtl"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 animate-pulse" />
        <span className="text-xs md:text-sm truncate">
          حالت مدیر — در حال ویرایش{" "}
          <span className="font-bold text-[#D4AF37]">{businessName}</span>
        </span>
      </div>
      <a
        href={`/admin/business/${businessId}`}
        className="shrink-0 h-8 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition"
      >
        بازگشت
      </a>
    </div>
  );
}