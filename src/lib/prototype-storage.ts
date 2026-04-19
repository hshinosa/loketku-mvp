export type PrototypeEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  ticket_price: number;
  total_tickets: number;
  created_at: string;
};

export type PrototypeTicket = {
  id: string;
  event_id: string;
  buyer_name: string;
  buyer_email: string;
  status: 'paid' | 'used';
  created_at: string;
  event: Pick<PrototypeEvent, 'title' | 'date' | 'location' | 'ticket_price'>;
};

const EVENTS_KEY = 'loketku_events';
const TICKETS_KEY = 'loketku_tickets';

function isBrowser() {
  return typeof window !== 'undefined';
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function readEvents(): PrototypeEvent[] {
  if (!isBrowser()) return [];
  return safeParse<PrototypeEvent[]>(window.localStorage.getItem(EVENTS_KEY), []);
}

function writeEvents(events: PrototypeEvent[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

function readTickets(): PrototypeTicket[] {
  if (!isBrowser()) return [];
  return safeParse<PrototypeTicket[]>(window.localStorage.getItem(TICKETS_KEY), []);
}

function writeTickets(tickets: PrototypeTicket[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
}

export function getDemoEvent(): PrototypeEvent {
  return {
    id: 'demo',
    title: 'Loketku Demo Night',
    description: 'Contoh event demo untuk melihat alur pembelian tiket dari halaman publik sampai e-ticket.',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    location: 'Aula Kampus / Hybrid',
    ticket_price: 25000,
    total_tickets: 120,
    created_at: new Date().toISOString(),
  };
}

export function getEventById(eventId: string): PrototypeEvent | null {
  if (eventId === 'demo') return getDemoEvent();
  return readEvents().find((event) => event.id === eventId) ?? null;
}

export function saveEvent(input: Omit<PrototypeEvent, 'id' | 'created_at'>): PrototypeEvent {
  if (!isBrowser()) {
    throw new Error('Browser storage is unavailable.');
  }

  const event: PrototypeEvent = {
    ...input,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  const events = readEvents();
  writeEvents([event, ...events.filter((existing) => existing.id !== event.id)]);

  return event;
}

export function getTicketsByEventId(eventId: string): PrototypeTicket[] {
  if (eventId === 'demo') {
    return readTickets().filter((ticket) => ticket.event_id === 'demo');
  }

  return readTickets().filter((ticket) => ticket.event_id === eventId);
}

export function getTicketById(ticketId: string): PrototypeTicket | null {
  return readTickets().find((ticket) => ticket.id === ticketId) ?? null;
}

export function createTicket(event: PrototypeEvent, buyerName: string, buyerEmail: string): PrototypeTicket {
  if (!isBrowser()) {
    throw new Error('Browser storage is unavailable.');
  }

  const ticket: PrototypeTicket = {
    id: crypto.randomUUID(),
    event_id: event.id,
    buyer_name: buyerName,
    buyer_email: buyerEmail,
    status: 'paid',
    created_at: new Date().toISOString(),
    event: {
      title: event.title,
      date: event.date,
      location: event.location,
      ticket_price: event.ticket_price,
    },
  };

  const tickets = readTickets();
  writeTickets([ticket, ...tickets]);

  return ticket;
}

export function markTicketUsed(ticketId: string): PrototypeTicket | null {
  const tickets = readTickets();
  const nextTickets = tickets.map((ticket) => {
    if (ticket.id !== ticketId) return ticket;
    return {
      ...ticket,
      status: 'used' as const,
    };
  });

  const updatedTicket = nextTickets.find((ticket) => ticket.id === ticketId) ?? null;
  writeTickets(nextTickets);

  return updatedTicket;
}

export function getDashboardSnapshot(eventId: string) {
  const event = getEventById(eventId);
  const tickets = getTicketsByEventId(eventId);

  return {
    event,
    tickets,
  };
}
