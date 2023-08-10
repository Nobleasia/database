import * as SelectRadix from "@radix-ui/react-select";
import cn from "classnames";
import { forwardRef } from "react";
import {
  MdCheck,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";

export const Select = forwardRef(
  (
    {
      id,
      value,
      isError,
      children,
      disabled,
      placeholder,
      defaultValue,
      isSubmitted,
      onValueChange,
      position = "item-aligned",
      sideOffset = 0,
      ...props
    },
    forwardedRef
  ) => {
    return (
      <SelectRadix.Root
        {...props}
        onValueChange={onValueChange}
        value={value}
        disabled={disabled}
      >
        <SelectRadix.Trigger
          id={id}
          ref={forwardedRef}
          className={cn(
            "group flex h-full w-full items-center justify-between gap-3 rounded-lg border-1 border-npa-neutral-400 bg-npa-neutral-50 py-3 px-4 text-left text-npa-neutral-500 duration-300 focus-within:shadow-input focus-within:ring-4 focus-within:ring-npa-purple-400/30 focus:outline-none focus:ring-0 data-[placeholder]:text-sm hover:border-npa-purple-400 md:px-5 xl:py-4 xl:px-6 xl:data-[placeholder]:text-base",
            {
              "bg-npa-neutral-50 focus:ring-4 focus:ring-npa-purple-400/30 hover:border-npa-purple-400":
                !disabled && !isError,
              "border-npa-success-500 focus:ring-4 focus:ring-npa-success-500/20 hover:border-npa-success-500":
                !disabled && !isError && isSubmitted && value.length > 0,
              "border-npa-error-500 focus:ring-4 focus:ring-npa-error-500/20 hover:border-npa-error-500":
                isError,
              "cursor-not-allowed bg-npa-neutral-200": disabled,
            }
          )}
        >
          <span className="truncate">
            <SelectRadix.Value placeholder={placeholder} />
          </span>
          <SelectRadix.Icon>
            <div className="flex items-center gap-2 text-npa-neutral-500">
              <MdKeyboardArrowDown className="h-5 w-5" />
              <RiErrorWarningFill
                className={cn("h-6 w-6 text-npa-error-500", {
                  hidden: !isError,
                  block: isError,
                })}
              />
            </div>
          </SelectRadix.Icon>
        </SelectRadix.Trigger>

        <SelectRadix.Content
          className="z-[99] overflow-hidden rounded-lg border-1 shadow-lg"
          position={position}
          sideOffset={sideOffset}
        >
          <SelectRadix.ScrollUpButton className="flex items-center justify-center bg-npa-purple-25 p-2 shadow-md">
            <MdKeyboardArrowUp />
          </SelectRadix.ScrollUpButton>
          <SelectRadix.Viewport
            ref={forwardedRef}
            className={cn("bg-npa-neutral-50 p-2", {
              "max-h-[50vh]": position === "popper",
            })}
          >
            {children}
          </SelectRadix.Viewport>
          <SelectRadix.ScrollDownButton className="flex items-center justify-center bg-npa-purple-25 p-2 shadow-md">
            <MdKeyboardArrowDown />
          </SelectRadix.ScrollDownButton>
        </SelectRadix.Content>
      </SelectRadix.Root>
    );
  }
);

export const SelectItemDefault = forwardRef(
  ({ children, value, ...props }, forwardedRef) => {
    return (
      <SelectRadix.Item
        {...props}
        value={value}
        textValue="None"
        className="relative my-1 flex cursor-pointer items-center gap-2 rounded-md border-none bg-npa-neutral-100 py-2 px-8 text-npa-purple-700 opacity-50 outline-none ring-0 transition-all duration-300 focus:ring-2 focus:ring-npa-purple-700/50 hover:bg-npa-purple-700/20"
        ref={forwardedRef}
      >
        <SelectRadix.ItemText>{children}</SelectRadix.ItemText>
      </SelectRadix.Item>
    );
  }
);

export const SelectItem = forwardRef(
  ({ children, selected, ...props }, forwardedRef) => {
    return (
      <SelectRadix.Item
        {...props}
        ref={forwardedRef}
        className={cn(
          "relative my-1 flex cursor-pointer items-center gap-2 rounded-md border-none py-2 px-8 text-npa-purple-700 outline-none ring-0 transition-all duration-300 focus:bg-npa-purple-700/20 focus:ring-2 focus:ring-npa-purple-700/50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 hover:bg-npa-purple-700/20",
          {
            "bg-npa-purple-25 font-medium": selected === children,
          }
        )}
      >
        <SelectRadix.ItemIndicator className="absolute left-2 inline-flex items-center">
          <MdCheck />
        </SelectRadix.ItemIndicator>
        <SelectRadix.ItemText>{children}</SelectRadix.ItemText>
      </SelectRadix.Item>
    );
  }
);

Select.displayName = "Select";
SelectItem.displayName = "SelectItem";
SelectItemDefault.displayName = "SelectItemDefault";
