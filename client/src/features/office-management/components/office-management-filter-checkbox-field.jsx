import { Controller } from "react-hook-form";

import { Checkbox, Label } from "@/components";

export const OfficeManagementFilterCheckboxField = ({
  id = "",
  name = "",
  itemValue = "",
  control = {},
  onValueChange = () => {},
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              {...field}
              checked={field?.value?.includes(itemValue)}
              id={id}
              onCheckedChange={(value) =>
                onValueChange(value, itemValue, field)
              }
            />
            <Label htmlFor={id}>{itemValue}</Label>
          </div>
        );
      }}
    />
  );
};
