"use client";

import { useState, useCallback, createContext, useContext } from "react";

interface Toast {
  id: string;
  title?: string;
  description?: string;
}

const ToastContext = createContext<{
  toast: (t: Omit<Toast, "id">) => void;
} | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-20 right-4 z-[100] flex flex-col gap-2 w-full max-w-xs pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-white dark:bg-zinc-800 border rounded-lg shadow-lg p-4 animate-in slide-in-from-right-4"
          >
            {t.title && <div className="font-bold text-sm">{t.title}</div>}
            {t.description && <div className="text-xs text-zinc-500">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
