import { useState } from "react";
import { Header } from "@/components/Header";
import { KpiCards } from "@/components/KpiCards";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { LeadFilters } from "@/components/LeadFilters";
import { LeadTable } from "@/components/LeadTable";
import { LeadDrawer } from "@/components/LeadDrawer";
import { ExportModal } from "@/components/ExportModal";
import { useLeads } from "@/hooks/useLeads";

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

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        Cultura Builder &copy; {new Date().getFullYear()} &bull; Dashboard de Disparos & CRM de IA
      </footer>

      {/* 4. Drawers & Modals */}
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
