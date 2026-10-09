import { MapPin, Clock, Phone } from "lucide-react";

interface BusinessHeaderProps {
  name: string;
  description?: string;
  address?: string;
  workingHours?: string;
  phone?: string;
  coverUrl?: string;
  logoUrl?: string;
}

export function BusinessHeader({
  name,
  description,
  address,
  workingHours,
  phone,
  coverUrl,
  logoUrl,
}: BusinessHeaderProps) {
  return (
    <div className="bg-white">
      {/* ===== موبایل ===== */}
      <div className="md:hidden">
        <div className="relative h-48 w-full overflow-hidden rounded-b-[2rem]">
          {coverUrl ? (
            <img src={coverUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-bl from-[#1a1a1a] to-[#3d3d3d]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="flex justify-center -mt-12 relative z-10">
          <div className="w-24 h-24 rounded-full bg-white shadow-lg border-4 border-white overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#F5F0E8] flex items-center justify-center text-[#8B7355] font-bold text-xl">
                L
              </div>
            )}
          </div>
        </div>

        <div className="px-5 pt-3 pb-4 text-center">
          <h1 className="text-xl font-black text-[#1a1a1a]">{name}</h1>
          {description && (
            <p className="mt-2 text-sm text-[#6B6B6B] leading-relaxed max-w-sm mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* ===== دسکتاپ (مثل عکس ویندوز) ===== */}
      <div className="hidden md:block border-b border-[#F0EBE3]">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-start gap-6">
            {/* لوگو */}
            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-[#F5F0E8] flex-shrink-0 border border-[#EDE5D8]">
              {logoUrl ? (
                <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#8B7355] font-black text-2xl">
                  L
                </div>
              )}
            </div>

            {/* متن */}
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="text-2xl font-black text-[#1a1a1a]">{name}</h1>
              {description && (
                <p className="mt-2 text-sm text-[#6B6B6B] leading-relaxed max-w-xl">
                  {description}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#5C4A3A]">
                {address && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C4A574]" />
                    {address}
                  </span>
                )}
                {workingHours && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C4A574]" />
                    {workingHours}
                  </span>
                )}
                {phone && (
                  <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 hover:text-[#1a1a1a]">
                    <Phone className="w-3.5 h-3.5 text-[#C4A574]" />
                    {phone}
                  </a>
                )}
              </div>
            </div>

            {/* تصویر سمت راست */}
            <div className="w-56 h-36 rounded-2xl overflow-hidden flex-shrink-0 hidden lg:block border border-[#EDE5D8]">
              {coverUrl ? (
                <img src={coverUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#F5F0E8]" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}