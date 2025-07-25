import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const DialogContent = React.forwardRef(
  ({ className, children, hideClose, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]",
          "rounded-xl bg-white shadow-lg duration-200",
          "border border-gray-200 dark:border-gray-800",
          "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-gray-400",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "dark:bg-gray-900",
          className
        )}
        {...props}
      >
        {children}
        {/* {!hideClose && (
          {/* <DialogClose
            className={cn(
              "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100",
              "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none",
              "data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500 dark:data-[state=open]:bg-gray-800"
            )}
          >
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose> */}
        {/* )} */} 
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

export const DialogHeader = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
DialogHeader.displayName = "DialogHeader";

export const DialogFooter = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
DialogFooter.displayName = "DialogFooter";

export const DialogTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      "text-gray-900 dark:text-gray-50",
      className
    )}
    {...props}
  >
    {children}
  </DialogPrimitive.Title>
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export const DialogDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      "text-sm text-gray-500 dark:text-gray-400",
      className
    )}
    {...props}
  >
    {children}
  </DialogPrimitive.Description>
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;