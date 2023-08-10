import { Controller } from "react-hook-form";

import { Select, SelectItem, SelectItemDefault } from "./select";

export const RowPerPageButton = ({ control, name, id, disabled }) => {
  return (
    <div className="flex w-max flex-col items-start gap-3 xl:flex-row xl:items-center xl:justify-between">
      <span className="whitespace-nowrap">Row per page</span>
      <Controller
        control={control}
        name={name}
        render={({ field, formState: { isTouched, error } }) => (
          <Select
            {...field}
            id={id}
            disabled={disabled}
            placeholder={
              <span className="flex items-center gap-3 font-medium text-npa-neutral-700">
                25
              </span>
            }
            isTouched={isTouched}
            isError={error}
            onValueChange={(value) => {
              field.onChange(value);
            }}
          >
            <SelectItemDefault value={25}>25</SelectItemDefault>
            <SelectItem
              value={5}
              key="select-row-per-page-apartment-management-1"
              selected={field.value}
            >
              5
            </SelectItem>
            <SelectItem
              value={50}
              key="select-row-per-page-apartment-management-3"
              selected={field.value}
            >
              50
            </SelectItem>
          </Select>
        )}
      />
    </div>
  );
};
