import { useState, useEffect, useMemo } from "react";
import { Lead, LeadStatus, InterestLevel, LeadFiltersState, DashboardMetrics } from "@/types/lead";
import { INITIAL_LEADS } from "@/data/masterLeads";

const STORAGE_KEY = "cultura_builder_leads_v7";

function getCanonicalPhone(phone: string): string {
  let digits = (phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55") && digits.length === 12) {
    digits = "55" + digits.slice(2, 4) + "9" + digits.slice(4);
  }
  if (digits.length === 10) {
    digits = "55" + digits.slice(0, 2) + "9" + digits.slice(2);
  }
  if (digits.length === 11 && !digits.startsWith("55")) {
    digits = "55" + digits;
  }
  return digits;
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      // 1. Tentar ler de qualquer versão salva no navegador para PRESERVAR TODAS as alterações do usuário
      const savedStr =
        localStorage.getItem("cultura_builder_leads_v7") ||
        localStorage.getItem("cultura_builder_leads_v6") ||
        localStorage.getItem("cultura_builder_leads_v5") ||
        localStorage.getItem("cultura_builder_leads_v4") ||
        localStorage.getItem("cultura_builder_leads_v3") ||
        localStorage.getItem("cultura_builder_leads_v2") ||
        localStorage.getItem("cultura_builder_leads_v1");

      const userSavedMap = new Map<string, Lead>();
      if (savedStr) {
        const parsed: Lead[] = JSON.parse(savedStr);
        parsed.forEach((l) => {
          const canon = getCanonicalPhone(l.phoneClean || l.phone);
          if (canon) {
            userSavedMap.set(canon, l);
          }
        });
      }

      // 2. Construir lista final combinando INITIAL_LEADS e garantindo que QUALQUER alteração feita pelo usuário prevaleça 100%
      const canonicalMap = new Map<string, Lead>();
      const finalLeads: Lead[] = [];

      INITIAL_LEADS.forEach((initLead) => {
        const canon = getCanonicalPhone(initLead.phoneClean || initLead.phone);
        if (!canon || canonicalMap.has(canon)) return;

        if (userSavedMap.has(canon)) {
          const userLead = userSavedMap.get(canon)!;
          const merged: Lead = {
            ...initLead,
            // As edições manuais do usuário (status, interesse, anotações) SEMPRE prevalecem:
            status: userLead.status || initLead.status,
            interest: userLead.interest || initLead.interest,
            replied: userLead.replied !== undefined ? userLead.replied : initLead.replied,
            notes: userLead.notes !== undefined ? userLead.notes : initLead.notes,
            occupation: userLead.occupation || initLead.occupation,
            goal: userLead.goal || initLead.goal,
            updatedAt: userLead.updatedAt || initLead.updatedAt,
          };
          canonicalMap.set(canon, merged);
          finalLeads.push(merged);
        } else {
          canonicalMap.set(canon, initLead);
          finalLeads.push(initLead);
        }
      });

      // 3. Adicionar também contatos customizados que o usuário possa ter salvo
      userSavedMap.forEach((userLead, canon) => {
        if (!canonicalMap.has(canon)) {
          canonicalMap.set(canon, userLead);
          finalLeads.push(userLead);
        }
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalLeads));
      return finalLeads;
    } catch (e) {
      console.error("Erro ao carregar leads do storage:", e);
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

  // Sincronizar qualquer alteração para o localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error("Erro ao salvar leads no localStorage:", e);
    }
  }, [leads]);

  // Se o lead selecionado for atualizado, manter o drawer sincronizado
  useEffect(() => {
    if (selectedLead) {
      const fresh = leads.find((l) => l.id === selectedLead.id);
      if (fresh) {
        setSelectedLead(fresh);
      }
    }
  }, [leads]);

  // Métricas do Dashboard calculadas reativamente
  const metrics = useMemo<DashboardMetrics>(() => {
    const totalLeads = leads.length;
    const b2bCount = leads.filter(
      (l) => l.status === "B2B_EMPRESAS" || l.batchType === "b2b" || l.occupation.includes("B2B")
    ).length;
    const reembolsoCount = leads.filter(
      (l) => l.status === "REEMBOLSO" || l.notes?.toLowerCase().includes("reembolso")
    ).length;
    
    // Impactados B2C (excluindo Bloqueados, B2B e Reembolsos)
    const impactedLeads = leads.filter(
      (l) => l.status !== "BLOQUEADO" && l.status !== "B2B_EMPRESAS" && l.status !== "REEMBOLSO" && l.sentAt !== null
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
      reembolsoCount,
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
      if (filters.batchType !== "ALL") {
        if (filters.batchType === "b2b") {
          if (lead.batchType !== "b2b" && lead.status !== "B2B_EMPRESAS" && !lead.occupation.includes("B2B")) {
            return false;
          }
        } else if (lead.batchType !== filters.batchType) {
          return false;
        }
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
      if (filters.occupation !== "ALL") {
        if (filters.occupation === "B2B - gruporap.com.br") {
          if (!lead.occupation.includes("B2B") && lead.status !== "B2B_EMPRESAS") {
            return false;
          }
        } else if (lead.occupation !== filters.occupation) {
          return false;
        }
      }

      // Filtro por Meta
      if (filters.goal !== "ALL" && lead.goal !== filters.goal) {
        return false;
      }

      return true;
    });
  }, [leads, filters]);

  // Ações de atualização com garantia de re-renderização imediata
  const updateLead = (id: string, partial: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          return {
            ...l,
            ...partial,
            updatedAt: new Date().toISOString(),
          };
        }
        return l;
      })
    );
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    const isReplied =
      status === "RESPONDEU" ||
      status === "NEGOCIACAO" ||
      status === "CALL_AGENDADA" ||
      status === "FECHADO";

    updateLead(id, {
      status,
      replied: isReplied,
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
      localStorage.removeItem("cultura_builder_leads_v5");
      localStorage.removeItem("cultura_builder_leads_v4");
      localStorage.removeItem("cultura_builder_leads_v3");
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
