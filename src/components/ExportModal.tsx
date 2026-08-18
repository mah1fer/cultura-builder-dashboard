import React from "react";
import { Lead } from "@/types/lead";
import { Button } from "@/components/ui/Button";
import { X, FileSpreadsheet, FileJson } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, leads }) => {
  if (!isOpen) return null;

  const exportCSV = () => {
    const headers = [
      "ID",
      "Nome",
      "Telefone",
      "Ocupação",
      "Meta",
      "Lote",
      "Status",
      "Interesse",
      "Respondeu",
      "Data de Envio",
      "Anotações",
    ];

    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${(l.occupation || "").replace(/"/g, '""')}"`,
      `"${(l.goal || "").replace(/"/g, '""')}"`,
      `"${l.batch}"`,
      `"${l.status}"`,
      `"${l.interest}"`,
      `"${l.replied ? "Sim" : "Não"}"`,
      `"${l.sentAt || ""}"`,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cultura_builder_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(leads, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `cultura_builder_leads_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Exportar Base de Leads</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-lg flex items-center justify-center hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Exporte os <strong>{leads.length} contatos</strong> com todos os status, anotações de conversas e histórico de mensagens.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={exportCSV}
            className="h-20 flex-col items-center justify-center gap-2 border-border/80 hover:border-emerald-500/50 hover:bg-emerald-500/5"
          >
            <FileSpreadsheet className="h-6 w-6 text-emerald-400" />
            <span className="text-xs font-semibold">Exportar CSV (Excel)</span>
          </Button>

          <Button
            variant="outline"
            onClick={exportJSON}
            className="h-20 flex-col items-center justify-center gap-2 border-border/80 hover:border-sky-500/50 hover:bg-sky-500/5"
          >
            <FileJson className="h-6 w-6 text-sky-400" />
            <span className="text-xs font-semibold">Exportar JSON</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
