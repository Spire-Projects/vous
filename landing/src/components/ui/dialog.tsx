"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Type casts: @radix-ui/react-dialog@1.1.x omits standard HTML attrs (className, children)
 * from exported prop types when used with React 19. We cast each primitive to its
 * underlying HTML element type so our wrappers can accept and forward standard attributes.
 * At runtime, Radix correctly passes these through — the cast is type-level only.
 */
type DivRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> &
    React.RefAttributes<HTMLDivElement> & { forceMount?: true; asChild?: boolean }
>;
type ButtonRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>> &
    React.RefAttributes<HTMLButtonElement> & { asChild?: boolean }
>;
type HeadingRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>> &
    React.RefAttributes<HTMLHeadingElement>
>;
type ParaRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLParagraphElement>> &
    React.RefAttributes<HTMLParagraphElement>
>;
type ContentRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> &
    React.RefAttributes<HTMLDivElement> & {
      forceMount?: true;
      asChild?: boolean;
      onOpenAutoFocus?: (e: Event) => void;
      onCloseAutoFocus?: (e: Event) => void;
      onEscapeKeyDown?: (e: KeyboardEvent) => void;
      onPointerDownOutside?: (e: PointerEvent) => void;
      onInteractOutside?: (e: Event) => void;
    }
>;

const _Overlay = DialogPrimitive.Overlay as unknown as DivRef;
const _Close = DialogPrimitive.Close as unknown as ButtonRef;
const _Title = DialogPrimitive.Title as unknown as HeadingRef;
const _Description = DialogPrimitive.Description as unknown as ParaRef;
const _Content = DialogPrimitive.Content as unknown as ContentRef;

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { forceMount?: true }
>(({ className, ...props }, ref) => (
  <_Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-vous-soft-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <_Close ref={ref} className={cn(className)} {...props}>
    {children}
  </_Close>
));
DialogClose.displayName = "DialogClose";

/** Use when you need asChild (e.g. framer-motion) instead of the standard DialogContent. */
const DialogContentRaw = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
    forceMount?: true;
    onEscapeKeyDown?: (e: KeyboardEvent) => void;
    onPointerDownOutside?: (e: PointerEvent) => void;
    onInteractOutside?: (e: Event) => void;
  }
>((props, ref) => <_Content ref={ref} {...props} />);
DialogContentRaw.displayName = "DialogContentRaw";

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    onEscapeKeyDown?: (e: KeyboardEvent) => void;
    onPointerDownOutside?: (e: PointerEvent) => void;
  }
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <_Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
      <_Close className="absolute right-4 top-4 text-vous-gray hover:text-vous-soft-black transition-colors">
        <X size={16} />
        <span className="sr-only">Cerrar</span>
      </_Close>
    </_Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <_Title
    ref={ref}
    className={cn("font-serif text-xl text-vous-soft-black", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <_Description
    ref={ref}
    className={cn("font-sans text-sm text-vous-gray", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContentRaw,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
};
