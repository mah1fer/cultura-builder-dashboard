import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { DashboardMetrics } from "@/types/lead";
import { Users, Send, MessageSquareReply, Flame, Handshake, ShieldAlert } from "lucide-react";

interface KpiCardsProps {
  metrics: DashboardMetrics;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* 1. Total Impactados */}
      <Card className="bg-card/80 border-border/80 hover:border-emerald-500/40 transition-all shadow-sm">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Impactados</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Send className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">{metrics.totalImpacted}</div>
            <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
              100% dos disparos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Total de Respostas */}
      <Card className="bg-card/80 border-border/80 hover:border-sky-500/40 transition-all shadow-sm">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Respostas</span>
            <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <MessageSquareReply className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">{metrics.totalReplied}</div>
            <p className="text-[11px] text-sky-400 font-medium mt-0.5">
              {metrics.replyRate.toFixed(1)}% taxa de resposta
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Alto Interesse */}
      <Card className="bg-card/80 border-border/80 hover:border-amber-500/40 transition-all shadow-sm">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Alto Interesse</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">{metrics.highInterestCount}</div>
            <p className="text-[11px] text-amber-400 font-medium mt-0.5">
              Leads quentes
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Em Negociação */}
      <Card className="bg-card/80 border-border/80 hover:border-violet-500/40 transition-all shadow-sm">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Negociação</span>
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Handshake className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">{metrics.inNegotiationCount}</div>
            <p className="text-[11px] text-violet-400 font-medium mt-0.5">
              Funil ativo
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 5. Total de Contatos na Base */}
      <Card className="bg-card/80 border-border/80 hover:border-slate-500/40 transition-all shadow-sm">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total da Base</span>
            <div className="h-8 w-8 rounded-lg bg-slate-500/10 text-slate-300 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">{metrics.totalLeads}</div>
            <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
              Contatos únicos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 6. Bloqueados / Inválidos */}
      <Card className="bg-card/80 border-border/80 hover:border-rose-500/40 transition-all shadow-sm">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Bloqueados</span>
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">{metrics.batchCounts.blocked}</div>
            <p className="text-[11px] text-rose-400 font-medium mt-0.5">
              Excluídos por regra
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
