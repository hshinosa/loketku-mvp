// Client-side localStorage storage - NO API calls
// All data persists in user's browser

export interface Event {
  id: string;
  organizer_email: string;
  name: string;
  description?: string;
  location?: string;
  event_date: string;
  event_time: string;
  price: number;
  capacity: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  event_id: string;
  buyer_name: string;
  buyer_email: string;
  quantity: number;
  total_price: number;
  status: 'valid' | 'used' | 'cancelled';
  qr_code: string;
  purchased_at: string;
  checked_in_at?: string;
}

export interface DashboardSnapshot {
  event: Event | null;
  totalRevenue: number;
  ticketsSold: number;
  remainingTickets: number;
  checkInStats: {
    used: number;
    notCheckedIn: number;
  };
  recentPurchases: Array<{
    id: string;
    buyer_name: string;
    buyer_email: string;
    quantity: number;
    total_price: number;
    purchased_at: string;
  }>;
}

const STORAGE_KEY_EVENTS = 'loketku_events_v1';
const STORAGE_KEY_TICKETS = 'loketku_tickets_v1';

function getEventsMap(): Map<string, Event> {
  const stored = localStorage.getItem(STORAGE_KEY_EVENTS);
  if (!stored) return new Map();
  const eventsArray = JSON.parse(stored) as Event[];
  return new Map(eventsArray.map(e => [e.id, e]));
}

function saveEventsMap(events: Map<string, Event>) {
  const eventsArray = Array.from(events.values());
  localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(eventsArray));
}

function getTicketsMap(): Map<string, Ticket> {
  const stored = localStorage.getItem(STORAGE_KEY_TICKETS);
  if (!stored) return new Map();
  const ticketsArray = JSON.parse(stored) as Ticket[];
  return new Map(ticketsArray.map(t => [t.id, t]));
}

function saveTicketsMap(tickets: Map<string, Ticket>) {
  const ticketsArray = Array.from(tickets.values());
  localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(ticketsArray));
}

// Initialize demo event
const demoEvent: Event = {
  id: 'demo',
  organizer_email: 'demo@loketku.com',
  name: 'Demo Event - Loketku',
  description: 'Ini adalah event demo untuk mencoba fitur Loketku. Anda bisa mensimulasikan pembelian tiket.',
  location: 'Demo Location',
  event_date: '2026-12-31',
  event_time: '20:00',
  price: 50000,
  capacity: 100,
  image_url: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Ensure demo event exists on load
const events = getEventsMap();
if (!events.has('demo')) {
  events.set('demo', demoEvent);
  saveEventsMap(events);
}

// ============ EVENT OPERATIONS ============

export function createEvent(event: Omit<Event, 'created_at' | 'updated_at'>): Event {
  const now = new Date().toISOString();
  const newEvent: Event = { ...event, created_at: now, updated_at: now };
  const events = getEventsMap();
  events.set(event.id, newEvent);
  saveEventsMap(events);
  return newEvent;
}

export function getEventById(id: string): Event | null {
  const events = getEventsMap();
  return events.get(id) || null;
}

export function getAllEvents(): Event[] {
  return Array.from(getEventsMap().values());
}

export function getEventsByOrganizer(email: string): Event[] {
  return Array.from(getEventsMap().values()).filter(e => e.organizer_email === email);
}

// ============ TICKET OPERATIONS ============

export function createTicket(ticket: Omit<Ticket, 'purchased_at' | 'checked_in_at'>): Ticket {
  const now = new Date().toISOString();
  const newTicket: Ticket = { ...ticket, purchased_at: now };
  const tickets = getTicketsMap();
  tickets.set(ticket.id, newTicket);
  saveTicketsMap(tickets);
  return newTicket;
}

export function getTicketById(id: string): Ticket | null {
  const tickets = getTicketsMap();
  return tickets.get(id) || null;
}

export function getTicketsByEventId(eventId: string): Ticket[] {
  return Array.from(getTicketsMap().values()).filter(t => t.event_id === eventId);
}

export function markTicketUsed(ticketId: string): Ticket | null {
  const ticket = getTicketById(ticketId);
  if (!ticket) return null;

  const tickets = getTicketsMap();
  const updated: Ticket = {
    ...ticket,
    status: 'used',
    checked_in_at: new Date().toISOString(),
  };
  tickets.set(ticketId, updated);
  saveTicketsMap(tickets);
  return updated;
}

// ============ DASHBOARD ============

export function getDashboardSnapshot(eventId: string): DashboardSnapshot | null {
  const event = getEventById(eventId);
  if (!event) return null;

  const eventTickets = getTicketsByEventId(eventId);
  const ticketsSold = eventTickets.reduce((sum, t) => sum + t.quantity, 0);
  const totalRevenue = eventTickets.reduce((sum, t) => sum + t.total_price, 0);
  const remainingTickets = Math.max(0, event.capacity - ticketsSold);

  const usedTickets = eventTickets.filter(t => t.status === 'used').reduce((sum, t) => sum + t.quantity, 0);
  const notCheckedIn = ticketsSold - usedTickets;

  const recentPurchases = eventTickets
    .sort((a, b) => b.purchased_at.localeCompare(a.purchased_at))
    .slice(0, 5)
    .map(t => ({
      id: t.id,
      buyer_name: t.buyer_name,
      buyer_email: t.buyer_email,
      quantity: t.quantity,
      total_price: t.total_price,
      purchased_at: t.purchased_at,
    }));

  return {
    event,
    totalRevenue,
    ticketsSold,
    remainingTickets,
    checkInStats: {
      used: usedTickets,
      notCheckedIn,
    },
    recentPurchases,
  };
}
