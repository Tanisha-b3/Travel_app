import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                   Root                                     */
/* -------------------------------------------------------------------------- */

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

/* -------------------------------------------------------------------------- */
/*                                  Overlay                                   */
/* -------------------------------------------------------------------------- */

export const DialogOverlay = React.forwardRef(
  ({ className, ...props }, ref) => (
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
  )
);
DialogOverlay.displayName = "DialogOverlay";

/* -------------------------------------------------------------------------- */
/*                                  Content                                   */
/* -------------------------------------------------------------------------- */

export const DialogContent = React.forwardRef(
  ({ className, children, hideClose = false, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-50 max-w-lg",
          "-translate-x-1/2 -translate-y-1/2",
          "rounded-xl bg-white dark:bg-gray-900",
          "border border-gray-200",
          "shadow-lg duration-200",
          "focus:outline-none",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          className
        )}
        {...props}
      >
        {children}

        {/* Close Button (single clean X) */}
        {!hideClose && (
          <DialogClose
            className={cn(
              "absolute right-6 top-6 p-2 rounded-md",
              "text-gray-500 hover:text-gray-900",
              
            )}
          >
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = "DialogContent";

/* -------------------------------------------------------------------------- */
/*                                  Header                                    */
/* -------------------------------------------------------------------------- */

export const DialogHeader = ({ className, children, ...props }) => (
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

/* -------------------------------------------------------------------------- */
/*                                  Footer                                    */
/* -------------------------------------------------------------------------- */

export const DialogFooter = ({ className, children, ...props }) => (
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

/* -------------------------------------------------------------------------- */
/*                                   Title                                    */
/* -------------------------------------------------------------------------- */

export const DialogTitle = React.forwardRef(
  ({ className, children, ...props }, ref) => (
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
  )
);
DialogTitle.displayName = "DialogTitle";

/* -------------------------------------------------------------------------- */
/*                                Description                                 */
/* -------------------------------------------------------------------------- */

export const DialogDescription = React.forwardRef(
  ({ className, children, ...props }, ref) => (
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
  )
);
DialogDescription.displayName = "DialogDescription";
