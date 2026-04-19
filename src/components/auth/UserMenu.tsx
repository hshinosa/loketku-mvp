import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogOutIcon, UserIcon } from 'lucide-react';

export function UserMenu() {
  const [email, setEmail] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(cookie => 
      cookie.trim().startsWith('loketku_session=')
    );
    
    if (sessionCookie) {
      const decodedEmail = decodeURIComponent(sessionCookie.split('=')[1]);
      setEmail(decodedEmail);
    }
  }, []);

  function handleLogout() {
    document.cookie = 'loketku_session=; path=/; max-age=0; SameSite=Lax';
    window.location.href = '/auth/login';
  }

  if (!email) return null;

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 gap-2 rounded-full border-slate-200/80 bg-white/90 px-3 text-slate-700 shadow-[0_6px_18px_-14px_rgba(15,23,42,0.35)] hover:border-slate-300 hover:bg-slate-50"
      >
        <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <UserIcon className="w-3.5 h-3.5" />
        </span>
        <span className="hidden max-w-[160px] truncate text-sm font-medium sm:inline-block">{email}</span>
      </Button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10 bg-transparent" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.4)] z-20">
            <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Signed in as</p>
              <p className="mt-1 text-sm font-medium text-slate-900 truncate">{email}</p>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start rounded-none px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOutIcon className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
