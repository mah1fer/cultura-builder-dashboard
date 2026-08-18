import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { DashboardMetrics } from "@/types/lead";
import { Users, Send, MessageSquareReply, Flame, Handshake, ShieldAlert, Building2 } from "lucide-react";

interface KpiCardsProps {
  metrics: DashboardMetrics;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
      {/* 1. Total Impactados B2C */}
      <Card className="bg-card/80 border-border/80 hover:border-emerald-500/40 transition-all shadow-sm">
        <CardContent className="p-3.5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Impactados B2C</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Send className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-foreground">{metrics.totalImpacted}</div>
            <p className="text-[10px] text-emerald-400 font-medium mt-0.5">
              100% entregues
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Total de Respostas */}
      <Card className="bg-card/80 border-border/80 hover:border-sky-500/40 transition-all shadow-sm">
        <CardContent className="p-3.5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Respostas</span>
            <div className="h-7 w-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <MessageSquareReply className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-foreground">{metrics.totalReplied}</div>
            <p className="text-[10px] text-sky-400 font-medium mt-0.5">
              {metrics.replyRate.toFixed(1)}% taxa de resposta
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Alto Interesse */}
      <Card className="bg-card/80 border-border/80 hover:border-amber-500/40 transition-all shadow-sm">
        <CardContent className="p-3.5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Alto Interesse</span>
            <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-foreground">{metrics.highInterestCount}</div>
            <p className="text-[10px] text-amber-400 font-medium mt-0.5">
              Leads quentes
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Em Negociação */}
      <Card className="bg-card/80 border-border/80 hover:border-violet-500/40 transition-all shadow-sm">
        <CardContent className="p-3.5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Negociação</span>
            <div className="h-7 w-7 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Handshake className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-foreground">{metrics.inNegotiationCount}</div>
            <p className="text-[10px] text-violet-400 font-medium mt-0.5">
              Funil ativo
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 5. Contatos B2B Empresas */}
      <Card className="bg-card/80 border-border/80 hover:border-indigo-500/40 transition-all shadow-sm">
        <CardContent className="p-3.5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">B2B Empresas</span>
            <div className="h-7 w-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Building2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-indigo-300">{metrics.b2bCount}</div>
            <p className="text-[10px] text-indigo-400 font-medium mt-0.5">
              gruporap.com.br
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 6. Total da Base */}
      <Card className="bg-card/80 border-border/80 hover:border-slate-500/40 transition-all shadow-sm">
        <CardContent className="p-3.5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Geral</span>
            <div className="h-7 w-7 rounded-lg bg-slate-500/10 text-slate-300 flex items-center justify-center">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-foreground">{metrics.totalLeads}</div>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
              Contatos únicos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 7. Bloqueados / Inválidos */}
      <Card className="bg-card/80 border-border/80 hover:border-rose-500/40 transition-all shadow-sm">
        <CardContent className="p-3.5 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Bloqueados</span>
            <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-foreground">{metrics.batchCounts.blocked}</div>
            <p className="text-[10px] text-rose-400 font-medium mt-0.5">
              Regra de segurança
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
