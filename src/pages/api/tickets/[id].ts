export const prerender = false;

import type { APIRoute } from 'astro';
import { getTicketById, markTicketUsed } from '../../../lib/db';

export const GET: APIRoute = async ({ params }) => {
  try {
    const ticket = getTicketById(params.id!);
    if (!ticket) {
      return new Response(JSON.stringify({ error: 'Ticket not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify(ticket), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to get ticket' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params }) => {
  try {
    const ticket = markTicketUsed(params.id!);
    if (!ticket) {
      return new Response(JSON.stringify({ error: 'Ticket not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify(ticket), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update ticket' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
