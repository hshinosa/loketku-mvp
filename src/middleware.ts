import type { AstroMiddleware } from 'astro';

export const onRequest: AstroMiddleware = async (context, next) => {
  const isDashboardRoute = context.url.pathname.startsWith('/dashboard');
  
  if (isDashboardRoute) {
    const sessionCookie = context.cookies.get('loketku_session');
    
    if (!sessionCookie || !sessionCookie.value) {
      return context.redirect('/auth/login');
    }
  }
  
  return next();
};
