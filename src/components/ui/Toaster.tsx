'use client';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

interface Toast { id: number; message: string; }
const ToastContext = createContext<(message: string) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[600] flex flex-col gap-2 items-center">
        {toasts.map((t) => (
          <div key={t.id} className="bg-bg-card border border-line text-ink px-5 py-3 rounded-[9px] text-sm flex items-center gap-2.5 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-gold flex-none" />
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
