import { useState } from "react";
import { Eye, EyeOff, Monitor, Smartphone, Tablet } from "lucide-react";

interface LivePreviewProps {
  children: React.ReactNode;
  title?: string;
}

export const LivePreview = ({ children, title = "Pré-visualização" }: LivePreviewProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const deviceWidths = { desktop: "100%", tablet: "768px", mobile: "375px" };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg">{title}</h3>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            showPreview ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          {showPreview ? <><EyeOff className="w-3.5 h-3.5" /> Ocultar preview</> : <><Eye className="w-3.5 h-3.5" /> Ver preview</>}
        </button>
      </div>

      {showPreview && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => setDevice("desktop")} className={`p-1.5 rounded ${device === "desktop" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`} title="Desktop"><Monitor className="w-4 h-4" /></button>
            <button onClick={() => setDevice("tablet")} className={`p-1.5 rounded ${device === "tablet" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`} title="Tablet"><Tablet className="w-4 h-4" /></button>
            <button onClick={() => setDevice("mobile")} className={`p-1.5 rounded ${device === "mobile" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`} title="Mobile"><Smartphone className="w-4 h-4" /></button>
          </div>
          <div className="border rounded-xl overflow-hidden bg-background">
            <div className="bg-muted/50 border-b px-3 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">Preview - {device === "desktop" ? "Desktop" : device === "tablet" ? "Tablet" : "Mobile"}</span>
            </div>
            <div className="p-4 overflow-auto" style={{ maxHeight: "500px" }}>
              <div style={{ width: deviceWidths[device], margin: "0 auto", transition: "width 0.3s" }}>
                {children}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};