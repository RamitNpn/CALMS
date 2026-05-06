"use client";

import { create } from "zustand";

type Toast = {
  message: string;
  type?: "success" | "error";
};

type Store = {
  toast: Toast | null;
  show: (t: Toast) => void;
  hide: () => void;
};

export const useToast = create<Store>((set) => ({
  toast: null,
  show: (toast) => {
    set({ toast });

    setTimeout(() => {
      set({ toast: null });
    }, 3000);
  },
  hide: () => set({ toast: null }),
}));

export function Toast() {
  const { toast, hide } = useToast();

  if (!toast) return null;

  return (
    <div
      onClick={hide}
      className={`fixed bottom-8 right-6 px-4 py-2 rounded-md text-white ${
        toast.type === "error" ? "bg-red-600" : "bg-green-600"
      }`}
    >
      {toast.message}
    </div>
  );
}
