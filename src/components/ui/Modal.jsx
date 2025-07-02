import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../../lib/utils";

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalPortal = DialogPrimitive.Portal;
const ModalClose = DialogPrimitive.Close;

const ModalContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <ModalPortal>
      <div className="fixed inset-0 flex items-center justify-end bg-black/50">
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "bg-white p-6 rounded-lg shadow-lg animate-in fade-in-90 zoom-in-90",
            className
          )}
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </div>
    </ModalPortal>
  )
);
ModalContent.displayName = "ModalContent";

export { Modal, ModalTrigger, ModalContent, ModalClose };
