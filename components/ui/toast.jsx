"use client"

import * as React from "react"
import { cn } from "cn"
import { cva } from "class-variance-authority"
import { Toast as ToastPrimitive } from "radix-ui"
import { XIcon } from "lucide-react"

function ToastProvider({
  ...props
}) {
  return <ToastPrimitive.Provider data-slot="toast-provider" {...props} />
}

function ToastViewport({
  className,
  ...props
}) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "fixed inset-x-0 bottom-0 z-100 flex max-h-screen w-full flex-col-reverse gap-2 p-4 outline-none sm:right-0 sm:left-auto sm:w-[380px] sm:flex-col",
        className
      )}
      {...props}
    />
  )
}

const toastVariants = cva(
  "group/toast pointer-events-auto relative flex w-full items-start gap-2.5 overflow-hidden rounded-xl bg-popover p-3 pr-8 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/10 transition-all data-[swipe=move]:transition-none data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-bottom-4 sm:data-open:slide-in-from-right-1/2 data-closed:animate-out data-closed:fade-out-0 data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-right-full",
  {
    variants: {
      variant: {
        default: "",
        success: "[&_[data-slot=toast-icon]]:text-status-success",
        destructive: "[&_[data-slot=toast-icon]]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function ToastRoot({
  className,
  variant,
  ...props
}) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
}

function ToastTitle({
  className,
  ...props
}) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function ToastClose({
  className,
  ...props
}) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      toast-close=""
      className={cn(
        "absolute top-2 right-2 rounded-md p-1 text-muted-foreground/70 opacity-0 transition-opacity outline-none hover:text-foreground focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50 group-hover/toast:opacity-100",
        className
      )}
      {...props}
    >
      <XIcon className="size-3.5" />
    </ToastPrimitive.Close>
  )
}

function ToastAction({
  className,
  ...props
}) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        "shrink-0 rounded-md text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  )
}

export {
  ToastProvider,
  ToastViewport,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
