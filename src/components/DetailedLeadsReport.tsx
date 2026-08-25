import { useState, useMemo } from "react";
import { Lead } from "@/types/lead";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  Flame, 
  Clock, 
  Sparkles, 
  MessageSquareOff, 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  UserCheck, 
  Phone, 
  FileText, 
  Download
} from "lucide-react";

interface DetailedLeadsReportProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

type ReportCategory = 
  | "ALL"
  | "IMMEDIATE"
  | "FUTURE"
  | "DISCOVERY"
  | "UNANSWERED"
  | "CLIENT_OR_BLOCKED"
  | "REFUND";

export function DetailedLeadsReport({ leads, onSelectLead }: DetailedLeadsReportProps) {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Helper para categorizar cada lead
  const categorizedLeads = useMemo(() => {
    return leads.map((lead) => {
      const notes = (lead.notes || "").toLowerCase();
      const status = lead.status;

      let category: ReportCategory = "UNANSWERED";
      let categoryLabel = "Recebeu e Não Respondeu";
      let categoryBadgeClass = "bg-slate-500/10 text-slate-400 border-slate-500/20";
      let actionRecommendation = "Aguardar abertura orgânica ou reativar em nova esteira de nutrição.";

      if (status === "REEMBOLSO") {
        category = "REFUND";
        categoryLabel = "Reembolso";
        categoryBadgeClass = "bg-rose-500/10 text-rose-400 border-rose-500/20";
        actionRecommendation = "Tratar protocolo de suporte/reembolso.";
      } else if (status === "BLOQUEADO" || notes.includes("aluno") || notes.includes("bloqueado")) {
        category = "CLIENT_OR_BLOCKED";
        categoryLabel = notes.includes("aluno") ? "Cliente Ativo (Já Aluno)" : "Contato Bloqueado";
        categoryBadgeClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        actionRecommendation = "Isolado de vendas. Apenas relacionamento e suporte da comunidade.";
      } else if (
        status === "CALL_AGENDADA" || 
        status === "NEGOCIACAO" || 
        notes.includes("venda imediata") || 
        notes.includes("alto interesse") ||
        notes.includes("call agendada")
      ) {
        category = "IMMEDIATE";
        categoryLabel = status === "CALL_AGENDADA" ? "Call Agendada / Fechamento" : "Venda Imediata / Negociação";
        categoryBadgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-sm shadow-amber-500/10";
        actionRecommendation = status === "CALL_AGENDADA" 
          ? "Conduzir reunião consultiva e focar na dor de processos/automação."
          : "Enviar proposta ou áudio de 45s tirando as dúvidas solicitadas.";
      } else if (status === "CONTATO_FUTURO" || notes.includes("contato futuro")) {
        category = "FUTURE";
        categoryLabel = "Contato Futuro / Nutrição";
        categoryBadgeClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
        actionRecommendation = notes.includes("preço")
          ? "Não forçar agora. Reativar em 30 dias com parcelamento em 12x ou plano de entrada."
          : "Reativar em 10 a 15 dias com pílula de conteúdo ou case de 1 min.";
      } else if (status === "RESPONDEU" || notes.includes("em descoberta")) {
        category = "DISCOVERY";
        categoryLabel = "Em Descoberta / Diagnóstico";
        categoryBadgeClass = "bg-purple-500/10 text-purple-400 border-purple-500/20";
        actionRecommendation = "Fazer pergunta diagnóstica: 'Qual a tarefa mais repetitiva que sua equipe perde tempo hoje?'";
      } else {
        category = "UNANSWERED";
        categoryLabel = "Recebeu Disparo (Sem Resposta)";
        categoryBadgeClass = "bg-slate-500/10 text-slate-400 border-slate-500/20";
        actionRecommendation = "Impactado pelo vídeo de 1 min. Em silêncio/observação. Manter na régua de disparos.";
      }

      return {
        ...lead,
        calculatedCategory: category,
        categoryLabel,
        categoryBadgeClass,
        actionRecommendation,
      };
    });
  }, [leads]);

  // Contagens por categoria
  const counts = useMemo(() => {
    return {
      all: categorizedLeads.length,
      immediate: categorizedLeads.filter(l => l.calculatedCategory === "IMMEDIATE").length,
      future: categorizedLeads.filter(l => l.calculatedCategory === "FUTURE").length,
      discovery: categorizedLeads.filter(l => l.calculatedCategory === "DISCOVERY").length,
      unanswered: categorizedLeads.filter(l => l.calculatedCategory === "UNANSWERED").length,
      clientOrBlocked: categorizedLeads.filter(l => l.calculatedCategory === "CLIENT_OR_BLOCKED").length,
      refund: categorizedLeads.filter(l => l.calculatedCategory === "REFUND").length,
    };
  }, [categorizedLeads]);

  // Filtragem dos leads
  const filteredList = useMemo(() => {
    return categorizedLeads.filter((l) => {
      const matchCat = selectedCategory === "ALL" || l.calculatedCategory === selectedCategory;
      const search = searchTerm.toLowerCase().trim();
      const matchSearch =
        !search ||
        (l.name && l.name.toLowerCase().includes(search)) ||
        (l.phone && l.phone.includes(search)) ||
        (l.occupation && l.occupation.toLowerCase().includes(search)) ||
        (l.goal && l.goal.toLowerCase().includes(search)) ||
        (l.notes && l.notes.toLowerCase().includes(search));

      return matchCat && matchSearch;
    });
  }, [categorizedLeads, selectedCategory, searchTerm]);

  // Exportar visualização detalhada em CSV
  const handleExportCSV = () => {
    const headers = [
      "Nome",
      "Telefone",
      "Categoria",
      "Status",
      "Interesse",
      "Ocupacao",
      "Objetivo",
      "Respondeu",
      "Notas e Contexto",
      "Acao Recomendada"
    ];

    const rows = filteredList.map(l => [
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.categoryLabel}"`,
      `"${l.status}"`,
      `"${l.interest}"`,
      `"${(l.occupation || '').replace(/"/g, '""')}"`,
      `"${(l.goal || '').replace(/"/g, '""')}"`,
      l.replied ? "Sim" : "Nao",
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${(l.actionRecommendation || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_detalhado_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header do Relatório com Cards de Resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card 
          onClick={() => setSelectedCategory("ALL")}
          className={`p-3.5 cursor-pointer transition-all border ${
            selectedCategory === "ALL" ? "border-primary bg-primary/10" : "hover:border-border/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Total Base</span>
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold mt-1 text-foreground">{counts.all}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">100% dos Leads</p>
        </Card>

        <Card 
          onClick={() => setSelectedCategory("IMMEDIATE")}
          className={`p-3.5 cursor-pointer transition-all border ${
            selectedCategory === "IMMEDIATE" ? "border-amber-500 bg-amber-500/10 shadow-sm shadow-amber-500/10" : "hover:border-amber-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 font-medium">Venda Agora</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold mt-1 text-amber-400">{counts.immediate}</div>
          <p className="text-[10px] text-amber-500/70 mt-0.5">Fechamento Imediato</p>
        </Card>

        <Card 
          onClick={() => setSelectedCategory("FUTURE")}
          className={`p-3.5 cursor-pointer transition-all border ${
            selectedCategory === "FUTURE" ? "border-blue-500 bg-blue-500/10" : "hover:border-blue-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-400 font-medium">Contato Futuro</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold mt-1 text-blue-400">{counts.future}</div>
          <p className="text-[10px] text-blue-400/70 mt-0.5">Preço / Tempo / Nutrição</p>
        </Card>

        <Card 
          onClick={() => setSelectedCategory("DISCOVERY")}
          className={`p-3.5 cursor-pointer transition-all border ${
            selectedCategory === "DISCOVERY" ? "border-purple-500 bg-purple-500/10" : "hover:border-purple-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-400 font-medium">Em Descoberta</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold mt-1 text-purple-400">{counts.discovery}</div>
          <p className="text-[10px] text-purple-400/70 mt-0.5">Uso Básico / Diagnóstico</p>
        </Card>

        <Card 
          onClick={() => setSelectedCategory("UNANSWERED")}
          className={`p-3.5 cursor-pointer transition-all border ${
            selectedCategory === "UNANSWERED" ? "border-slate-400 bg-slate-500/10" : "hover:border-slate-400/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium">Não Responderam</span>
            <MessageSquareOff className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold mt-1 text-slate-200">{counts.unanswered}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Impactados pelo Vídeo</p>
        </Card>

        <Card 
          onClick={() => setSelectedCategory("CLIENT_OR_BLOCKED")}
          className={`p-3.5 cursor-pointer transition-all border ${
            selectedCategory === "CLIENT_OR_BLOCKED" ? "border-emerald-500 bg-emerald-500/10" : "hover:border-emerald-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-medium">Alunos & Bloq.</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold mt-1 text-emerald-400">{counts.clientOrBlocked}</div>
          <p className="text-[10px] text-emerald-400/70 mt-0.5">Isolados de Venda</p>
        </Card>
      </div>

      {/* 2. Barra de Filtros e Busca Rápida */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-card/60 backdrop-blur">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone, dor, notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background/80 border border-input rounded-md pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Categorias Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
              selectedCategory === "ALL"
                ? "bg-primary text-primary-foreground border-primary font-medium"
                : "bg-muted/40 text-muted-foreground hover:bg-muted border-border"
            }`}
          >
            Todos ({counts.all})
          </button>
          <button
            onClick={() => setSelectedCategory("IMMEDIATE")}
            className={`px-2.5 py-1 text-xs rounded-full border transition-all flex items-center gap-1 ${
              selectedCategory === "IMMEDIATE"
                ? "bg-amber-500 text-slate-950 border-amber-500 font-bold"
                : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/30"
            }`}
          >
            <Flame className="w-3 h-3" />
            Venda Agora ({counts.immediate})
          </button>
          <button
            onClick={() => setSelectedCategory("FUTURE")}
            className={`px-2.5 py-1 text-xs rounded-full border transition-all flex items-center gap-1 ${
              selectedCategory === "FUTURE"
                ? "bg-blue-500 text-white border-blue-500 font-bold"
                : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/30"
            }`}
          >
            <Clock className="w-3 h-3" />
            Futuro ({counts.future})
          </button>
          <button
            onClick={() => setSelectedCategory("DISCOVERY")}
            className={`px-2.5 py-1 text-xs rounded-full border transition-all flex items-center gap-1 ${
              selectedCategory === "DISCOVERY"
                ? "bg-purple-500 text-white border-purple-500 font-bold"
                : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/30"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            Descoberta ({counts.discovery})
          </button>
          <button
            onClick={() => setSelectedCategory("UNANSWERED")}
            className={`px-2.5 py-1 text-xs rounded-full border transition-all flex items-center gap-1 ${
              selectedCategory === "UNANSWERED"
                ? "bg-slate-400 text-slate-950 border-slate-400 font-bold"
                : "bg-slate-500/10 text-slate-300 hover:bg-slate-500/20 border-slate-500/30"
            }`}
          >
            <MessageSquareOff className="w-3 h-3" />
            Não Responderam ({counts.unanswered})
          </button>
        </div>

        {/* Botão de Exportar */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportCSV}
          className="text-xs h-8 gap-1.5 ml-auto sm:ml-0"
        >
          <Download className="w-3.5 h-3.5" />
          Exportar Lista
        </Button>
      </Card>

      {/* 3. Lista Detalhada de Leads com Contexto Completo */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>Exibindo <strong>{filteredList.length}</strong> de {leads.length} leads</span>
          <span>Clique no card para abrir edição ou no WhatsApp para conversar</span>
        </div>

        {filteredList.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            Nenhum lead encontrado com os filtros aplicados.
          </Card>
        ) : (
          filteredList.map((lead) => {
            const cleanPhone = (lead.phoneClean || lead.phone || "").replace(/\D/g, "");
            const waUrl = `https://wa.me/${cleanPhone}`;

            return (
              <Card 
                key={lead.id} 
                className="p-4 border transition-all hover:border-primary/50 bg-card/80 hover:bg-card flex flex-col md:flex-row items-start justify-between gap-4"
              >
                {/* Coluna 1: Informações do Lead & Status */}
                <div className="space-y-2 flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 
                      onClick={() => onSelectLead(lead)}
                      className="font-bold text-base text-foreground hover:text-primary cursor-pointer transition-colors"
                    >
                      {lead.name}
                    </h3>
                    
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${lead.categoryBadgeClass}`}>
                      {lead.categoryLabel}
                    </span>

                    <Badge 
                      variant={
                        lead.interest === "QUENTE" ? "destructive" :
                        lead.interest === "ALTO" ? "warning" :
                        lead.interest === "MEDIO" ? "default" : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {lead.interest === "QUENTE" ? "🔥 Quente" :
                       lead.interest === "ALTO" ? "⚡ Alto Interesse" :
                       lead.interest === "MEDIO" ? "⏳ Médio" :
                       lead.interest === "DESQUALIFICADO" ? "🛡️ Desqualificado" : "❄️ Frio"}
                    </Badge>

                    {lead.replied && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> Respondeu
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      {lead.phone}
                    </span>
                    {lead.occupation && (
                      <span><strong>Cargo/Área:</strong> {lead.occupation}</span>
                    )}
                    {lead.goal && (
                      <span><strong>Objetivo:</strong> {lead.goal}</span>
                    )}
                  </div>

                  {/* Diagnóstico & Contexto Real */}
                  <div className="p-2.5 rounded-md bg-muted/40 border border-border/60 text-xs space-y-1">
                    <div className="font-semibold text-foreground/90 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      Diagnóstico & Contexto do Lead:
                    </div>
                    <p className="text-muted-foreground leading-relaxed pl-5">
                      {lead.notes || "Sem observações adicionais."}
                    </p>
                  </div>

                  {/* Próximo Passo Recomendado */}
                  <div className="text-xs flex items-start gap-1.5 text-amber-400/90 font-medium">
                    <span className="text-primary font-bold">🎯 Próxima Ação:</span>
                    <span>{lead.actionRecommendation}</span>
                  </div>
                </div>

                {/* Coluna 2: Botões de Ação Rápida */}
                <div className="flex flex-row md:flex-col items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button 
                      size="sm" 
                      className="w-full text-xs h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      WhatsApp
                    </Button>
                  </a>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectLead(lead)}
                    className="w-full text-xs h-8"
                  >
                    Ver CRM
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
