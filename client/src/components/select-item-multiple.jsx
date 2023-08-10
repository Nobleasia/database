import * as SelectRadix from "@radix-ui/react-select";
import cn from "classnames";
import { forwardRef } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";

import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { ToggleGroupItem, ToggleGroupRoot } from "./toggle-group";

export const SelectMultipleItem = forwardRef(
  (
    { children, selected, value, id, defaultChecked = false, ...props },
    forwardedRef
  ) => {
    return (
      <ToggleGroupItem
        {...props}
        ref={forwardedRef}
        value={value}
        className={cn(
          "relative my-1 flex w-full cursor-pointer items-center gap-2 rounded-md border-none py-2 px-8 text-npa-purple-700 outline-none ring-0 transition-all duration-300 focus:ring-2 focus:ring-npa-purple-700/50 data-[disabled]:cursor-not-allowed data-[state='on']:border-npa-purple-400 data-[state='on']:bg-npa-purple-25 data-[disabled]:opacity-40 hover:bg-npa-purple-700/20",
          {
            "bg-npa-purple-25 font-medium": selected === children,
          }
        )}
      >
        <div className="">
          <Checkbox
            id={id}
            checked={selected}
            defaultChecked={defaultChecked}
            className="data-[state='on']:border-2 data-[state='on']:border-npa-purple-400"
            asChild
          />
        </div>
        <Label htmlFor={id} className="text-current">
          {children}
        </Label>
      </ToggleGroupItem>
    );
  }
);

export const SelectMultiple = forwardRef(
  (
    {
      field,
      id,
      isError,
      isTouched,
      disabled,
      isSubmitted,
      position,
      sideOffset,
      defaultValue,
      placeholder,
      onValueChange,
      keyPrefix = "select-multiple",
      value,
      items,
      ...props
    },
    forwardedRef
  ) => {
    const handleMultipleValueChange = (value) => {
      if (value.length === 0) {
        onValueChange([defaultValue]);
        return;
      }

      if (
        value[0] !== defaultValue &&
        value.includes(defaultValue) &&
        value.length > 1
      ) {
        onValueChange([defaultValue]);
      } else {
        onValueChange([...value].filter((item) => item !== defaultValue));
      }
    };

    return (
      <SelectRadix.Root
        {...props}
        id={id}
        isTouched={isTouched}
        isError={isError}
        onValueChange={onValueChange}
        position={position}
        sideOffset={sideOffset}
      >
        <SelectRadix.Trigger
          id={id}
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
            <div className="flex items-center gap-2">
              <MdKeyboardArrowDown />
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
            className={cn("bg-npa-neutral-50 p-2", {
              "max-h-[50vh]": position === "popper",
            })}
          >
            <ToggleGroupRoot
              {...props}
              type="multiple"
              ref={forwardedRef}
              value={value}
              onValueChange={handleMultipleValueChange}
            >
              <SelectMultipleItem
                value={defaultValue}
                id={`${keyPrefix}-all`}
                selected={value[0] === defaultValue}
              >
                All
              </SelectMultipleItem>

              {items.map((item) => {
                return (
                  <SelectMultipleItem
                    key={`${keyPrefix}-${item.value}`}
                    value={item.value}
                    id={`${keyPrefix}-${id}-${item.value}`}
                    selected={value.includes(item.value)}
                  >
                    {item.label}
                  </SelectMultipleItem>
                );
              })}
            </ToggleGroupRoot>
          </SelectRadix.Viewport>
          <SelectRadix.ScrollDownButton className="flex items-center justify-center bg-npa-purple-25 p-2 shadow-md">
            <MdKeyboardArrowDown />
          </SelectRadix.ScrollDownButton>
        </SelectRadix.Content>
      </SelectRadix.Root>
    );
  }
);

SelectMultiple.displayName = "SelectMultiple";
SelectMultipleItem.displayName = "SelectMultipleItem";
