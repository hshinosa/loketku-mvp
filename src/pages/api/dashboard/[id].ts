export const prerender = false;

import type { APIRoute } from 'astro';
import { getDashboardSnapshot } from '../../../lib/db';

export const GET: APIRoute = async ({ params }) => {
  try {
    const snapshot = getDashboardSnapshot(params.id!);
    if (!snapshot) {
      return new Response(JSON.stringify({ error: 'Event not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify(snapshot), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to get dashboard data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
