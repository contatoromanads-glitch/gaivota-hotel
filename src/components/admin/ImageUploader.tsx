import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploaderProps {
  bucket?: string;
  folder?: string;
  onUpload: (url: string) => void;
  currentImage?: string;
  onRemove?: () => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  helperText?: string;
}

export const ImageUploader = ({
  bucket = "hotel-images",
  folder = "",
  onUpload,
  currentImage,
  onRemove,
  accept = "image/*",
  maxSizeMB = 10,
  label = "Imagem",
  helperText = "Arraste uma imagem ou clique para selecionar. Máx. 10MB.",
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) return "O arquivo deve ser uma imagem (JPG, PNG, WEBP).";
    if (file.size > maxSizeMB * 1024 * 1024) return `A imagem é maior que ${maxSizeMB}MB. Reduza o tamanho.`;
    return null;
  };

  const processFile = async (file: File) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) { setError(validationError); return; }

    // Preview local
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = folder
      ? `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`
      : `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file);
    if (upErr) {
      setError("Falha ao enviar: " + upErr.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    onUpload(urlData.publicUrl);
    setUploading(false);
    setPreview(null);
    toast.success("Imagem enviada com sucesso!");
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Se já tem imagem atual, mostra preview
  if (currentImage && !preview) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-semibold flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" /> {label}
        </label>
        <div className="relative rounded-xl border overflow-hidden bg-muted/30 group">
          <img src={currentImage} alt="Preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className="cursor-pointer bg-white text-foreground px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Trocar
              <input type="file" accept={accept} className="hidden" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
            </label>
            {onRemove && (
              <button onClick={onRemove} className="bg-destructive text-destructive-foreground px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" /> Remover
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{helperText}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold flex items-center gap-1.5">
        <ImageIcon className="w-3.5 h-3.5" /> {label}
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/30"
        } ${error ? "border-destructive bg-destructive/5" : ""}`}
      >
        <input
          type="file"
          accept={accept}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Enviando imagem...</p>
          </div>
        ) : preview ? (
          <div className="flex flex-col items-center gap-2">
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
            <p className="text-sm text-muted-foreground">Enviando...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p className="text-sm text-destructive font-medium">{error}</p>
            <p className="text-xs text-muted-foreground">Clique ou arraste outra imagem</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-muted-foreground/60" />
            <p className="text-sm font-medium">Clique ou arraste uma imagem aqui</p>
            <p className="text-xs text-muted-foreground">JPG, PNG, WEBP · Máx. {maxSizeMB}MB</p>
          </div>
        )}
      </div>
      {helperText && !error && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  );
};