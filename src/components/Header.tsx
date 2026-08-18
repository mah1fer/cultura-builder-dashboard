import React, { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Download, Upload, RotateCcw, PhoneCall } from "lucide-react";
import { Lead } from "@/types/lead";

interface HeaderProps {
  leads: Lead[];
  onOpenExport: () => void;
  onReset: () => void;
  onImport: (leads: Lead[]) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExport,
  onReset,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImport(json);
          alert("Base importada com sucesso!");
        } else {
          alert("O arquivo selecionado não contém uma lista válida de leads.");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo JSON.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <header className="border-b border-border/80 bg-card/60 backdrop-blur-xl sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-bold text-lg">
            CB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-foreground tracking-tight">
                Cultura Builder
              </h1>
              <Badge variant="success" className="gap-1 text-[11px] py-0 px-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CRM de Disparos
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Gestão de Contatos, Respostas, Interesse e Funil Comercial
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-1.5 text-xs h-8"
            title="Importar backup JSON"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Importar</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenExport}
            className="gap-1.5 text-xs h-8"
            title="Exportar base para CSV ou JSON"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Exportar</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-1.5 text-xs h-8 text-muted-foreground hover:text-foreground"
            title="Restaurar base original"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Restaurar</span>
          </Button>

          <div className="h-5 w-[1px] bg-border mx-1 hidden sm:block" />

          <a
            href="https://web.whatsapp.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">WhatsApp Web</span>
          </a>
        </div>
      </div>
    </header>
  );
};
