export type LeadStatus =
  | 'ENTREGUE'
  | 'RESPONDEU'
  | 'NEGOCIACAO'
  | 'CALL_AGENDADA'
  | 'FECHADO'
  | 'SEM_RESPOSTA'
  | 'PENDENTE'
  | 'BLOQUEADO'
  | 'B2B_EMPRESAS'
  | 'REEMBOLSO';

export type InterestLevel = 'ALTO' | 'MEDIO' | 'BAIXO' | 'DESQUALIFICADO';

export type BatchType = 'lote_1' | 'tipo_a' | 'tipo_b' | 'bloqueado' | 'b2b';

export interface DeliveredBlock {
  block: number;
  text: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  phoneClean: string;
  occupation: string;
  goal: string;
  batch: string;
  batchType: BatchType;
  status: LeadStatus;
  interest: InterestLevel;
  replied: boolean;
  replyText?: string;
  repliedAt?: string;
  sentAt: string | null;
  deliveredBlocks: DeliveredBlock[];
  notes: string;
  dispatchedMessageIds?: string[];
  updatedAt?: string;
}

export interface LeadFiltersState {
  search: string;
  batchType: string;
  status: string;
  interest: string;
  occupation: string;
  goal: string;
}

export interface DashboardMetrics {
  totalLeads: number;
  totalImpacted: number;
  totalReplied: number;
  replyRate: number;
  highInterestCount: number;
  inNegotiationCount: number;
  callsScheduledCount: number;
  dealsClosedCount: number;
  b2bCount: number;
  reembolsoCount: number;
  batchCounts: {
    lote1: number;
    tipoA: number;
    tipoB: number;
    blocked: number;
    b2b: number;
  };
}
