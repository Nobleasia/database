import { Controller } from "react-hook-form";

import { InputField, Label } from "@/components";

import { stringToNumber } from "@/utils";

export const LandManagementFilterMinMaxInputFields = ({
  name = "",
  control = {},
  prefixId = "",
  placeholderPrefix = "",
}) => {
  return (
    <>
      <Controller
        control={control}
        name={`${name}.min`}
        render={({ field, formState: { isTouched, error } }) => (
          <div className="flex w-full flex-col gap-2">
            <Label
              className="font-medium text-npa-neutral-500"
              htmlFor={`${prefixId}-min`}
            >
              Minimum
            </Label>
            <InputField
              {...field}
              type="number"
              min={0}
              id={`${prefixId}-min`}
              placeholder={`Enter min ${placeholderPrefix}`}
              isTouched={isTouched}
              isError={error}
              onChange={(e) => {
                field.onChange(stringToNumber(e.target.value));
              }}
            />
          </div>
        )}
      />
      <Controller
        control={control}
        name={`${name}.max`}
        render={({ field, formState: { isTouched, error } }) => (
          <div className="flex flex-col gap-2">
            <Label
              className="font-medium text-npa-neutral-500"
              htmlFor={`${prefixId}-max`}
            >
              Maximum
            </Label>
            <InputField
              {...field}
              type="number"
              min={0}
              id={`${prefixId}-max`}
              placeholder={`Enter max ${placeholderPrefix}`}
              isTouched={isTouched}
              isError={error}
              onChange={(e) => {
                field.onChange(stringToNumber(e.target.value));
              }}
            />
          </div>
        )}
      />
    </>
  );
};
