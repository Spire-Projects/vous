import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Cast: @radix-ui/react-select omits HTML attrs from types in React 19.
 * Type-level only — no runtime impact.
 */
type ButtonRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>> &
    React.RefAttributes<HTMLButtonElement> & { asChild?: boolean }
>;
type DivRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> &
    React.RefAttributes<HTMLDivElement> & {
      position?: "item-aligned" | "popper";
      sideOffset?: number; side?: "top" | "right" | "bottom" | "left";
      align?: "start" | "center" | "end"; forceMount?: true;
    }
>;
type ItemRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> &
    React.RefAttributes<HTMLDivElement> & { value: string; disabled?: boolean; textValue?: string }
>;
type GroupRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & React.RefAttributes<HTMLDivElement>
>;
type IndicatorRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLSpanElement>> &
    React.RefAttributes<HTMLSpanElement>
>;
type SpanRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLSpanElement>> &
    React.RefAttributes<HTMLSpanElement> & { placeholder?: string }
>;
type ScrollRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & React.RefAttributes<HTMLDivElement>
>;

const _Trigger = SelectPrimitive.Trigger as unknown as ButtonRef;
const _Content = SelectPrimitive.Content as unknown as DivRef;
const _Item    = SelectPrimitive.Item    as unknown as ItemRef;
const _Label   = SelectPrimitive.Label  as unknown as GroupRef;
const _Group   = SelectPrimitive.Group  as unknown as GroupRef;
const _ItemIndicator = SelectPrimitive.ItemIndicator as unknown as IndicatorRef;
const _Value   = SelectPrimitive.Value  as unknown as SpanRef;
const _ScrollUp   = SelectPrimitive.ScrollUpButton  as unknown as ScrollRef;
const _ScrollDown = SelectPrimitive.ScrollDownButton as unknown as ScrollRef;

const Select      = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, ...props }, ref) => (
  <_Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between border border-vous-border bg-vous-surface px-3 py-2 text-sm font-sans text-vous-black focus:outline-none focus:border-vous-gold disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown size={14} className="text-vous-gray shrink-0 ml-2" />
  </_Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { position?: "item-aligned" | "popper"; sideOffset?: number }
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <_Content
      ref={ref}
      position={position}
      className={cn(
        "z-50 min-w-[8rem] bg-vous-white border border-vous-border shadow-sm",
        className
      )}
      {...props}
    >
      <_ScrollUp className="flex items-center justify-center py-1">
        <ChevronUp size={12} />
      </_ScrollUp>
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      <_ScrollDown className="flex items-center justify-center py-1">
        <ChevronDown size={12} />
      </_ScrollDown>
    </_Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <_Label
      ref={ref}
      className={cn("px-3 py-1.5 font-nav text-[10px] uppercase tracking-[0.15em] text-vous-gray", className)}
      {...props}
    />
  )
);
SelectLabel.displayName = "SelectLabel";

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; disabled?: boolean }
>(({ className, children, ...props }, ref) => (
  <_Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center py-2 pl-8 pr-3 font-sans text-sm text-vous-black outline-none focus:bg-vous-cream data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <_ItemIndicator>
        <Check size={12} />
      </_ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </_Item>
));
SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-vous-border/40", className)}
      {...props}
    />
  )
);
SelectSeparator.displayName = "SelectSeparator";

export {
  Select, SelectGroup, SelectValue, SelectTrigger, SelectContent,
  SelectLabel, SelectItem, SelectSeparator,
};
