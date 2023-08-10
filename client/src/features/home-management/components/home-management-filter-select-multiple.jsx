import { Controller } from "react-hook-form";

import { Label, SelectSearchable } from "@/components";

export const HomeManagementFilterSelectMultiple = ({
  id = "",
  name = "",
  options = [],
  label = "",
  subLabel = "",
  control = {},
  disabled = false,
  isLoading = false,
  placeholder = "",
  onChangeValue = () => {},
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, formState: { isTouched, error } }) => (
        <>
          <Label htmlFor={id} className="font-semibold">
            {label}
          </Label>

          <div className="flex flex-col gap-2">
            {subLabel && <h3>{subLabel}</h3>}
            <SelectSearchable
              {...field}
              IsSearchable
              isClearable
              isMulti
              placeholder={placeholder}
              id={id}
              isTouched={isTouched}
              isLoading={isLoading}
              disabled={disabled}
              options={options}
              isError={error}
              value={
                field?.value?.map((item) => ({
                  value: item,
                  label: item,
                })) || []
              }
              onValueChange={(value) => onChangeValue(field, value)}
            />
          </div>
        </>
      )}
    />
  );
};
