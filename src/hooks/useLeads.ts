import { useState, useEffect, useMemo } from "react";
import { Lead, LeadStatus, InterestLevel, LeadFiltersState, DashboardMetrics } from "@/types/lead";
import { INITIAL_LEADS } from "@/data/masterLeads";

const STORAGE_KEY = "cultura_builder_leads_v3";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const savedStr = localStorage.getItem(STORAGE_KEY);
      if (savedStr) {
        const saved: Lead[] = JSON.parse(savedStr);
        const savedIds = new Set(saved.map((l) => l.id));
        const savedPhones = new Set(saved.map((l) => l.phoneClean));
        
        const missingFromInitial = INITIAL_LEADS.filter(
          (l) => !savedIds.has(l.id) && !savedPhones.has(l.phoneClean)
        );

        if (missingFromInitial.length > 0) {
          const merged = [...saved, ...missingFromInitial];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
        return saved;
      }
    } catch (e) {
      console.error("Erro ao carregar leads do localStorage:", e);
    }
    return INITIAL_LEADS;
  });

  const [filters, setFilters] = useState<LeadFiltersState>({
    search: "",
    batchType: "ALL",
    status: "ALL",
    interest: "ALL",
    occupation: "ALL",
    goal: "ALL",
  });

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error("Erro ao salvar leads no localStorage:", e);
    }
  }, [leads]);

  useEffect(() => {
    if (selectedLead) {
      const fresh = leads.find((l) => l.id === selectedLead.id);
      if (fresh) {
        setSelectedLead(fresh);
      }
    }
  }, [leads]);

  // Métricas do Dashboard
  const metrics = useMemo<DashboardMetrics>(() => {
    const totalLeads = leads.length;
    const b2bCount = leads.filter((l) => l.status === "B2B_EMPRESAS" || l.batchType === "b2b").length;
    
    // Impactados B2C (excluindo Bloqueados e B2B)
    const impactedLeads = leads.filter(
      (l) => l.status !== "BLOQUEADO" && l.status !== "B2B_EMPRESAS" && l.sentAt !== null
    );
    const totalImpacted = impactedLeads.length;
    
    const repliedLeads = leads.filter(
      (l) => l.replied || l.status === "RESPONDEU" || l.status === "NEGOCIACAO" || l.status === "CALL_AGENDADA" || l.status === "FECHADO"
    );
    const totalReplied = repliedLeads.length;
    const replyRate = totalImpacted > 0 ? (totalReplied / totalImpacted) * 100 : 0;

    const highInterestCount = leads.filter((l) => l.interest === "ALTO").length;
    const inNegotiationCount = leads.filter((l) => l.status === "NEGOCIACAO").length;
    const callsScheduledCount = leads.filter((l) => l.status === "CALL_AGENDADA").length;
    const dealsClosedCount = leads.filter((l) => l.status === "FECHADO").length;

    const batchCounts = {
      lote1: leads.filter((l) => l.batchType === "lote_1").length,
      tipoA: leads.filter((l) => l.batchType === "tipo_a").length,
      tipoB: leads.filter((l) => l.batchType === "tipo_b").length,
      blocked: leads.filter((l) => l.batchType === "bloqueado").length,
      b2b: b2bCount,
    };

    return {
      totalLeads,
      totalImpacted,
      totalReplied,
      replyRate,
      highInterestCount,
      inNegotiationCount,
      callsScheduledCount,
      dealsClosedCount,
      b2bCount,
      batchCounts,
    };
  }, [leads]);

  // Leads filtrados
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Busca global por texto
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchName = lead.name.toLowerCase().includes(q);
        const matchPhone = lead.phone.replace(/\D/g, "").includes(q.replace(/\D/g, ""));
        const matchOcc = lead.occupation.toLowerCase().includes(q);
        const matchGoal = lead.goal.toLowerCase().includes(q);
        const matchNotes = (lead.notes || "").toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchOcc && !matchGoal && !matchNotes) {
          return false;
        }
      }

      // Filtro por Lote
      if (filters.batchType !== "ALL" && lead.batchType !== filters.batchType) {
        return false;
      }

      // Filtro por Status
      if (filters.status !== "ALL" && lead.status !== filters.status) {
        return false;
      }

      // Filtro por Interesse
      if (filters.interest !== "ALL" && lead.interest !== filters.interest) {
        return false;
      }

      // Filtro por Ocupação
      if (filters.occupation !== "ALL" && lead.occupation !== filters.occupation) {
        return false;
      }

      // Filtro por Meta
      if (filters.goal !== "ALL" && lead.goal !== filters.goal) {
        return false;
      }

      return true;
    });
  }, [leads, filters]);

  // Ações de atualização
  const updateLead = (id: string, partial: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const updated = {
            ...l,
            ...partial,
            updatedAt: new Date().toISOString(),
          };
          if (partial.replied === true && l.status === "ENTREGUE") {
            updated.status = "RESPONDEU";
          }
          return updated;
        }
        return l;
      })
    );
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    updateLead(id, {
      status,
      replied: status !== "ENTREGUE" && status !== "SEM_RESPOSTA" && status !== "BLOQUEADO" && status !== "PENDENTE" && status !== "B2B_EMPRESAS" ? true : undefined,
    });
  };

  const updateLeadInterest = (id: string, interest: InterestLevel) => {
    updateLead(id, { interest });
  };

  const updateLeadNotes = (id: string, notes: string) => {
    updateLead(id, { notes });
  };

  const resetToDefault = () => {
    if (window.confirm("Deseja restaurar a base para os dados originais? As alterações feitas serão substituídas.")) {
      setLeads(INITIAL_LEADS);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("cultura_builder_leads_v2");
      localStorage.removeItem("cultura_builder_leads_v1");
    }
  };

  const importLeads = (newLeads: Lead[]) => {
    setLeads(newLeads);
  };

  return {
    leads,
    filteredLeads,
    metrics,
    filters,
    setFilters,
    selectedLead,
    setSelectedLead,
    updateLead,
    updateLeadStatus,
    updateLeadInterest,
    updateLeadNotes,
    resetToDefault,
    importLeads,
  };
}
