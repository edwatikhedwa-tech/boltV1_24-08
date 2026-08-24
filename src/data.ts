export type SupplierStatus =
  | 'not_sent'
  | 'sent'
  | 'waiting'
  | 'answered'
  | 'error';

export interface RequestItem { id: string; name: string; }
export interface TimelineEvent { id: string; time: string; label: string; kind: 'sent' | 'answered' | 'waiting' | 'error'; }
export interface Supplier {
  id: string; name: string; inn: string; site: string; email: string | null; phone: string | null;
  items: string[]; status: SupplierStatus; relevance: number; hasContact: boolean; timeline: TimelineEvent[];
  sentAt?: string; errorReason?: string; blacklisted?: boolean;
}
export type FilterKey = 'all' | 'with_contacts' | 'without_contacts' | 'selected' | 'sent' | 'waiting' | 'answered';
export type SortKey = 'relevance' | 'name' | 'status';
export interface RequestSummary { itemsCount: number; found: number; withContacts: number; sent: number; answers: number; }
export const STATUS_META: Record<SupplierStatus, { label: string; icon: string; dot: string; badge: string; tone: string }> = {
  not_sent: { label: 'Не отправлен', icon: '○', dot: 'text-ink-400', badge: 'bg-ink-100 text-ink-600 ring-ink-200', tone: 'neutral' },
  sent: { label: 'Отправлен', icon: '↗', dot: 'text-accent-600', badge: 'bg-accent-50 text-accent-700 ring-accent-200', tone: 'accent' },
  waiting: { label: 'Ждём ответ', icon: '◷', dot: 'text-amber-600', badge: 'bg-amber-50 text-amber-700 ring-amber-200', tone: 'amber' },
  answered: { label: 'Ответ получен', icon: '●', dot: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200', tone: 'emerald' },
  error: { label: 'Ошибка', icon: '!', dot: 'text-rose-600', badge: 'bg-rose-50 text-rose-700 ring-rose-200', tone: 'rose' },
};
export const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Все' }, { key: 'with_contacts', label: 'С контактами' }, { key: 'without_contacts', label: 'Без контакта' },
  { key: 'selected', label: 'Выбранные' }, { key: 'sent', label: 'Отправлено' }, { key: 'waiting', label: 'Ждём ответа' }, { key: 'answered', label: 'Получен ответ' },
];
export const SORTS: { key: SortKey; label: string }[] = [
  { key: 'relevance', label: 'По релевантности' }, { key: 'name', label: 'По названию' }, { key: 'status', label: 'По статусу' },
];
export const REQUEST_ITEMS: RequestItem[] = [
  { id: 'i1', name: 'Кирпич М150' }, { id: 'i2', name: 'Цемент М500' }, { id: 'i3', name: 'Арматура 12 мм' }, { id: 'i4', name: 'Песок строительный' }, { id: 'i5', name: 'Гипсокартон 12.5мм' },
];
export const REQUEST_INFO = { title: 'Строительные материалы', number: '1044', createdAt: 'сегодня в 10:42', breadcrumb: 'Мои заявки / Строительные материалы' };
export const WORKFLOW_STEPS = [{ key: 'request', label: 'Заявка' }, { key: 'search', label: 'Поиск' }, { key: 'suppliers', label: 'Поставщики' }, { key: 'queries', label: 'Запросы' }, { key: 'answers', label: 'Ответы' }];
export const CURRENT_STEP = 'suppliers';
const supplier = (id: string, name: string, inn: string, site: string, email: string | null, phone: string | null, items: string[], status: SupplierStatus, relevance: number, hasContact = true, extra: Partial<Supplier> = {}): Supplier => ({ id, name, inn, site, email, phone, items, status, relevance, hasContact, timeline: [], ...extra });
export const MOCK_SUPPLIERS: Supplier[] = [
  supplier('s1', 'ООО СтройСнаб', '7701234567', 'stroysnab.ru', 'sales@stroysnab.ru', '+7 495 123-45-67', ['Кирпич', 'Цемент', 'Арматура'], 'answered', 98, true, { sentAt: 'Сегодня 10:45', timeline: [{ id: 't1', time: 'Сегодня 10:45', label: 'Запрос отправлен', kind: 'sent' }, { id: 't2', time: 'Сегодня 13:17', label: 'Получен ответ', kind: 'answered' }] }),
  supplier('s2', 'АО МонолитСтрой', '7709876543', 'monolith-stroy.ru', 'info@monolith-stroy.ru', '+7 495 777-88-99', ['Кирпич', 'Песок'], 'answered', 95, true, { sentAt: 'Сегодня 10:45', timeline: [{ id: 't3', time: 'Сегодня 10:45', label: 'Запрос отправлен', kind: 'sent' }, { id: 't4', time: 'Сегодня 14:02', label: 'Получен ответ', kind: 'answered' }] }),
  supplier('s3', 'ООО ТД Стройматериалы', '7705554433', 'tdsm.ru', 'office@tdsm.ru', '+7 812 445-67-89', ['Цемент', 'Арматура', 'Гипсокартон'], 'answered', 93, true, { sentAt: 'Сегодня 10:46', timeline: [{ id: 't5', time: 'Сегодня 10:46', label: 'Запрос отправлен', kind: 'sent' }, { id: 't6', time: 'Сегодня 15:21', label: 'Получен ответ', kind: 'answered' }] }),
  supplier('s4', 'ООО БетонКомплект', '7712345678', 'beton-komplekt.ru', 'zakaz@beton-komplekt.ru', '+7 495 333-22-11', ['Цемент', 'Песок'], 'waiting', 90, true, { sentAt: 'Сегодня 10:45', timeline: [{ id: 't7', time: 'Сегодня 10:45', label: 'Запрос отправлен', kind: 'sent' }, { id: 't8', time: 'Ожидаем ответ', label: 'Ожидаем ответ', kind: 'waiting' }] }),
  supplier('s5', 'ООО СтройОптТорг', '7723456789', 'stroyopttorg.ru', 'opt@stroyopttorg.ru', '+7 831 220-30-40', ['Кирпич', 'Арматура'], 'waiting', 88, true, { sentAt: 'Сегодня 10:46' }),
  supplier('s6', 'ООО РесурсСтрой', '7734567890', 'resurs-stroy.ru', 'info@resurs-stroy.ru', '+7 343 555-12-34', ['Цемент'], 'waiting', 86, true, { sentAt: 'Сегодня 10:46' }),
  supplier('s7', 'ООО УралСтройСнаб', '7745678901', 'ural-stroysnab.ru', 'sales@ural-stroysnab.ru', '+7 347 277-77-77', ['Арматура', 'Кирпич'], 'waiting', 84, true, { sentAt: 'Сегодня 10:47' }),
  supplier('s8', 'ООО СтройДвор', '7756789012', 'stroydvor.ru', 'info@stroydvor.ru', '+7 495 111-22-33', ['Гипсокартон', 'Цемент'], 'sent', 82, true, { sentAt: 'Сегодня 10:47' }),
  supplier('s9', 'ООО ОптСтрой', '7767890123', 'optstroy.ru', 'opt@optstroy.ru', '+7 846 990-00-11', ['Песок', 'Цемент'], 'sent', 80, true, { sentAt: 'Сегодня 10:47' }),
  supplier('s10', 'ООО ТрастМатериал', '7778901234', 'trust-mat.ru', 'sales@trust-mat.ru', '+7 495 888-99-00', ['Кирпич'], 'sent', 78, true, { sentAt: 'Сегодня 10:48' }),
  supplier('s11', 'ООО СтройАктив', '7789012345', 'stroy-aktiv.ru', 'office@stroy-aktiv.ru', '+7 812 300-40-50', ['Арматура', 'Цемент', 'Кирпич'], 'sent', 76, true, { sentAt: 'Сегодня 10:48' }),
  supplier('s12', 'ООО ГлобусСтрой', '7790123456', 'globus-stroy.ru', 'info@globus-stroy.ru', '+7 343 200-10-20', ['Песок'], 'sent', 74, true, { sentAt: 'Сегодня 10:48' }),
  supplier('s13', 'ООО СтройМаркет', '7801234567', 'stroy-market.ru', 'sales@stroy-market.ru', null, ['Гипсокартон'], 'not_sent', 72),
  supplier('s14', 'ООО ВекторСтрой', '7812345678', 'vektor-stroy.ru', 'opt@vektor-stroy.ru', '+7 495 444-55-66', ['Кирпич', 'Цемент'], 'not_sent', 70),
  supplier('s15', 'ООО АльфаСтрой', '7823456789', 'alfa-stroy.ru', 'info@alfa-stroy.ru', '+7 831 110-20-30', ['Арматура'], 'not_sent', 68),
  supplier('s16', 'ООО СтройИмпульс', '7834567890', 'stroy-impuls.ru', 'sales@stroy-impuls.ru', null, ['Цемент', 'Песок'], 'not_sent', 66),
  supplier('s17', 'ООО МегаСтрой', '7845678901', 'mega-stroy.ru', 'office@mega-stroy.ru', '+7 495 222-33-44', ['Кирпич', 'Гипсокартон'], 'not_sent', 64),
  supplier('s18', 'ООО СтройСервис', '7856789012', 'stroy-service.ru', 'info@stroy-service.ru', '+7 812 600-70-80', ['Арматура', 'Цемент'], 'not_sent', 62),
  supplier('s19', 'ООО ТитанСтрой', '7867890123', 'titan-stroy.ru', null, null, ['Песок'], 'not_sent', 58, false, { blacklisted: true }),
  supplier('s20', 'ООО ПромСтройМатериалы', '7878901234', 'promsm.ru', null, null, ['Кирпич'], 'not_sent', 55, false, { blacklisted: true }),
  supplier('s21', 'ООО СтройХаб', '7889012345', 'stroy-hub.ru', null, '+7 495 999-00-11', ['Цемент'], 'not_sent', 52, false),
  supplier('s22', 'ООО ОптТрейд', '7890123456', 'opttreyd.ru', 'opt@opttreyd.ru', '+7 347 100-20-30', ['Арматура', 'Песок'], 'error', 50, true, { errorReason: 'Почтовый ящик недоступен', timeline: [{ id: 't20', time: 'Сегодня 10:49', label: 'Ошибка отправки', kind: 'error' }] }),
  supplier('s23', 'ООО СнабСтрой', '7901234567', 'snab-stroy.ru', 'sales@snab-stroy.ru', '+7 495 555-66-77', ['Гипсокартон', 'Кирпич'], 'not_sent', 48),
  supplier('s24', 'ООО СтройПлюс', '7912345678', 'stroy-plus.ru', 'info@stroy-plus.ru', '+7 812 770-80-90', ['Цемент', 'Арматура'], 'not_sent', 45),
];
