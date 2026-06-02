// components/ui/ConfirmDialog.tsx
"use client";

import Button from "../ui/button";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-md shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <Button className="bg-red-400 hover:bg-red-500 text-white cursor-pointer" variant="primary" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="bg-green-400 hover:bg-green-500 text-white cursor-pointer" onClick={onConfirm}>
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
}
