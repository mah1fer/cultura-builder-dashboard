import React, { useState, useEffect } from "react";
import { Lead, LeadStatus, InterestLevel } from "@/types/lead";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";
import {
  X,
  PhoneCall,
  MessageSquare,
  Briefcase,
  Target,
  Clock,
  Save,
  CheckCircle2,
  FileText,
} from "lucide-react";

interface LeadDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onUpdateInterest: (id: string, interest: InterestLevel) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export const LeadDrawer: React.FC<LeadDrawerProps> = ({
  lead,
  onClose,
  onUpdateStatus,
  onUpdateInterest,
  onUpdateNotes,
}) => {
  const [notes, setNotes] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (lead) {
      setNotes(lead.notes || "");
      setSavedSuccess(false);
    }
  }, [lead]);

  if (!lead) return null;

  const handleSaveNotes = () => {
    onUpdateNotes(lead.id, notes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg bg-card border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">{lead.name}</h2>
              {lead.status === "B2B_EMPRESAS" || lead.batchType === "b2b" ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/40">
                  🏢 B2B Empresas
                </span>
              ) : lead.status === "REEMBOLSO" ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  💸 Reembolso
                </span>
              ) : lead.status === "BLOQUEADO" ? (
                <Badge variant="destructive">Bloqueado</Badge>
              ) : (
                <Badge variant="success">Ativo</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{lead.phone}</p>
          </div>

          <div className="flex items-center gap-2">
            {lead.status !== "BLOQUEADO" && lead.status !== "B2B_EMPRESAS" && lead.status !== "REEMBOLSO" && (
              <a
                href={`https://wa.me/${lead.phoneClean}`}
                target="_blank"
                rel="noreferrer"
                className="h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            )}
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-[11px]">
                <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
                Ocupação
              </div>
              <p className="font-semibold text-foreground text-xs">{lead.occupation}</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-[11px]">
                <Target className="h-3.5 w-3.5 text-sky-400" />
                Meta no Hub
              </div>
              <p className="font-semibold text-foreground text-xs">{lead.goal}</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-[11px]">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                Lote da Campanha
              </div>
              <p className="font-semibold text-foreground text-xs">{lead.batch}</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-[11px]">
                <Clock className="h-3.5 w-3.5 text-violet-400" />
                Data de Envio
              </div>
              <p className="font-semibold text-foreground text-xs">{formatDateTime(lead.sentAt)}</p>
            </div>
          </div>

          {/* CRM Controls (Status & Interest) */}
          <div className="p-4 rounded-xl bg-muted/20 border border-border/80 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Controles do CRM
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">
                  Status Comercial
                </label>
                <select
                  value={lead.status}
                  onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                  className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground font-medium focus:ring-1 focus:ring-ring"
                >
                  <option value="ENTREGUE">Entregue (Aguardando)</option>
                  <option value="RESPONDEU">Respondeu</option>
                  <option value="NEGOCIACAO">Em Negociação</option>
                  <option value="CALL_AGENDADA">Call Agendada</option>
                  <option value="FECHADO">Venda Fechada</option>
                  <option value="SEM_RESPOSTA">Sem Resposta</option>
                  <option value="BLOQUEADO">Bloqueado</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">
                  Termômetro de Interesse
                </label>
                <select
                  value={lead.interest}
                  onChange={(e) => onUpdateInterest(lead.id, e.target.value as InterestLevel)}
                  className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground font-medium focus:ring-1 focus:ring-ring"
                >
                  <option value="ALTO">🔥 Alto Interesse</option>
                  <option value="MEDIO">⚡ Médio Interesse</option>
                  <option value="BAIXO">❄️ Baixo Interesse</option>
                  <option value="DESQUALIFICADO">🚫 Desqualificado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Delivered Copy Blocks (Histórico dos 4 Blocos) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mensagens Disparadas no WhatsApp
              </h3>
            </div>

            {lead.deliveredBlocks && lead.deliveredBlocks.length > 0 ? (
              <div className="space-y-2.5">
                {lead.deliveredBlocks.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-emerald-400 font-semibold">
                      <span>Bloco {b.block || idx + 1}</span>
                      <span className="text-[10px] text-muted-foreground">Entregue</span>
                    </div>
                    <p className="text-foreground text-xs leading-relaxed">{b.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic p-3 border border-dashed rounded-xl">
                Nenhum bloco de mensagem registrado para este contato (Contato Bloqueado ou Não Disparado).
              </p>
            )}
          </div>

          {/* Notes & Interactions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-sky-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Anotações Comerciais
                </h3>
              </div>
              {savedSuccess && (
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Salvo!
                </span>
              )}
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Digite observações sobre o lead, o que ele respondeu, próximos passos combinados..."
              rows={4}
              className="w-full rounded-xl border border-input bg-background/80 p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none leading-relaxed"
            />

            <Button
              variant="default"
              size="sm"
              onClick={handleSaveNotes}
              className="w-full gap-1.5 text-xs h-8"
            >
              <Save className="h-3.5 w-3.5" />
              Salvar Anotações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
