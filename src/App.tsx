import { useState } from "react";
import { Header } from "@/components/Header";
import { KpiCards } from "@/components/KpiCards";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { LeadFilters } from "@/components/LeadFilters";
import { LeadTable } from "@/components/LeadTable";
import { DetailedLeadsReport } from "@/components/DetailedLeadsReport";
import { LeadDrawer } from "@/components/LeadDrawer";
import { ExportModal } from "@/components/ExportModal";
import { useLeads } from "@/hooks/useLeads";
import { LayoutDashboard, FileSpreadsheet, Sparkles } from "lucide-react";

export function App() {
  const {
    leads,
    filteredLeads,
    metrics,
    filters,
    setFilters,
    selectedLead,
    setSelectedLead,
    updateLeadStatus,
    updateLeadInterest,
    updateLeadNotes,
    resetToDefault,
    importLeads,
  } = useLeads();

  const [activeTab, setActiveTab] = useState<"overview" | "detailed_report">("overview");
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 1. Header */}
      <Header
        leads={leads}
        onOpenExport={() => setIsExportOpen(true)}
        onReset={resetToDefault}
        onImport={importLeads}
      />

      {/* 2. Top Navigation Tabs */}
      <div className="border-b border-border/40 bg-card/40 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 py-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "overview"
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Visão Geral & CRM</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === "overview" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {leads.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("detailed_report")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all relative ${
                activeTab === "detailed_report"
                  ? "bg-gradient-to-r from-amber-500 to-primary text-slate-950 shadow-sm shadow-amber-500/20 font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Diagnóstico Detalhado de Leads</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full flex items-center gap-0.5 ${activeTab === "detailed_report" ? "bg-black/20 text-slate-950 font-bold" : "bg-amber-500/20 text-amber-400 font-semibold"}`}>
                <Sparkles className="w-2.5 h-2.5" /> 108 Leads
              </span>
            </button>
          </div>

          <div className="text-[11px] text-muted-foreground hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>CRM Sincronizado com WhatsApp</span>
          </div>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === "overview" ? (
          <>
            {/* KPI Cards */}
            <KpiCards metrics={metrics} />

            {/* Analytics & Distribution Charts */}
            <AnalyticsCharts leads={leads} />

            {/* Filters Bar */}
            <LeadFilters
              filters={filters}
              onFilterChange={setFilters}
              totalFiltered={filteredLeads.length}
              totalLeads={leads.length}
            />

            {/* Data Table */}
            <LeadTable
              leads={filteredLeads}
              onSelectLead={setSelectedLead}
              onUpdateStatus={updateLeadStatus}
              onUpdateInterest={updateLeadInterest}
            />
          </>
        ) : (
          /* Aba Nova: Diagnóstico Detalhado de Todos os Leads */
          <DetailedLeadsReport
            leads={leads}
            onSelectLead={setSelectedLead}
          />
        )}
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        Cultura Builder &copy; {new Date().getFullYear()} &bull; Dashboard de Disparos & CRM de IA
      </footer>

      {/* 5. Drawers & Modals */}
      <LeadDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdateStatus={updateLeadStatus}
        onUpdateInterest={updateLeadInterest}
        onUpdateNotes={updateLeadNotes}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        leads={leads}
      />
    </div>
  );
}

export default App;
