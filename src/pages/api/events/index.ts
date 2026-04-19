export const prerender = false;

import type { APIRoute } from 'astro';
import { createEvent, getEventsByOrganizer } from '../../../lib/db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const event = createEvent(body);
    return new Response(JSON.stringify(event), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const organizerEmail = url.searchParams.get('organizer');
    if (!organizerEmail) {
      return new Response(JSON.stringify({ error: 'Organizer email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const events = getEventsByOrganizer(organizerEmail);
    return new Response(JSON.stringify(events), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to get events' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
