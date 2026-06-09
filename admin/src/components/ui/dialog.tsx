import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DivRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> &
    React.RefAttributes<HTMLDivElement> & { forceMount?: true; asChild?: boolean }
>;
type ButtonRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>> &
    React.RefAttributes<HTMLButtonElement> & { asChild?: boolean }
>;
type HeadingRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>> & React.RefAttributes<HTMLHeadingElement>
>;
type ParaRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLParagraphElement>> & React.RefAttributes<HTMLParagraphElement>
>;
type ContentRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> &
    React.RefAttributes<HTMLDivElement> & {
      forceMount?: true; asChild?: boolean;
      onEscapeKeyDown?: (e: KeyboardEvent) => void;
      onPointerDownOutside?: (e: PointerEvent) => void;
      onInteractOutside?: (e: Event) => void;
    }
>;

const _Overlay = DialogPrimitive.Overlay as unknown as DivRef;
const _Close   = DialogPrimitive.Close   as unknown as ButtonRef;
const _Title   = DialogPrimitive.Title   as unknown as HeadingRef;
const _Desc    = DialogPrimitive.Description as unknown as ParaRef;
const _Content = DialogPrimitive.Content  as unknown as ContentRef;

const Dialog        = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal  = DialogPrimitive.Portal;

const DialogClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <_Close ref={ref} className={cn(className)} {...props}>{children}</_Close>
  )
);
DialogClose.displayName = "DialogClose";

const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { forceMount?: true }>(
  ({ className, ...props }, ref) => (
    <_Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/20 backdrop-blur-sm", className)} {...props} />
  )
);
DialogOverlay.displayName = "DialogOverlay";

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
        "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-white border border-white/60 rounded-2xl p-6 shadow-2xl shadow-black/10 animate-scale-in max-h-[90vh] overflow-y-auto",
        className
      )}
      {...props}
    >
      {children}
      <_Close className="absolute right-4 top-4 text-vous-text-secondary hover:text-vous-text transition-colors">
        <X size={16} />
        <span className="sr-only">Cerrar</span>
      </_Close>
    </_Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props} />
);

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <_Title ref={ref} className={cn("font-serif text-xl text-vous-text", className)} {...props} />
  )
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <_Desc ref={ref} className={cn("text-sm text-vous-text-secondary font-sans", className)} {...props} />
  )
);
DialogDescription.displayName = "DialogDescription";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-wrap items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100", className)} {...props} />
);

export {
  Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger,
  DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,
};
