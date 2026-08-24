import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { ListToolbar } from '@/components/ListToolbar';
import { SupplierTable } from '@/components/SupplierTable';
import { StickyToolbar } from '@/components/StickyToolbar';
import { SupplierPanel } from '@/components/SupplierPanel';
import { Composer } from '@/components/Composer';
import { useRequestState } from '@/useRequestState';

function App() {
  const state = useRequestState();
  const [openSupplierId, setOpenSupplierId] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);

  const openSupplier = state.suppliers.find((s) => s.id === openSupplierId) ?? null;

  const handleOpenSupplier = (id: string) => setOpenSupplierId(id);
  const handleWriteSupplier = (id: string) => {
    setOpenSupplierId(null);
    if (!state.selectedIds.has(id)) state.toggleSelect(id);
    setComposerOpen(true);
  };

  return (
    <div className="min-h-screen bg-ink-50/60">
      <PageHeader counts={state.counts} />

      <main className="mx-auto max-w-[1440px]">
        <ListToolbar
          filter={state.filter}
          setFilter={state.setFilter}
          search={state.search}
          setSearch={state.setSearch}
          sort={state.sort}
          setSort={state.setSort}
          counts={state.counts}
        />

        <SupplierTable
          suppliers={state.visibleSuppliers}
          selectedIds={state.selectedIds}
          recentlyChanged={state.recentlyChanged}
          onToggleSelect={state.toggleSelect}
          onToggleSelectAll={state.toggleSelectAll}
          onOpenSupplier={handleOpenSupplier}
          onWriteSupplier={handleWriteSupplier}
        />
      </main>

      <StickyToolbar
        count={state.counts.selected}
        onPrepare={() => setComposerOpen(true)}
        onClear={state.clearSelection}
      />

      <SupplierPanel
        supplier={openSupplier}
        onClose={() => setOpenSupplierId(null)}
        onWrite={handleWriteSupplier}
        onOpenChat={() => setOpenSupplierId(null)}
        onToggleBlacklist={state.toggleBlacklist}
      />

      <Composer
        open={composerOpen}
        suppliers={state.suppliers}
        selectedIds={state.selectedIds}
        onClose={() => setComposerOpen(false)}
        onSend={(ids) => {
          state.sendRequests(ids);
          state.clearSelection();
        }}
      />
    </div>
  );
}

export default App;
