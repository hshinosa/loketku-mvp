// Hybrid storage: localStorage for browser persistence
// Works for Vercel serverless demo - data persists in user's browser

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

const STORAGE_KEY_EVENTS = 'loketku_events';
const STORAGE_KEY_TICKETS = 'loketku_tickets';

function getEvents(): Map<string, Event> {
  if (typeof window === 'undefined') return new Map();
  const stored = localStorage.getItem(STORAGE_KEY_EVENTS);
  if (!stored) return new Map();
  const eventsArray = JSON.parse(stored) as Event[];
  return new Map(eventsArray.map(e => [e.id, e]));
}

function saveEvents(events: Map<string, Event>) {
  if (typeof window === 'undefined') return;
  const eventsArray = Array.from(events.values());
  localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(eventsArray));
}

function getTickets(): Map<string, Ticket> {
  if (typeof window === 'undefined') return new Map();
  const stored = localStorage.getItem(STORAGE_KEY_TICKETS);
  if (!stored) return new Map();
  const ticketsArray = JSON.parse(stored) as Ticket[];
  return new Map(ticketsArray.map(t => [t.id, t]));
}

function saveTickets(tickets: Map<string, Ticket>) {
  if (typeof window === 'undefined') return;
  const ticketsArray = Array.from(tickets.values());
  localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(ticketsArray));
}

// Demo event for testing
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

// Ensure demo event exists
const events = getEvents();
if (!events.has('demo')) {
  events.set('demo', demoEvent);
  saveEvents(events);
}

// Event operations
export function createEvent(event: Omit<Event, 'created_at' | 'updated_at'>): Event {
  const now = new Date().toISOString();
  const newEvent: Event = { ...event, created_at: now, updated_at: now };
  const events = getEvents();
  events.set(event.id, newEvent);
  saveEvents(events);
  return newEvent;
}

export function getEventById(id: string): Event | null {
  const events = getEvents();
  return events.get(id) || null;
}

export function getEventsByOrganizer(email: string): Event[] {
  const events = getEvents();
  return Array.from(events.values()).filter(e => e.organizer_email === email);
}

export function updateEvent(id: string, updates: Partial<Event>): Event | null {
  const existing = getEventById(id);
  if (!existing) return null;

  const events = getEvents();
  const updated: Event = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  events.set(id, updated);
  saveEvents(events);
  return updated;
}

export function deleteEvent(id: string): boolean {
  const events = getEvents();
  const deleted = events.delete(id);
  saveEvents(events);
  return deleted;
}

// Ticket operations
export function createTicket(ticket: Omit<Ticket, 'purchased_at' | 'checked_in_at'>): Ticket {
  const now = new Date().toISOString();
  const newTicket: Ticket = { ...ticket, purchased_at: now };
  const tickets = getTickets();
  tickets.set(ticket.id, newTicket);
  saveTickets(tickets);
  return newTicket;
}

export function getTicketById(id: string): Ticket | null {
  const tickets = getTickets();
  return tickets.get(id) || null;
}

export function getTicketsByEventId(eventId: string): Ticket[] {
  const tickets = getTickets();
  return Array.from(tickets.values()).filter(t => t.event_id === eventId);
}

export function markTicketUsed(ticketId: string): Ticket | null {
  const ticket = getTicketById(ticketId);
  if (!ticket) return null;

  const tickets = getTickets();
  const updated: Ticket = {
    ...ticket,
    status: 'used',
    checked_in_at: new Date().toISOString(),
  };
  tickets.set(ticketId, updated);
  saveTickets(tickets);
  return updated;
}

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
