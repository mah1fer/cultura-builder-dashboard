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
  Download,
  Building2,
  User,
  Cpu,
  CheckCircle2,
  Calendar,
  Layers
} from "lucide-react";

interface DetailedLeadsReportProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

type StageCategory = 
  | "ALL"
  | "IMMEDIATE"
  | "FUTURE"
  | "DISCOVERY"
  | "UNANSWERED"
  | "CLIENT_OR_BLOCKED"
  | "REFUND";

type TypeFilter = "ALL" | "B2B_EMPRESA" | "PROFISSIONAL_INDIVIDUAL";
type MaturityFilter = "ALL" | "AVANCADO" | "INTERMEDIARIO" | "BASICO" | "INICIANTE";

export function DetailedLeadsReport({ leads, onSelectLead }: DetailedLeadsReportProps) {
  const [stageFilter, setStageFilter] = useState<StageCategory>("ALL");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [maturityFilter, setMaturityFilter] = useState<MaturityFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Processamento e enriquecimento visual de cada lead
  const categorizedLeads = useMemo(() => {
    return leads.map((lead) => {
      const notes = (lead.notes || "").toLowerCase();
      const status = lead.status;

      let category: StageCategory = "UNANSWERED";
      let categoryLabel = "Recebeu e Não Respondeu";
      let categoryBadgeClass = "bg-slate-500/10 text-slate-400 border-slate-500/20";
      let actionRecommendation = "Aguardar abertura orgânica ou reativar em nova esteira de nutrição com case rápido.";

      if (status === "REEMBOLSO") {
        category = "REFUND";
        categoryLabel = "Reembolso";
        categoryBadgeClass = "bg-rose-500/10 text-rose-400 border-rose-500/20";
        actionRecommendation = "Tratar protocolo de suporte e cancelamento.";
      } else if (status === "BLOQUEADO" || notes.includes("aluno") || notes.includes("bloqueado")) {
        category = "CLIENT_OR_BLOCKED";
        categoryLabel = notes.includes("aluno") ? "Cliente Ativo (Já é Aluno)" : "Contato Bloqueado";
        categoryBadgeClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        actionRecommendation = "Isolado de vendas. Apenas relacionamento e suporte institucional da comunidade.";
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
          ? "Conduzir reunião consultiva e focar no case de processos/automação interna."
          : "Enviar proposta ou áudio explicativo de 45s tirando as dúvidas solicitadas.";
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
        actionRecommendation = "Impactado pelo vídeo de 1 min. Em silêncio/observação. Manter na régua de disparos periódicos.";
      }

      // Detecção de Empresa / B2B
      const isB2B = lead.leadType === "B2B_EMPRESA" || lead.batchType === "b2b" || lead.status === "B2B_EMPRESAS";
      const leadTypeFormatted = isB2B ? "B2B / Empresa" : "Profissional Individual";

      // Detecção de Maturidade
      const maturity = lead.aiMaturity || (
        notes.includes("servidor pago") || notes.includes("hub") ? "AVANCADO" :
        notes.includes("processos") || notes.includes("claude") ? "INTERMEDIARIO" :
        notes.includes("chat") || notes.includes("gpt") ? "BASICO" :
        notes.includes("não uso") ? "INICIANTE" : "NAO_INFORMADO"
      );

      return {
        ...lead,
        calculatedCategory: category,
        categoryLabel,
        categoryBadgeClass,
        actionRecommendation,
        isB2B,
        leadTypeFormatted,
        maturityFormatted: maturity
      };
    });
  }, [leads]);

  // Contagens dinâmicas
  const counts = useMemo(() => {
    return {
      all: categorizedLeads.length,
      immediate: categorizedLeads.filter(l => l.calculatedCategory === "IMMEDIATE").length,
      future: categorizedLeads.filter(l => l.calculatedCategory === "FUTURE").length,
      discovery: categorizedLeads.filter(l => l.calculatedCategory === "DISCOVERY").length,
      unanswered: categorizedLeads.filter(l => l.calculatedCategory === "UNANSWERED").length,
      clientOrBlocked: categorizedLeads.filter(l => l.calculatedCategory === "CLIENT_OR_BLOCKED").length,
      b2b: categorizedLeads.filter(l => l.isB2B).length,
      individual: categorizedLeads.filter(l => !l.isB2B).length,
    };
  }, [categorizedLeads]);

  // Filtragem multi-dimensional
  const filteredList = useMemo(() => {
    return categorizedLeads.filter((l) => {
      // 1. Filtro de Estágio Comercial
      const matchStage = stageFilter === "ALL" || l.calculatedCategory === stageFilter;
      
      // 2. Filtro de Tipo (B2B vs Profissional)
      const matchType = 
        typeFilter === "ALL" || 
        (typeFilter === "B2B_EMPRESA" && l.isB2B) || 
        (typeFilter === "PROFISSIONAL_INDIVIDUAL" && !l.isB2B);

      // 3. Filtro de Maturidade
      const matchMaturity = 
        maturityFilter === "ALL" || 
        l.maturityFormatted === maturityFilter;

      // 4. Busca Textual
      const search = searchTerm.toLowerCase().trim();
      const matchSearch =
        !search ||
        (l.name && l.name.toLowerCase().includes(search)) ||
        (l.phone && l.phone.includes(search)) ||
        (l.occupation && l.occupation.toLowerCase().includes(search)) ||
        (l.goal && l.goal.toLowerCase().includes(search)) ||
        (l.notes && l.notes.toLowerCase().includes(search));

      return matchStage && matchType && matchMaturity && matchSearch;
    });
  }, [categorizedLeads, stageFilter, typeFilter, maturityFilter, searchTerm]);

  // Exportar visualização detalhada em CSV
  const handleExportCSV = () => {
    const headers = [
      "Nome",
      "Telefone",
      "Tipo de Lead",
      "Estagio / Categoria",
      "Maturidade em IA",
      "Status CRM",
      "Nivel de Interesse",
      "Cargo / Area",
      "Objetivo",
      "Respondeu WhatsApp",
      "Diagnostico e Contexto Real",
      "Proxima Acao Recomendada"
    ];

    const rows = filteredList.map(l => [
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.leadTypeFormatted}"`,
      `"${l.categoryLabel}"`,
      `"${l.maturityFormatted}"`,
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
    link.setAttribute("download", `diagnostico_leads_completo_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header do Relatório com Métricas Executivas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card 
          onClick={() => { setStageFilter("ALL"); setTypeFilter("ALL"); }}
          className={`p-3.5 cursor-pointer transition-all border ${
            stageFilter === "ALL" && typeFilter === "ALL" ? "border-primary bg-primary/10 shadow-sm" : "hover:border-border/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Total Base</span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold mt-1 text-foreground">{counts.all}</div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
            <span className="text-blue-400 font-semibold">{counts.b2b} B2B</span> &bull; 
            <span className="text-emerald-400 font-semibold">{counts.individual} Indiv.</span>
          </div>
        </Card>

        <Card 
          onClick={() => setStageFilter("IMMEDIATE")}
          className={`p-3.5 cursor-pointer transition-all border ${
            stageFilter === "IMMEDIATE" ? "border-amber-500 bg-amber-500/10 shadow-sm shadow-amber-500/10" : "hover:border-amber-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 font-medium">Venda Agora</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold mt-1 text-amber-400">{counts.immediate}</div>
          <p className="text-[10px] text-amber-500/70 mt-0.5">Fechamento / Reunião</p>
        </Card>

        <Card 
          onClick={() => setStageFilter("FUTURE")}
          className={`p-3.5 cursor-pointer transition-all border ${
            stageFilter === "FUTURE" ? "border-blue-500 bg-blue-500/10" : "hover:border-blue-500/50"
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
          onClick={() => setStageFilter("DISCOVERY")}
          className={`p-3.5 cursor-pointer transition-all border ${
            stageFilter === "DISCOVERY" ? "border-purple-500 bg-purple-500/10" : "hover:border-purple-500/50"
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
          onClick={() => setStageFilter("UNANSWERED")}
          className={`p-3.5 cursor-pointer transition-all border ${
            stageFilter === "UNANSWERED" ? "border-slate-400 bg-slate-500/10" : "hover:border-slate-400/50"
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
          onClick={() => setStageFilter("CLIENT_OR_BLOCKED")}
          className={`p-3.5 cursor-pointer transition-all border ${
            stageFilter === "CLIENT_OR_BLOCKED" ? "border-emerald-500 bg-emerald-500/10" : "hover:border-emerald-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-medium">Alunos & Bloq.</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold mt-1 text-emerald-400">{counts.clientOrBlocked}</div>
          <p className="text-[10px] text-emerald-400/70 mt-0.5">Isolados de Vendas</p>
        </Card>
      </div>

      {/* 2. Barra de Filtros Avançados: Tipo B2B vs Profissional, Estágio e Busca */}
      <Card className="p-4 space-y-3 bg-card/60 backdrop-blur border">
        {/* Linha 1: Busca e Ações Rápidas */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome, empresa, telefone, dor, notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background/80 border border-input rounded-md pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Filtro Segmentado por Tipo de Lead (Empresa vs Profissional) */}
          <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-lg border border-border/50">
            <button
              onClick={() => setTypeFilter("ALL")}
              className={`px-2.5 py-1 text-xs rounded-md transition-all font-medium ${
                typeFilter === "ALL" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Todos ({counts.all})
            </button>
            <button
              onClick={() => setTypeFilter("B2B_EMPRESA")}
              className={`px-2.5 py-1 text-xs rounded-md transition-all font-medium flex items-center gap-1 ${
                typeFilter === "B2B_EMPRESA" ? "bg-blue-600 text-white shadow-sm font-semibold" : "text-blue-400 hover:text-blue-300"
              }`}
            >
              <Building2 className="w-3 h-3" />
              Empresas B2B ({counts.b2b})
            </button>
            <button
              onClick={() => setTypeFilter("PROFISSIONAL_INDIVIDUAL")}
              className={`px-2.5 py-1 text-xs rounded-md transition-all font-medium flex items-center gap-1 ${
                typeFilter === "PROFISSIONAL_INDIVIDUAL" ? "bg-emerald-600 text-white shadow-sm font-semibold" : "text-emerald-400 hover:text-emerald-300"
              }`}
            >
              <User className="w-3 h-3" />
              Profissionais ({counts.individual})
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
            Exportar CSV
          </Button>
        </div>

        {/* Linha 2: Filtros de Estágio Comercial & Maturidade */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground mr-1 font-medium">Estágio:</span>
            <button
              onClick={() => setStageFilter("ALL")}
              className={`px-2.5 py-0.5 text-[11px] rounded-full border transition-all ${
                stageFilter === "ALL"
                  ? "bg-primary text-primary-foreground border-primary font-medium"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted border-border"
              }`}
            >
              Todos ({counts.all})
            </button>
            <button
              onClick={() => setStageFilter("IMMEDIATE")}
              className={`px-2.5 py-0.5 text-[11px] rounded-full border transition-all flex items-center gap-1 ${
                stageFilter === "IMMEDIATE"
                  ? "bg-amber-500 text-slate-950 border-amber-500 font-bold"
                  : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/30"
              }`}
            >
              <Flame className="w-2.5 h-2.5" />
              Venda Agora ({counts.immediate})
            </button>
            <button
              onClick={() => setStageFilter("FUTURE")}
              className={`px-2.5 py-0.5 text-[11px] rounded-full border transition-all flex items-center gap-1 ${
                stageFilter === "FUTURE"
                  ? "bg-blue-500 text-white border-blue-500 font-bold"
                  : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/30"
              }`}
            >
              <Clock className="w-2.5 h-2.5" />
              Contato Futuro ({counts.future})
            </button>
            <button
              onClick={() => setStageFilter("DISCOVERY")}
              className={`px-2.5 py-0.5 text-[11px] rounded-full border transition-all flex items-center gap-1 ${
                stageFilter === "DISCOVERY"
                  ? "bg-purple-500 text-white border-purple-500 font-bold"
                  : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/30"
              }`}
            >
              <Sparkles className="w-2.5 h-2.5" />
              Em Descoberta ({counts.discovery})
            </button>
            <button
              onClick={() => setStageFilter("UNANSWERED")}
              className={`px-2.5 py-0.5 text-[11px] rounded-full border transition-all flex items-center gap-1 ${
                stageFilter === "UNANSWERED"
                  ? "bg-slate-400 text-slate-950 border-slate-400 font-bold"
                  : "bg-slate-500/10 text-slate-300 hover:bg-slate-500/20 border-slate-500/30"
              }`}
            >
              <MessageSquareOff className="w-2.5 h-2.5" />
              Não Responderam ({counts.unanswered})
            </button>
          </div>

          {/* Filtro de Maturidade */}
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-muted-foreground mr-1">Maturidade:</span>
            <select
              value={maturityFilter}
              onChange={(e) => setMaturityFilter(e.target.value as MaturityFilter)}
              className="bg-background/80 border border-input rounded px-2 py-0.5 text-[11px] text-foreground focus:outline-none"
            >
              <option value="ALL">Todas as Maturidades</option>
              <option value="AVANCADO">⚙️ Avançado (Hub / Servidor)</option>
              <option value="INTERMEDIARIO">🛠️ Intermediário (Processos)</option>
              <option value="BASICO">💬 Básico (ChatGPT)</option>
              <option value="INICIANTE">❓ Iniciante (Não usa)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* 3. Lista Detalhada de Todos os Leads com Contexto e Conversas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>Mostrando <strong>{filteredList.length}</strong> de {leads.length} leads detalhados</span>
          <span className="hidden sm:inline">Clique no WhatsApp para abrir a conversa instantaneamente</span>
        </div>

        {filteredList.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            Nenhum lead encontrado com os filtros selecionados.
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
                {/* Coluna 1: Informações do Lead, Badges e Contexto */}
                <div className="space-y-2.5 flex-1 w-full">
                  {/* Linha 1: Nome, Tipo B2B, Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 
                      onClick={() => onSelectLead(lead)}
                      className="font-bold text-base text-foreground hover:text-primary cursor-pointer transition-colors"
                    >
                      {lead.name}
                    </h3>

                    {/* Badge Empresa vs Profissional */}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 border ${
                      lead.isB2B 
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/30" 
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}>
                      {lead.isB2B ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {lead.leadTypeFormatted}
                    </span>
                    
                    {/* Badge de Categoria Comercial */}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${lead.categoryBadgeClass}`}>
                      {lead.categoryLabel}
                    </span>

                    {/* Badge de Nível de Interesse */}
                    <Badge 
                      variant={
                        lead.interest === "QUENTE" ? "destructive" :
                        lead.interest === "ALTO" ? "warning" :
                        lead.interest === "MEDIO" ? "default" : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {lead.interest === "QUENTE" ? "🔥 Quente" :
                       lead.interest === "ALTO" ? "⚡ Alto" :
                       lead.interest === "MEDIO" ? "⏳ Médio" :
                       lead.interest === "DESQUALIFICADO" ? "🛡️ Bloqueado" : "❄️ Frio"}
                    </Badge>

                    {/* Badge de Maturidade em IA se houver */}
                    {lead.maturityFormatted !== "NAO_INFORMADO" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/50 flex items-center gap-1">
                        <Cpu className="w-2.5 h-2.5 text-primary" />
                        IA: {lead.maturityFormatted}
                      </span>
                    )}

                    {lead.replied ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> Respondeu
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-500/20 text-slate-400 font-medium flex items-center gap-1">
                        <MessageSquareOff className="w-3 h-3" /> Sem Resposta
                      </span>
                    )}
                  </div>

                  {/* Linha 2: Telefone, Cargo e Objetivo */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 text-foreground/80 font-medium">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      {lead.phone}
                    </span>
                    {lead.occupation && (
                      <span><strong>Cargo/Empresa:</strong> {lead.occupation}</span>
                    )}
                    {lead.goal && (
                      <span><strong>Objetivo:</strong> {lead.goal}</span>
                    )}
                  </div>

                  {/* Box 3: Diagnóstico, Falas Reais e Contexto */}
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-xs space-y-1.5">
                    <div className="font-semibold text-foreground/90 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      Diagnóstico Comercial & Histórico de Mensagens:
                    </div>
                    <p className="text-muted-foreground leading-relaxed pl-5 whitespace-pre-line">
                      {lead.notes || "Sem histórico de observações adicionais."}
                    </p>
                  </div>

                  {/* Linha 4: Próximo Passo Recomendado */}
                  <div className="text-xs flex items-start gap-1.5 text-amber-400/95 font-medium bg-amber-500/5 p-2 rounded border border-amber-500/15">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Próxima Ação: </strong>
                      <span>{lead.actionRecommendation}</span>
                    </div>
                  </div>
                </div>

                {/* Coluna 2: Ações Imediatas */}
                <div className="flex flex-row md:flex-col items-center gap-2 w-full md:w-40 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button 
                      size="sm" 
                      className="w-full text-xs h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Abrir WhatsApp
                    </Button>
                  </a>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectLead(lead)}
                    className="w-full text-xs h-8 gap-1"
                  >
                    <Calendar className="w-3 h-3" />
                    Ver no CRM
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
