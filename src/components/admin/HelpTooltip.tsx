import { useState } from "react";
import { HelpCircle, X, ChevronRight } from "lucide-react";

interface HelpTooltipProps {
  title: string;
  steps: string[];
  children?: React.ReactNode;
}

export const HelpTooltip = ({ title, steps, children }: HelpTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        {isOpen ? "Fechar ajuda" : "Como funciona?"}
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-2 w-80 bg-card border rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">{title}</h4>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-muted rounded">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <ol className="space-y-2">
            {steps.map((step, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          {children && <div className="mt-3 pt-3 border-t">{children}</div>}
        </div>
      )}
    </div>
  );
};