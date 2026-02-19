import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NavTooltipProps {
  visible: boolean;
  label: string;
  badge?: number;
}

export function NavTooltip({ visible, label, badge }: NavTooltipProps) {
  if (!visible) return null;

  return (
    <div
      role="tooltip"
      className={cn(
        "pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2",
        "flex items-center gap-2",
        "rounded-lg border border-border bg-popover px-3 py-1.5",
        "text-sm font-medium text-popover-foreground",
        "shadow-soft-md",
        "opacity-0 scale-95 transition-all duration-150",
        "group-hover:opacity-100 group-hover:scale-100",
        "group-focus-within:opacity-100 group-focus-within:scale-100"
      )}
    >
      {label}
      {badge ? (
        <Badge variant="default" className="h-4 min-w-4 px-1 text-[9px]">
          {badge}
        </Badge>
      ) : null}
    </div>
  );
}
