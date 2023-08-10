import * as AccordionRadix from "@radix-ui/react-accordion";
import cn from "classnames";
import { forwardRef } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

import styles from "./Accordion.module.css";

export const AccordionRoot = forwardRef(
  ({ children, ...props }, forwardedRef) => (
    <AccordionRadix.Root
      {...props}
      ref={forwardedRef}
      className={cn(styles.AccordionRoot, props.className)}
    >
      {children}
    </AccordionRadix.Root>
  )
);

export const AccordionItem = forwardRef(
  ({ children, ...props }, forwardedRef) => (
    <AccordionRadix.Item
      {...props}
      ref={forwardedRef}
      className={cn(styles.AccordionItem, props.className)}
    >
      {children}
    </AccordionRadix.Item>
  )
);

export const AccordionTrigger = forwardRef(
  ({ children, ...props }, forwardedRef) => (
    <AccordionRadix.Trigger
      {...props}
      ref={forwardedRef}
      className={cn(styles.AccordionTrigger, props.className)}
    >
      {children}
      <div className={cn(styles.AccordionChevron, "h-5 w-5")}>
        <MdKeyboardArrowDown className="h-full w-full" />
      </div>
    </AccordionRadix.Trigger>
  )
);

export const AccordionHeader = forwardRef(
  ({ children, ...props }, forwardedRef) => (
    <AccordionRadix.Header
      {...props}
      ref={forwardedRef}
      className={cn(styles.AccordionHeader, props.className)}
    >
      {children}
    </AccordionRadix.Header>
  )
);

export const AccordionContent = forwardRef(
  ({ children, ...props }, forwardedRef) => (
    <AccordionRadix.Content
      {...props}
      ref={forwardedRef}
      className={cn(styles.AccordionContent, props.className)}
    >
      {children}
    </AccordionRadix.Content>
  )
);

AccordionRoot.displayName = "AccordionRoot";
AccordionItem.displayName = "AccordionItem";
AccordionTrigger.displayName = "AccordionTrigger";
AccordionHeader.displayName = "AccordionHeader";
AccordionContent.displayName = "AccordionContent";
