import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type DivBase = Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect">;
type DivItemRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<DivBase> & React.RefAttributes<HTMLDivElement> & {
    asChild?: boolean; disabled?: boolean; onSelect?: (event: Event) => void; textValue?: string;
  }
>;
type ButtonRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>> & React.RefAttributes<HTMLButtonElement> & { asChild?: boolean }
>;
type DivMenuRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & React.RefAttributes<HTMLDivElement> & {
    sideOffset?: number; alignOffset?: number; align?: "start" | "center" | "end";
    side?: "top" | "right" | "bottom" | "left"; forceMount?: true; loop?: boolean;
  }
>;
type CheckboxItemRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<DivBase> & React.RefAttributes<HTMLDivElement> & {
    checked?: boolean | "indeterminate"; onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean; onSelect?: (event: Event) => void;
  }
>;
type RadioItemRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<DivBase> & React.RefAttributes<HTMLDivElement> & {
    value: string; disabled?: boolean; onSelect?: (event: Event) => void;
  }
>;
type DivLabelRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & React.RefAttributes<HTMLDivElement>
>;
type DivSepRef = React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
>;
type IndicatorRef = React.ForwardRefExoticComponent<
  React.PropsWithChildren<React.HTMLAttributes<HTMLSpanElement>> & React.RefAttributes<HTMLSpanElement>
>;

const _Trigger      = DropdownMenuPrimitive.Trigger      as unknown as ButtonRef;
const _Item         = DropdownMenuPrimitive.Item         as unknown as DivItemRef;
const _SubTrigger   = DropdownMenuPrimitive.SubTrigger   as unknown as DivItemRef;
const _SubContent   = DropdownMenuPrimitive.SubContent   as unknown as DivMenuRef;
const _Content      = DropdownMenuPrimitive.Content      as unknown as DivMenuRef;
const _CheckboxItem = DropdownMenuPrimitive.CheckboxItem as unknown as CheckboxItemRef;
const _RadioItem    = DropdownMenuPrimitive.RadioItem    as unknown as RadioItemRef;
const _Label        = DropdownMenuPrimitive.Label        as unknown as DivLabelRef;
const _Separator    = DropdownMenuPrimitive.Separator    as unknown as DivSepRef;
const _Indicator    = DropdownMenuPrimitive.ItemIndicator as unknown as IndicatorRef;

const DropdownMenu        = DropdownMenuPrimitive.Root;
const DropdownMenuGroup   = DropdownMenuPrimitive.Group;
const DropdownMenuPortal  = DropdownMenuPrimitive.Portal;
const DropdownMenuSub     = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

type ItemWrapperProps = DivBase & { onSelect?: (event: Event) => void; disabled?: boolean; textValue?: string; };

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>> & { asChild?: boolean }>(
  (props, ref) => <_Trigger ref={ref} {...props} />
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const ITEM_BASE = "relative flex cursor-default select-none items-center rounded-xl text-sm outline-none data-[disabled]:opacity-50";

const DropdownMenuSubTrigger = React.forwardRef<HTMLDivElement, React.PropsWithChildren<ItemWrapperProps> & { inset?: boolean }>(
  ({ className, inset, children, ...props }, ref) => (
    <_SubTrigger ref={ref} className={cn("flex px-3 py-2 font-sans text-vous-text focus:bg-amber-50 data-[state=open]:bg-amber-50", ITEM_BASE, inset && "pl-8", className)} {...props}>
      {children}
      <ChevronRight size={14} className="ml-auto" />
    </_SubTrigger>
  )
);

const DropdownMenuSubContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <_SubContent ref={ref} className={cn("z-50 min-w-[8rem] bg-white border border-white/60 rounded-2xl shadow-xl p-1", className)} {...props} />
  )
);

const DropdownMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { sideOffset?: number; align?: "start" | "center" | "end"; side?: "top" | "right" | "bottom" | "left"; }>(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
      <_Content ref={ref} sideOffset={sideOffset} className={cn("z-50 min-w-[160px] bg-white border border-white/60 rounded-2xl shadow-xl shadow-black/5 py-1", className)} {...props} />
    </DropdownMenuPrimitive.Portal>
  )
);

const DropdownMenuItem = React.forwardRef<HTMLDivElement, React.PropsWithChildren<ItemWrapperProps> & { inset?: boolean; asChild?: boolean }>(
  ({ className, inset, ...props }, ref) => (
    <_Item ref={ref} className={cn("gap-2 px-3 py-2 font-sans text-vous-text focus:bg-amber-50", ITEM_BASE, inset && "pl-8", className)} {...props} />
  )
);

const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, React.PropsWithChildren<ItemWrapperProps> & { checked?: boolean | "indeterminate"; onCheckedChange?: (checked: boolean) => void; }>(
  ({ className, children, checked, ...props }, ref) => (
    <_CheckboxItem ref={ref} className={cn("py-2 pl-8 pr-3 font-sans text-vous-text focus:bg-amber-50", ITEM_BASE, className)} checked={checked} {...props}>
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"><_Indicator><Check size={12} /></_Indicator></span>
      {children}
    </_CheckboxItem>
  )
);

const DropdownMenuRadioItem = React.forwardRef<HTMLDivElement, React.PropsWithChildren<ItemWrapperProps> & { value: string }>(
  ({ className, children, ...props }, ref) => (
    <_RadioItem ref={ref} className={cn("py-2 pl-8 pr-3 font-sans text-vous-text focus:bg-amber-50", ITEM_BASE, className)} {...props}>
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"><_Indicator><Circle size={8} className="fill-current" /></_Indicator></span>
      {children}
    </_RadioItem>
  )
);

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }>(
  ({ className, inset, ...props }, ref) => (
    <_Label ref={ref} className={cn("px-3 py-1.5 font-nav text-[10px] tracking-[0.15em] uppercase text-vous-text-secondary", inset && "pl-8", className)} {...props} />
  )
);

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <_Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-gray-100", className)} {...props} />
  )
);

export {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuPortal,
  DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup,
};
