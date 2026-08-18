import React, { useState } from "react";
import { Lead, LeadStatus, InterestLevel } from "@/types/lead";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";
import { PhoneCall, ChevronLeft, ChevronRight, Eye, Building2 } from "lucide-react";

interface LeadTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onUpdateInterest: (id: string, interest: InterestLevel) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  onSelectLead,
  onUpdateStatus,
  onUpdateInterest,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const totalPages = Math.ceil(leads.length / itemsPerPage) || 1;
  const paginatedLeads = leads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-card/70 border border-border/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 border-b border-border/80 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Lead / Contato</th>
              <th className="py-3 px-4">Área & Meta (Hub)</th>
              <th className="py-3 px-4">Lote / Origem</th>
              <th className="py-3 px-4">Status & Resposta</th>
              <th className="py-3 px-4">Interesse</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground">
                  Nenhum contato encontrado com os filtros aplicados.
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => {
                const isB2B =
                  lead.status === "B2B_EMPRESAS" ||
                  lead.batchType === "b2b" ||
                  lead.occupation.includes("B2B") ||
                  (lead.notes && lead.notes.includes("gruporap"));

                return (
                  <tr
                    key={lead.id}
                    className={`hover:bg-muted/30 transition-colors group cursor-pointer ${
                      isB2B ? "bg-violet-950/10 hover:bg-violet-950/20" : ""
                    }`}
                    onClick={() => onSelectLead(lead)}
                  >
                    {/* Lead Info */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-foreground text-sm group-hover:text-emerald-400 transition-colors">
                            {lead.name}
                          </span>
                          {isB2B && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/40">
                              <Building2 className="h-2.5 w-2.5" />
                              B2B
                            </span>
                          )}
                        </div>
                        <span className="text-muted-foreground font-mono text-[11px] mt-0.5">
                          {lead.phone}
                        </span>
                      </div>
                    </td>

                    {/* Occupation & Goal */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex flex-col">
                        <span
                          className={`text-[11px] truncate ${
                            isB2B ? "font-semibold text-violet-300" : "font-medium text-foreground"
                          }`}
                          title={lead.occupation}
                        >
                          {lead.occupation}
                        </span>
                        <span className="text-muted-foreground text-[10px] truncate mt-0.5" title={lead.goal}>
                          {lead.goal}
                        </span>
                      </div>
                    </td>

                    {/* Batch & Timestamp */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span
                          className={`text-[11px] ${
                            isB2B ? "font-semibold text-violet-300" : "font-medium text-foreground"
                          }`}
                        >
                          {lead.batch}
                        </span>
                        <span className="text-muted-foreground text-[10px] mt-0.5">
                          {lead.sentAt ? formatDateTime(lead.sentAt) : "Não enviado"}
                        </span>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                        className={`border text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring font-medium ${
                          lead.status === "B2B_EMPRESAS"
                            ? "bg-violet-950/50 border-violet-500/50 text-violet-200"
                            : lead.status === "BLOQUEADO"
                            ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
                            : "bg-background/80 border-input text-foreground"
                        }`}
                      >
                        <option value="ENTREGUE">Entregue</option>
                        <option value="RESPONDEU">Respondeu</option>
                        <option value="NEGOCIACAO">Em Negociação</option>
                        <option value="CALL_AGENDADA">Call Agendada</option>
                        <option value="FECHADO">Venda Fechada</option>
                        <option value="B2B_EMPRESAS">🏢 B2B - Empresas</option>
                        <option value="SEM_RESPOSTA">Sem Resposta</option>
                        <option value="BLOQUEADO">Bloqueado</option>
                      </select>
                    </td>

                    {/* Interest Selector */}
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.interest}
                        onChange={(e) => onUpdateInterest(lead.id, e.target.value as InterestLevel)}
                        className="bg-background/80 border border-input text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring text-foreground font-medium"
                      >
                        <option value="ALTO">🔥 Alto</option>
                        <option value="MEDIO">⚡ Médio</option>
                        <option value="BAIXO">❄️ Baixo</option>
                        <option value="DESQUALIFICADO">🚫 Desqualificado</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-emerald-400"
                          onClick={() => onSelectLead(lead)}
                          title="Ver Detalhes e Mensagens"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {lead.status !== "BLOQUEADO" && lead.status !== "B2B_EMPRESAS" && (
                          <a
                            href={`https://wa.me/${lead.phoneClean}`}
                            target="_blank"
                            rel="noreferrer"
                            className="h-8 w-8 rounded-md inline-flex items-center justify-center bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                            title="Abrir no WhatsApp Web"
                          >
                            <PhoneCall className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-border/60 bg-muted/20 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          Página <strong className="text-foreground">{currentPage}</strong> de{" "}
          <strong className="text-foreground">{totalPages}</strong> ({leads.length} resultados)
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8 text-xs gap-1"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Anterior
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-8 text-xs gap-1"
          >
            Próxima
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
