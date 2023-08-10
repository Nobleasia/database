import * as AlertDialogRadix from "@radix-ui/react-alert-dialog"
import cn from "classnames"
import { forwardRef } from "react"

import styles from "./AlertDialog.module.css"

export const AlertDialogCancel = AlertDialogRadix.Cancel
export const AlertDialogAction = AlertDialogRadix.Action
export const AlertDialogRoot = AlertDialogRadix.Root
export const AlertDialogTrigger = AlertDialogRadix.Trigger
export const AlertDialogPortal = AlertDialogRadix.Portal

export const AlertDialogOverlay = forwardRef(({ ...props }, forwardedRef) => {
  return (
    <AlertDialogRadix.Overlay
      {...props}
      ref={forwardedRef}
      className={cn(props.className, styles.AlertDialogOverlay)}
    />
  )
})

export const AlertDialogContent = forwardRef(
  ({ children, ...props }, forwardedRef) => {
    return (
      <AlertDialogRadix.Content
        {...props}
        ref={forwardedRef}
        className={cn(props.className, styles.AlertDialogContent)}
      >
        {children}
      </AlertDialogRadix.Content>
    )
  }
)

export const AlertDialogTitle = forwardRef(
  ({ children, ...props }, forwardedRef) => {
    return (
      <AlertDialogRadix.Content
        {...props}
        ref={forwardedRef}
        className={cn(props.className, styles.AlertDialogTitle)}
      >
        {children}
      </AlertDialogRadix.Content>
    )
  }
)

export const AlertDialogDescription = forwardRef(
  ({ children, ...props }, forwardedRef) => {
    return (
      <AlertDialogRadix.Content
        {...props}
        ref={forwardedRef}
        className={cn(props.className, styles.AlertDialogDescription)}
      >
        {children}
      </AlertDialogRadix.Content>
    )
  }
)

AlertDialogOverlay.displayName = "AlertDialogOverlay"
AlertDialogContent.displayName = "AlertDialogContent"
AlertDialogTitle.displayName = "AlertDialogTitle"
AlertDialogDescription.displayName = "AlertDialogDescription"
