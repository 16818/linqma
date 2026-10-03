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
      {/* کاور - کل تصویر دیده شود */}
      <div className="relative w-full bg-[#EFE9DF]">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={name}
            className="w-full max-h-56 md:max-h-64 object-contain object-center mx-auto"
          />
        ) : (
          <div className="w-full h-40 bg-gradient-to-bl from-[#0F172A] to-[#1E293B]" />
        )}
      </div>

      {/* لوگو کامل + اطلاعات - بدون همپوشانی مخرب */}
      <div className="px-4 pt-4 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 rounded-2xl bg-white shadow-md border border-[#EDE8DF] overflow-hidden flex-shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={name}
                className="w-full h-full object-contain bg-white"
              />
            ) : (
              <div className="w-full h-full bg-[#EFE9DF] flex items-center justify-center text-[#0F172A]/40 text-xs">
                لوگو
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-[#0F172A]">
              {name}
            </h1>
            {description && (
              <p className="text-sm text-[#0F172A]/60 mt-1">{description}</p>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-[#0F172A]/70">
          {address && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
              <span>{address}</span>
            </div>
          )}
          {workingHours && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
              <span>{workingHours}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
              <a href={`tel:${phone}`} className="hover:text-[#0F172A]">
                {phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}