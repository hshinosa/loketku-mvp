const API_BASE = '/api';

export interface Event {
  id: string;
  organizer_email: string;
  name: string;
  description?: string;
  location?: string;
  event_date?: string;
  event_time?: string;
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

// Event API
export async function createEvent(event: Omit<Event, 'created_at' | 'updated_at'>): Promise<Event> {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
}

export async function getEventById(id: string): Promise<Event | null> {
  const res = await fetch(`${API_BASE}/events/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to get event');
  return res.json();
}

export async function getEventsByOrganizer(email: string): Promise<Event[]> {
  const res = await fetch(`${API_BASE}/events?organizer=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error('Failed to get events');
  return res.json();
}

// Ticket API
export async function createTicket(ticket: Omit<Ticket, 'purchased_at' | 'checked_in_at'>): Promise<Ticket> {
  const res = await fetch(`${API_BASE}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticket)
  });
  if (!res.ok) throw new Error('Failed to create ticket');
  return res.json();
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  const res = await fetch(`${API_BASE}/tickets/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to get ticket');
  return res.json();
}

export async function getTicketsByEventId(eventId: string): Promise<Ticket[]> {
  const res = await fetch(`${API_BASE}/tickets?event_id=${encodeURIComponent(eventId)}`);
  if (!res.ok) throw new Error('Failed to get tickets');
  return res.json();
}

export async function markTicketUsed(ticketId: string): Promise<Ticket | null> {
  const res = await fetch(`${API_BASE}/tickets/${encodeURIComponent(ticketId)}`, {
    method: 'PUT'
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to mark ticket used');
  return res.json();
}

// Dashboard API
export async function getDashboardSnapshot(eventId: string): Promise<DashboardSnapshot | null> {
  const res = await fetch(`${API_BASE}/dashboard/${encodeURIComponent(eventId)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to get dashboard data');
  return res.json();
}
