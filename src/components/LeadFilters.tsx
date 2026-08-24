import React from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LeadFiltersState } from "@/types/lead";
import { Search, X } from "lucide-react";

interface LeadFiltersProps {
  filters: LeadFiltersState;
  onFilterChange: (newFilters: LeadFiltersState) => void;
  totalFiltered: number;
  totalLeads: number;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  filters,
  onFilterChange,
  totalFiltered,
  totalLeads,
}) => {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.batchType !== "ALL" ||
    filters.status !== "ALL" ||
    filters.interest !== "ALL" ||
    filters.occupation !== "ALL";

  const clearFilters = () => {
    onFilterChange({
      search: "",
      batchType: "ALL",
      status: "ALL",
      interest: "ALL",
      occupation: "ALL",
      goal: "ALL",
    });
  };

  return (
    <div className="bg-card/70 border border-border/80 rounded-xl p-4 space-y-3 shadow-sm">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, telefone, ocupação ou meta..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="pl-9 bg-background/50 border-input h-9 text-xs"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Counter & Clear Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xs text-muted-foreground">
            Exibindo <strong className="text-foreground">{totalFiltered}</strong> de{" "}
            <strong>{totalLeads}</strong> contatos
          </span>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 gap-1"
            >
              <X className="h-3 w-3" />
              Limpar Filtros
            </Button>
          )}
        </div>
      </div>

      {/* Filter Selects Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-border/40 text-xs">
        {/* 1. Lote */}
        <div>
          <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Lote da Campanha</label>
          <select
            value={filters.batchType}
            onChange={(e) => onFilterChange({ ...filters, batchType: e.target.value })}
            className="w-full h-8 rounded-lg border border-input bg-background/80 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
          >
            <option value="ALL">Todos os Lotes</option>
            <option value="tipo_a">Lote 2 (Novos Tipo A)</option>
            <option value="lote_1">Lote 1 (Oferta R$1.000 OFF)</option>
            <option value="b2b">🏢 B2B (gruporap.com.br)</option>
            <option value="bloqueado">Excluídos / Bloqueados</option>
          </select>
        </div>

        {/* 2. Status */}
        <div>
          <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Status do Lead</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full h-8 rounded-lg border border-input bg-background/80 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
          >
            <option value="ALL">Todos os Status</option>
            <option value="CALL_AGENDADA">🚀 Call Agendada</option>
            <option value="NEGOCIACAO">🔥 Em Negociação</option>
            <option value="RESPONDEU">💬 Respondeu</option>
            <option value="CONTATO_FUTURO">⏳ Contato Futuro / Nutrição</option>
            <option value="ENTREGUE">📬 Entregue (Aguardando)</option>
            <option value="B2B_EMPRESAS">🏢 B2B - Empresas</option>
            <option value="REEMBOLSO">💸 Reembolso Solicitado</option>
            <option value="FECHADO">✅ Venda Fechada</option>
            <option value="SEM_RESPOSTA">Sem Resposta</option>
            <option value="BLOQUEADO">🚫 Bloqueado</option>
          </select>
        </div>

        {/* 3. Nível de Interesse */}
        <div>
          <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Termômetro de Interesse</label>
          <select
            value={filters.interest}
            onChange={(e) => onFilterChange({ ...filters, interest: e.target.value })}
            className="w-full h-8 rounded-lg border border-input bg-background/80 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
          >
            <option value="ALL">Todos os Interesses</option>
            <option value="QUENTE">🚀 Quente / Fechando</option>
            <option value="ALTO">🔥 Alto Interesse</option>
            <option value="MEDIO">⚡ Médio Interesse</option>
            <option value="BAIXO">❄️ Baixo Interesse</option>
            <option value="DESQUALIFICADO">🚫 Desqualificado</option>
          </select>
        </div>

        {/* 4. Ocupação */}
        <div>
          <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Perfil Profissional</label>
          <select
            value={filters.occupation}
            onChange={(e) => onFilterChange({ ...filters, occupation: e.target.value })}
            className="w-full h-8 rounded-lg border border-input bg-background/80 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
          >
            <option value="ALL">Todas as Ocupações</option>
            <option value="B2B - gruporap.com.br">🏢 B2B - gruporap.com.br</option>
            <option value="Tenho meu próprio negócio">Tenho meu próprio negócio</option>
            <option value="CLT em empresa">CLT em empresa</option>
            <option value="Freelancer / autônomo">Freelancer / autônomo</option>
            <option value="Em transição de carreira">Em transição de carreira</option>
            <option value="Profissional">Profissional / Outro</option>
          </select>
        </div>
      </div>
    </div>
  );
};
