import Image from "next/image";
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
    <div className="relative">
      {/* کاور */}
      <div className="relative h-48 md:h-64 w-full overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-bl from-navy to-navy-light" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* لوگو و اطلاعات */}
      <div className="relative -mt-12 px-4 pb-4">
        <div className="flex items-end gap-4">
          <div className="w-24 h-24 rounded-3xl bg-white shadow-soft-lg border-4 border-white overflow-hidden flex-shrink-0">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={name}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-cream-dark flex items-center justify-center text-navy/40 text-xs">
                لوگو
              </div>
            )}
          </div>

          <div className="flex-1 pb-1">
            <h1 className="text-2xl font-bold text-white drop-shadow-md">
              {name}
            </h1>
            {description && (
              <p className="text-sm text-white/90 mt-0.5 line-clamp-1">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-navy/70">
          {address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
              <span>{address}</span>
            </div>
          )}
          {workingHours && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold flex-shrink-0" />
              <span>{workingHours}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold flex-shrink-0" />
              <a href={`tel:${phone}`} className="hover:text-navy">
                {phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}