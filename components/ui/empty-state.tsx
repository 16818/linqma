import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-[#F5F0E8] flex items-center justify-center mb-4 text-4xl">
        {icon}
      </div>
      <h3 className="text-base font-bold text-[#0F172A] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[#64748B] max-w-xs mb-5 leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="h-11 px-6 rounded-2xl bg-[#D4AF37] text-white font-bold text-sm cursor-pointer hover:bg-[#C4A034] transition shadow-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}