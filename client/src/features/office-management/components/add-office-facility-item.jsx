import { Controller } from "react-hook-form";

import {
  GroupInput,
  InputField,
  Select,
  SelectItem,
  SelectItemDefault,
} from "@/components";

import { AddOfficeLabel } from "./add-office-label";

export const AddOfficeFacilityItem = ({
  index,
  control,
  isSubmitting,
  isSubmitted,
  propertyFacilitiesName,
}) => {
  return (
    <div className="grid w-[100%] grid-cols-1 grid-rows-3 items-center gap-4 lg:grid-cols-3 lg:grid-rows-1">
      <GroupInput direction="column">
        <AddOfficeLabel htmlFor={`facilities.${index}.propertyFacilityName`}>
          Facility Name
        </AddOfficeLabel>

        <Controller
          control={control}
          name={`facilities.${index}.propertyFacilityName`}
          render={({ field, fieldState: { isTouched, error } }) => (
            <Select
              {...field}
              disabled={isSubmitting}
              placeholder="Select a facility name"
              id={`facilities.${index}.propertyFacilityName`}
              isError={error}
              isSubmitted={isSubmitted}
              isTouched={isTouched}
              value={field.value}
              defaultValue={field.value}
              onValueChange={field.onChange}
            >
              <SelectItemDefault value="">
                Select a facility name ...
              </SelectItemDefault>
              {propertyFacilitiesName.map(({ id, facilityName }) => (
                <SelectItem
                  key={`select-property-facility-name-${facilityName}-${id}`}
                  value={facilityName}
                  selected={field.value === facilityName && facilityName}
                >
                  {facilityName}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </GroupInput>

      <GroupInput direction="column">
        <AddOfficeLabel htmlFor={`facilities.${index}.type`}>
          Facility Type
        </AddOfficeLabel>
        <Controller
          control={control}
          name={`facilities.${index}.type`}
          render={({ field, fieldState: { isTouched, error } }) => (
            <InputField
              {...field}
              type="text"
              id={`facilities.${index}.type`}
              placeholder="Example: Premium"
              disabled={isSubmitting}
              isSubmitted={isSubmitted}
              isTouched={isTouched}
              isError={error}
            />
          )}
        />
      </GroupInput>

      <GroupInput direction="column">
        <AddOfficeLabel htmlFor={`facilities.${index}.unit`}>
          Facility Unit
        </AddOfficeLabel>
        <Controller
          control={control}
          name={`facilities.${index}.unit`}
          render={({ field, fieldState: { isTouched, error } }) => (
            <InputField
              {...field}
              type="number"
              id={`facilities.${index}.unit`}
              placeholder="Example: 7 (units)"
              disabled={isSubmitting}
              isSubmitted={isSubmitted}
              isTouched={isTouched}
              isError={error}
            />
          )}
        />
      </GroupInput>
    </div>
  );
};
