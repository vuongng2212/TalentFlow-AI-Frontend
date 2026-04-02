import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export interface CrudDialogProps {
  /** Title of the dialog */
  title: string
  /** Description text below the title */
  description?: string
  /** The content of the dialog (usually a form) */
  children: React.ReactNode
  /** Controls the open state of the dialog */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Trigger element (optional, if controlled externally) */
  trigger?: React.ReactNode
  /** Control the dialog max width */
  className?: string
}

export function CrudDialog({
  title,
  description,
  children,
  open,
  onOpenChange,
  trigger,
  className = "sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px]",
}: CrudDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={`flex flex-col gap-0 p-0 overflow-hidden ${className}`}
      >
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {/* Scrollable Form Content Container */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto overflow-x-hidden relative">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
