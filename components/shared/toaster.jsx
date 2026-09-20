"use client";

import { CheckCircle2, AlertTriangle, Info } from "lucide-react";
import {
  ToastProvider,
  ToastViewport,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from "@/components/ui/toast";
import { useToasts } from "@/components/shared/use-toast";

const icons = {
  default: Info,
  success: CheckCircle2,
  destructive: AlertTriangle,
};

export function Toaster() {
  const { toasts, dismiss } = useToasts();

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(({ id, title, description, variant, action }) => {
        const Icon = icons[variant] ?? icons.default;
        return (
          <ToastRoot
            key={id}
            variant={variant}
            onOpenChange={(open) => {
              if (!open) dismiss(id);
            }}
          >
            <Icon data-slot="toast-icon" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="grid flex-1 gap-0.5">
              {title ? <ToastTitle>{title}</ToastTitle> : null}
              {description ? (
                <ToastDescription>{description}</ToastDescription>
              ) : null}
            </div>
            {action ? (
              <ToastAction
                altText={action.label}
                onClick={() => {
                  action.onClick?.();
                  dismiss(id);
                }}
              >
                {action.label}
              </ToastAction>
            ) : null}
            <ToastClose />
          </ToastRoot>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
