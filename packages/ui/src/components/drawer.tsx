"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@sbkl-turborepo/ui/lib/utils";

interface DrawerContextProps {
  value: string | null;
  setValue: (value: string | null) => void;
}

const DrawerPaneContext = React.createContext<DrawerContextProps | undefined>(
  undefined
);

type DrawerProps = React.ComponentProps<typeof DrawerPrimitive.Root> & {
  defaultValue?: string;
  value?: string | null;
  onValueChange?: (value: string | null) => void;
};

function Drawer({
  defaultValue,
  value: externalValue,
  onValueChange,
  ...props
}: DrawerProps) {
  const [internalValue, setInternalValue] = React.useState<string | null>(
    defaultValue ?? null
  );

  // Use external value if provided, otherwise use internal state
  const value = externalValue !== undefined ? externalValue : internalValue;
  const setValue = React.useCallback(
    (newValue: string | null) => {
      if (onValueChange) {
        onValueChange(newValue);
      } else {
        setInternalValue(newValue);
      }
    },
    [onValueChange]
  );

  const contextValue = React.useMemo<DrawerContextProps>(
    () => ({ value, setValue }),
    [value, setValue]
  );

  return (
    <DrawerPaneContext.Provider value={contextValue}>
      <DrawerPrimitive.Root data-slot="drawer" {...props} />
    </DrawerPaneContext.Provider>
  );
}

function useDrawerPane() {
  const context = React.useContext(DrawerPaneContext);

  if (!context) {
    throw new Error("useDrawerPane must be used within a DrawerPaneContext");
  }
  return context;
}

interface DrawerTriggerProps
  extends React.ComponentProps<typeof DrawerPrimitive.Trigger> {
  value?: string;
}

function DrawerTrigger({ value: valueProp, ...props }: DrawerTriggerProps) {
  const { setValue } = useDrawerPane();
  return (
    <DrawerPrimitive.Trigger
      data-slot="drawer-trigger"
      {...props}
      onClick={() => setValue(valueProp ?? null)}
    />
  );
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

interface DrawerContentProps
  extends React.ComponentProps<typeof DrawerPrimitive.Content> {
  overlayClassNames?: string;
}

function DrawerContent({
  className,
  children,
  overlayClassNames,
  ...props
}: DrawerContentProps) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay className={overlayClassNames} />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          className
        )}
        {...props}
      >
        <div className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

interface DrawerPaneProps {
  value: string;
  children: React.ReactNode;
}

function DrawerPane({ value: valueProp, children }: DrawerPaneProps) {
  const { value } = useDrawerPane();
  if (value === valueProp) {
    return <>{children}</>;
  }
  return null;
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerPane,
};
