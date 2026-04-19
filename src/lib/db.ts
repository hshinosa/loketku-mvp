import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'loketku.db');

// Ensure data directory exists
import { mkdirSync } from 'fs';
const dbDir = path.dirname(dbPath);
try {
  mkdirSync(dbDir, { recursive: true });
} catch {
  // Ignore if directory already exists
}

const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    organizer_email TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    event_date TEXT,
    event_time TEXT,
    price REAL NOT NULL DEFAULT 0,
    capacity INTEGER NOT NULL DEFAULT 100,
    image_url TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'valid',
    qr_code TEXT NOT NULL,
    purchased_at TEXT DEFAULT (datetime('now')),
    checked_in_at TEXT,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON tickets(event_id);
  CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
  CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_email);
`);

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

// Event operations
export function createEvent(event: Omit<Event, 'created_at' | 'updated_at'>): Event {
  const stmt = db.prepare(`
    INSERT INTO events (id, organizer_email, name, description, location, event_date, event_time, price, capacity, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const now = new Date().toISOString();
  stmt.run(
    event.id,
    event.organizer_email,
    event.name,
    event.description || null,
    event.location || null,
    event.event_date || null,
    event.event_time || null,
    event.price,
    event.capacity,
    event.image_url || null
  );
  return { ...event, created_at: now, updated_at: now };
}

export function getEventById(id: string): Event | null {
  const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
  return stmt.get(id) as Event | null;
}

export function getEventsByOrganizer(email: string): Event[] {
  const stmt = db.prepare('SELECT * FROM events WHERE organizer_email = ? ORDER BY created_at DESC');
  return stmt.all(email) as Event[];
}

export function updateEvent(id: string, updates: Partial<Event>): Event | null {
  const existing = getEventById(id);
  if (!existing) return null;

  const fields: string[] = [];
  const values: any[] = [];

  if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
  if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description); }
  if (updates.location !== undefined) { fields.push('location = ?'); values.push(updates.location); }
  if (updates.event_date !== undefined) { fields.push('event_date = ?'); values.push(updates.event_date); }
  if (updates.event_time !== undefined) { fields.push('event_time = ?'); values.push(updates.event_time); }
  if (updates.price !== undefined) { fields.push('price = ?'); values.push(updates.price); }
  if (updates.capacity !== undefined) { fields.push('capacity = ?'); values.push(updates.capacity); }
  if (updates.image_url !== undefined) { fields.push('image_url = ?'); values.push(updates.image_url); }

  if (fields.length === 0) return existing;

  fields.push("updated_at = datetime('now')");
  values.push(id);

  const stmt = db.prepare(`UPDATE events SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
  return getEventById(id);
}

export function deleteEvent(id: string): boolean {
  const stmt = db.prepare('DELETE FROM events WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

// Ticket operations
export function createTicket(ticket: Omit<Ticket, 'purchased_at' | 'checked_in_at'>): Ticket {
  const stmt = db.prepare(`
    INSERT INTO tickets (id, event_id, buyer_name, buyer_email, quantity, total_price, status, qr_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const now = new Date().toISOString();
  stmt.run(
    ticket.id,
    ticket.event_id,
    ticket.buyer_name,
    ticket.buyer_email,
    ticket.quantity,
    ticket.total_price,
    ticket.status,
    ticket.qr_code
  );
  return { ...ticket, purchased_at: now, checked_in_at: undefined };
}

export function getTicketById(id: string): Ticket | null {
  const stmt = db.prepare('SELECT * FROM tickets WHERE id = ?');
  return stmt.get(id) as Ticket | null;
}

export function getTicketsByEventId(eventId: string): Ticket[] {
  const stmt = db.prepare('SELECT * FROM tickets WHERE event_id = ? ORDER BY purchased_at DESC');
  return stmt.all(eventId) as Ticket[];
}

export function markTicketUsed(ticketId: string): Ticket | null {
  const ticket = getTicketById(ticketId);
  if (!ticket) return null;

  const stmt = db.prepare(`
    UPDATE tickets 
    SET status = 'used', checked_in_at = datetime('now')
    WHERE id = ?
  `);
  stmt.run(ticketId);
  return getTicketById(ticketId);
}

export function getDashboardSnapshot(eventId: string): DashboardSnapshot | null {
  const event = getEventById(eventId);
  if (!event) return null;

  const tickets = getTicketsByEventId(eventId);
  const ticketsSold = tickets.reduce((sum, t) => sum + t.quantity, 0);
  const totalRevenue = tickets.reduce((sum, t) => sum + t.total_price, 0);
  const remainingTickets = Math.max(0, event.capacity - ticketsSold);

  const usedTickets = tickets.filter(t => t.status === 'used').reduce((sum, t) => sum + t.quantity, 0);
  const notCheckedIn = ticketsSold - usedTickets;

  const recentPurchases = tickets
    .slice(0, 5)
    .map(t => ({
      id: t.id,
      buyer_name: t.buyer_name,
      buyer_email: t.buyer_email,
      quantity: t.quantity,
      total_price: t.total_price,
      purchased_at: t.purchased_at
    }));

  return {
    event,
    totalRevenue,
    ticketsSold,
    remainingTickets,
    checkInStats: {
      used: usedTickets,
      notCheckedIn
    },
    recentPurchases
  };
}

export default db;
