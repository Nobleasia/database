import cn from "classnames";
import { forwardRef } from "react";
import Select from "react-select";

import { CustomSelectDropdownIndicator } from "./custom-select-dropdown-indicator";

export const SelectSearchable = forwardRef(
  (
    {
      id = "",
      name = "",
      value = [],
      placeholder = "",
      isError = false,
      disabled = false,
      isSubmitted = false,
      options = [],
      onValueChange = () => {},
      ...props
    },
    forwardedRef
  ) => {
    return (
      <Select
        {...props}
        name={name}
        ref={forwardedRef}
        id={id}
        value={value}
        unstyled
        classNamePrefix="react-select"
        onChange={onValueChange}
        options={options}
        isDisabled={disabled}
        components={{
          CustomSelectDropdownIndicator,
        }}
        placeholder={placeholder}
        classNames={{
          container: () => "flex flex-col relative",
          control: () => {
            return cn(
              "flex h-full items-center justify-between gap-3 truncate rounded-lg border-1 border-npa-neutral-400 bg-npa-neutral-50 px-6 py-4 text-sm text-npa-neutral-500 duration-300 focus-within:shadow-input focus-within:ring-4 focus-within:ring-npa-purple-400/30 focus:outline-none focus:ring-0 hover:border-npa-purple-400",
              {
                "bg-npa-neutral-50 focus:ring-4 focus:ring-npa-purple-400/30 hover:border-npa-purple-400":
                  !disabled && !isError,
                "border-npa-success-500 focus:ring-4 focus:ring-npa-success-500/20 hover:border-npa-success-500":
                  !disabled && !isError && isSubmitted && value.length > 0,
                "border-npa-error-500 focus:ring-4 focus:ring-npa-error-500/20 hover:border-npa-error-500":
                  isError,
                "cursor-not-allowed bg-npa-neutral-200 opacity-60": disabled,
              }
            );
          },
          valueContainer: () => cn("flex flex-wrap gap-2"),
          multiValue: () => "rounded overflow-hidden text-npa-neutral-25",
          multiValueLabel: () => "py-1 px-2 bg-npa-neutral-500",
          multiValueRemove: () =>
            "cursor-pointer py-1 bg-npa-neutral-500  px-2 hover:bg-npa-error-500/50 hover:text-npa-error-800",
          input: () => "text-npa-neutral-600 font-medium",
          indicatorsContainer: () => "flex items-center gap-1",
          indicatorSeparator: () => "bg-[#D9D9D9]",
          dropdownIndicator: () => "cursor-pointer",
          clearIndicator: () => "cursor-pointer",

          menu: () =>
            "border-1 mt-2 py-1 border-npa-neutral-400 rounded-lg absolute bg-npa-neutral-50 py-1",
          option: (state) =>
            cn(
              "px-4 py-2 bg-npa-neutral-50 font-medium text-npa-neutral-500 hover:bg-npa-purple-400 hover:text-npa-neutral-50 active:bg-npa-purple-500 transition-colors duration-100 cursor-pointer",
              {
                "bg-npa-purple-300 text-npa-neutral-50": state.isFocused,
              }
            ),
        }}
      />
    );
  }
);

SelectSearchable.displayName = "SelectSearchable";
