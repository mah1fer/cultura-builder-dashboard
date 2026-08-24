import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Lead } from "@/types/lead";
import { Briefcase, Target, Filter } from "lucide-react";

interface AnalyticsChartsProps {
  leads: Lead[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ leads }) => {
  // Distribuição por Ocupação
  const occupationStats = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      const occ = l.occupation || "Outro";
      counts[occ] = (counts[occ] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name,
        count,
        percent: ((count / leads.length) * 100).toFixed(1),
      }));
  }, [leads]);

  // Distribuição por Metas
  const goalStats = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      const goal = l.goal || "Geral";
      counts[goal] = (counts[goal] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name,
        count,
        percent: ((count / leads.length) * 100).toFixed(1),
      }));
  }, [leads]);

  // Funil de Conversão Comercial
  const funnelStats = useMemo(() => {
    const total = leads.filter((l) => l.status !== "BLOQUEADO").length;
    const entregues = leads.filter((l) => l.status === "ENTREGUE" || l.status === "RESPONDEU" || l.status === "NEGOCIACAO" || l.status === "CALL_AGENDADA" || l.status === "CONTATO_FUTURO" || l.status === "FECHADO").length;
    const responderam = leads.filter((l) => l.status === "RESPONDEU" || l.status === "NEGOCIACAO" || l.status === "CALL_AGENDADA" || l.status === "CONTATO_FUTURO" || l.status === "FECHADO" || l.replied).length;
    const negociacao = leads.filter((l) => l.status === "NEGOCIACAO" || l.status === "CALL_AGENDADA" || l.status === "FECHADO").length;
    const fechados = leads.filter((l) => l.status === "FECHADO").length;

    return [
      { stage: "Impactados (Disparo)", count: entregues, rate: "100%", color: "bg-emerald-500" },
      { stage: "Respostas Recebidas", count: responderam, rate: total > 0 ? `${((responderam / total) * 100).toFixed(1)}%` : "0%", color: "bg-sky-500" },
      { stage: "Em Negociação / Call", count: negociacao, rate: total > 0 ? `${((negociacao / total) * 100).toFixed(1)}%` : "0%", color: "bg-violet-500" },
      { stage: "Vendas / Fechamento", count: fechados, rate: total > 0 ? `${((fechados / total) * 100).toFixed(1)}%` : "0%", color: "bg-emerald-400" },
    ];
  }, [leads]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Ocupação dos Leads */}
      <Card className="bg-card/80 border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-emerald-400" />
            <CardTitle className="text-sm font-semibold">Perfil Profissional</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {occupationStats.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate max-w-[200px]" title={item.name}>
                  {item.name}
                </span>
                <span className="font-semibold text-foreground">
                  {item.count} <span className="text-[10px] text-muted-foreground">({item.percent}%)</span>
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 2. Metas mais Buscadas */}
      <Card className="bg-card/80 border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-sky-400" />
            <CardTitle className="text-sm font-semibold">Objetivos com IA (Hub)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {goalStats.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate max-w-[200px]" title={item.name}>
                  {item.name}
                </span>
                <span className="font-semibold text-foreground">
                  {item.count} <span className="text-[10px] text-muted-foreground">({item.percent}%)</span>
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 3. Funil de Conversão */}
      <Card className="bg-card/80 border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-violet-400" />
            <CardTitle className="text-sm font-semibold">Funil de Conversão</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {funnelStats.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">{item.stage}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-foreground">{item.count}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">({item.rate})</span>
                </div>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.max(5, (item.count / (funnelStats[0].count || 1)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
