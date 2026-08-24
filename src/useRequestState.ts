import { useState, useCallback, useMemo } from 'react';
import {
  Supplier,
  SupplierStatus,
  FilterKey,
  SortKey,
  MOCK_SUPPLIERS,
  REQUEST_ITEMS,
} from '@/data';

export interface UseRequestState {
  suppliers: Supplier[];
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: (ids: string[]) => void;
  clearSelection: () => void;
  filter: FilterKey;
  setFilter: (f: FilterKey) => void;
  search: string;
  setSearch: (s: string) => void;
  sort: SortKey;
  setSort: (s: SortKey) => void;
  sendRequests: (ids: string[]) => void;
  toggleBlacklist: (id: string) => void;
  recentlyChanged: Set<string>;
  counts: {
    found: number;
    withContacts: number;
    withoutContacts: number;
    selected: number;
    sent: number;
    waiting: number;
    answered: number;
  };
  visibleSuppliers: Supplier[];
}

const STATUS_ORDER: Record<SupplierStatus, number> = {
  answered: 0,
  waiting: 1,
  sent: 2,
  error: 3,
  not_sent: 4,
};

export function useRequestState(): UseRequestState {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('relevance');
  const [recentlyChanged, setRecentlyChanged] = useState<Set<string>>(new Set());

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback((ids: string[]) => {
    setSuppliers((currentSuppliers) => {
      const eligibleIds = ids.filter((id) => !currentSuppliers.find((supplier) => supplier.id === id)?.blacklisted);
      setSelectedIds((prev) => {
        const allSelected = eligibleIds.every((id) => prev.has(id));
        const next = new Set(prev);
        eligibleIds.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
        return next;
      });
      return currentSuppliers;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const toggleBlacklist = useCallback((id: string) => {
    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === id ? { ...supplier, blacklisted: !supplier.blacklisted } : supplier
      )
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const sendRequests = useCallback((ids: string[]) => {
    const time = 'Сегодня ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    setSuppliers((prev) =>
      prev.map((s) => {
        if (!ids.includes(s.id) || !s.email) return s;
        return {
          ...s,
          status: 'sent',
          sentAt: time,
          timeline: [
            { id: `t-${s.id}-${Date.now()}`, time, label: 'Запрос отправлен', kind: 'sent' as const },
          ],
        };
      })
    );
    setRecentlyChanged(new Set(ids));

    const pickIdx = Math.floor(Math.random() * Math.min(3, ids.length));
    const answerIds = ids.filter((_, i) => i % 2 === 0).slice(0, 2);
    setTimeout(() => {
      setSuppliers((prev) =>
        prev.map((s) => {
          if (!answerIds.includes(s.id)) return s;
          if (s.id === ids[pickIdx] || answerIds[0] === s.id) {
            const t = 'Сегодня ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            return {
              ...s,
              status: 'answered' as SupplierStatus,
              timeline: [
                ...s.timeline,
                { id: `t-a-${s.id}-${Date.now()}`, time: t, label: 'Получен ответ', kind: 'answered' as const },
              ],
            };
          }
          return {
            ...s,
            status: 'waiting' as SupplierStatus,
            timeline: [
              ...s.timeline,
              { id: `t-w-${s.id}-${Date.now()}`, time: 'Ожидаем ответ', label: 'Ожидаем ответ', kind: 'waiting' as const },
            ],
          };
        })
      );
      setRecentlyChanged(new Set([answerIds[0]]));
    }, 3500);
  }, []);

  const counts = useMemo(() => {
    const found = suppliers.length;
    const withContacts = suppliers.filter((s) => s.hasContact).length;
    const withoutContacts = found - withContacts;
    const selected = selectedIds.size;
    const sent = suppliers.filter((s) => s.status === 'sent').length;
    const waiting = suppliers.filter((s) => s.status === 'waiting').length;
    const answered = suppliers.filter((s) => s.status === 'answered').length;
    return { found, withContacts, withoutContacts, selected, sent, waiting, answered };
  }, [suppliers, selectedIds]);

  const visibleSuppliers = useMemo(() => {
    let list = suppliers;
    if (filter === 'with_contacts') list = list.filter((s) => s.hasContact);
    else if (filter === 'without_contacts') list = list.filter((s) => !s.hasContact);
    else if (filter === 'selected') list = list.filter((s) => selectedIds.has(s.id));
    else if (filter === 'sent') list = list.filter((s) => s.status === 'sent');
    else if (filter === 'waiting') list = list.filter((s) => s.status === 'waiting');
    else if (filter === 'answered') list = list.filter((s) => s.status === 'answered');

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.inn.includes(q) ||
          s.site.toLowerCase().includes(q) ||
          (s.email && s.email.toLowerCase().includes(q))
      );
    }

    const sorted = [...list];
    if (sort === 'relevance') sorted.sort((a, b) => b.relevance - a.relevance);
    else if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    else if (sort === 'status') sorted.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
    return sorted;
  }, [suppliers, filter, search, sort, selectedIds]);

  return {
    suppliers,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    toggleBlacklist,
    filter,
    setFilter,
    search,
    setSearch,
    sort,
    setSort,
    sendRequests,
    recentlyChanged,
    counts,
    visibleSuppliers,
  };
}

export { REQUEST_ITEMS };
