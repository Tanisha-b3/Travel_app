import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

// Root Dialog components
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

// Overlay component with animations
export const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-20 bg-black/80 transition-opacity duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

// Content component for the dialog
export const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[20%] top-[10%] z-50 w-full max-w-lg transform -translate-x-[-50%] -translate-y-[-50%] rounded-lg border bg-white p-6 shadow-lg transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out",
        className
      )}
      {...props}
    >
      {children}
      {/* Close button is already included inside the DialogContent */}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

// Additional components

// DialogHeader component
export const DialogHeader = ({ children, className, ...props }) => (
  <header className={cn("text-lg font-semibold text-gray-800", className)} {...props}>
    {children}
  </header>
);
DialogHeader.displayName = "DialogHeader";

// DialogDescription component
export const DialogDescription = ({ children, className, ...props }) => (
  <p className={cn("text-sm text-gray-600", className)} {...props}>
    {children}
  </p>
);
DialogDescription.displayName = "DialogDescription";
