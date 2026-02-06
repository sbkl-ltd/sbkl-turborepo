"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@sbkl-turborepo/ui/lib/utils";

interface AlertDialogPaneContextProps {
  value: string | null;
  setValue: (value: string | null) => void;
}

const AlertDialogPaneContext = React.createContext<
  AlertDialogPaneContextProps | undefined
>(undefined);

interface AlertDialogProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Root> {
  defaultValue?: string;
  value?: string | null;
  onValueChange?: (value: string | null) => void;
}

function AlertDialog({
  defaultValue,
  value: externalValue,
  onValueChange,
  ...props
}: AlertDialogProps) {
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

  const contextValue = React.useMemo<AlertDialogPaneContextProps>(
    () => ({ value, setValue }),
    [value, setValue]
  );

  return (
    <AlertDialogPaneContext.Provider value={contextValue}>
      <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
    </AlertDialogPaneContext.Provider>
  );
}

function useAlertDialogPane() {
  const context = React.useContext(AlertDialogPaneContext);

  if (!context) {
    throw new Error(
      "useAlertDialogPane must be used within a AlertDialogPaneContext"
    );
  }
  return context;
}

interface AlertDialogTriggerProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Trigger> {
  value?: string;
}

function AlertDialogTrigger({
  value: valueProp,
  ...props
}: AlertDialogTriggerProps) {
  const { setValue } = useAlertDialogPane();
  return (
    <AlertDialogPrimitive.Trigger
      data-slot="alert-dialog-trigger"
      {...props}
      onClick={() => setValue(valueProp ?? null)}
    />
  );
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

interface AlertDialogContentProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Content> {
  overlayClassNames?: string;
}

function AlertDialogContent({
  overlayClassNames,
  className,
  ...props
}: AlertDialogContentProps) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay className={overlayClassNames} />
      <AlertDialogPrimitive.Content
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

interface AlertDialogPaneProps {
  value: string;
  children: React.ReactNode;
}

function AlertDialogPane({ value: valueProp, children }: AlertDialogPaneProps) {
  const { value } = useAlertDialogPane();
  if (value === valueProp) {
    return <>{children}</>;
  }
  return null;
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row", className)}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return <AlertDialogPrimitive.Action className={cn(className)} {...props} />;
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return <AlertDialogPrimitive.Cancel className={cn(className)} {...props} />;
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogPane,
};
