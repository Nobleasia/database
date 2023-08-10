import * as ToastRadix from "@radix-ui/react-toast";
import cn from "classnames";
import { forwardRef } from "react";
import {
  MdCheckCircle,
  MdClose,
  MdError,
  MdInfo,
  MdWarningAmber,
} from "react-icons/md";

import { Separator } from "@/components";

import styles from "./Toast.module.css";

export const ToastProvider = ToastRadix.Provider;
export const ToastAction = ToastRadix.Action;

export const ToastViewport = () => {
  return <ToastRadix.Viewport className={styles.ToastViewport} />;
};

const ToastIcon = ({ variant }) => {
  switch (variant) {
    case "success":
      return <MdCheckCircle className="h-full w-full text-npa-success-600" />;
    case "info":
      return <MdInfo className="h-full w-full text-npa-info-600" />;
    case "warning":
      return <MdWarningAmber className="h-full w-full text-npa-warning-600" />;
    case "error":
      return <MdError className="h-full w-full text-npa-error-600" />;
    default:
      return <MdCheckCircle className="h-full w-full text-npa-success-600" />;
  }
};

const ToastTitle = ({ variant }) => {
  const titleObject = {
    success: "Congratulations!",
    info: "Information!",
    warning: "Warning",
    error: "Oops!",
  };

  return (
    <ToastRadix.Title
      className={cn("text-lg font-bold", {
        "text-npa-success-800": variant === "success",
        "text-npa-info-800": variant === "info",
        "text-npa-warning-800": variant === "warning",
        "text-npa-error-800": variant === "error",
      })}
    >
      {titleObject[variant] || titleObject.success}
    </ToastRadix.Title>
  );
};

export const Toast = forwardRef(
  (
    { title, message, children, variant = "success", ...props },
    forwardedRef
  ) => {
    return (
      <ToastRadix.Root
        {...props}
        className={styles.ToastRoot}
        ref={forwardedRef}
      >
        <div className="flex h-full items-center gap-4">
          <div className="flex h-full items-center gap-2">
            <Separator
              orientation="vertical"
              className={cn("h-full w-1 rounded-sm", {
                "bg-npa-success-400":
                  variant === "success" ||
                  (variant !== "info" &&
                    variant !== "warning" &&
                    variant !== "error"),
                "bg-npa-info-400": variant === "info",
                "bg-npa-warning-400": variant === "warning",
                "bg-npa-error-400": variant === "error",
              })}
            />
            <span className="h-8 w-8 items-center">
              <ToastIcon variant={variant} />
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <ToastTitle variant={variant} />
            <ToastRadix.Description
              className={cn("line-clamp-2", {
                "text-npa-success-800": variant === "success",
                "text-npa-info-800": variant === "info",
                "text-npa-warning-800": variant === "warning",
                "text-npa-error-800": variant === "error",
              })}
            >
              {message}
            </ToastRadix.Description>
          </div>
        </div>

        <div className="flex h-full items-center justify-end gap-4">
          {children && children}
          <ToastRadix.Close
            aria-label="Close"
            className={cn("self-start rounded-md", {
              "text-npa-success-800": variant === "success",
              "text-npa-info-800": variant === "info",
              "text-npa-warning-800": variant === "warning",
              "text-npa-error-800": variant === "error",
            })}
          >
            <span aria-hidden>
              <MdClose className="h-5 w-5" />
            </span>
          </ToastRadix.Close>
        </div>
      </ToastRadix.Root>
    );
  }
);

ToastViewport.displayName = "ToastViewport";
Toast.displayName = "Toast";
