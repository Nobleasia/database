import { Controller, useFormContext } from "react-hook-form";

import {
  AlertInputError,
  GroupInput,
  InputField,
  Select,
  SelectItem,
  SelectItemDefault,
} from "@/components";

import { stringToNumber } from "@/utils";

import { useUpdateTaxFeesValue } from "../hooks";
import { AddOfficeLabel } from "./add-office-label";
import { OfficeManagementCustomPlaceholder } from "./office-management-custom-placeholder";

export const PricingAndPaymentTermsTaxItem = ({
  id,
  index,
  taxTypes,
  includedWithinPriceItems,
  isTaxFeeRequired,
  firstTaxTypeValue,
}) => {
  const {
    control,
    setValue,
    getValues,
    formState: { isSubmitting, isSubmitted },
  } = useFormContext();

  const updateTaxFeesValue = useUpdateTaxFeesValue(setValue, getValues);

  return (
    <div className="grid w-full auto-rows-auto grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-1">
      <GroupInput direction="column">
        <AddOfficeLabel
          htmlFor={`taxFees.${index}.taxType`}
          isRequired={isTaxFeeRequired}
        >
          Tax Type
        </AddOfficeLabel>

        <Controller
          control={control}
          name={`taxFees.${index}.taxType`}
          rules={{
            required: {
              value: isTaxFeeRequired,
              message: "Tax type is required",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <div className="h-max">
                <Select
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Select a tax type"
                  id={`taxFees.${index}.taxType`}
                  isError={error}
                  isSubmitted={isSubmitted}
                  isTouched={isTouched}
                  value={field.value}
                  defaultValue={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    updateTaxFeesValue();
                  }}
                >
                  <SelectItemDefault value="">
                    Select a tax type ...
                  </SelectItemDefault>
                  {taxTypes.map((item) => (
                    <SelectItem
                      key={`select-tax-type-${item}-${id}`}
                      value={item}
                      disabled={item === firstTaxTypeValue}
                      className=""
                      selected={field.value === item && item}
                    >
                      {item}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              {error && <AlertInputError>{error?.message}</AlertInputError>}
            </>
          )}
        />
      </GroupInput>

      <GroupInput direction="column">
        <AddOfficeLabel
          htmlFor={`taxFees.${index}.percentage`}
          isRequired={isTaxFeeRequired}
        >
          Tax Percentage
        </AddOfficeLabel>
        <Controller
          control={control}
          name={`taxFees.${index}.percentage`}
          rules={{
            required: {
              value: isTaxFeeRequired,
              message: "Percentage is required",
            },
            min: 0,
            max: 100,
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <div className="h-max">
                <InputField
                  {...field}
                  type="number"
                  min={0}
                  max={100}
                  id={`taxFees.${index}.percentage`}
                  placeholder="Enter tax percentage"
                  disabled={isSubmitting}
                  isSubmitted={isSubmitted}
                  isTouched={isTouched}
                  isError={error}
                  onChange={(event) => {
                    field.onChange(stringToNumber(event.target.value));
                    updateTaxFeesValue();
                  }}
                />
              </div>
              {error ? (
                <AlertInputError>{error?.message}</AlertInputError>
              ) : (
                <OfficeManagementCustomPlaceholder>
                  Example: 7 (%)
                </OfficeManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </GroupInput>

      <GroupInput direction="column">
        <AddOfficeLabel
          htmlFor={`taxFees.${index}.includedWithinPrice`}
          isRequired={isTaxFeeRequired}
        >
          Included / Excluded
        </AddOfficeLabel>

        <Controller
          control={control}
          name={`taxFees.${index}.includedWithinPrice`}
          rules={{
            required: {
              value: isTaxFeeRequired,
              message: "Included within price is required",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <div className="h-max">
                <Select
                  {...field}
                  id={`taxFees.${index}.includedWithinPrice`}
                  placeholder="Select a value ..."
                  disabled={isSubmitting}
                  isError={error}
                  isSubmitted={isSubmitted}
                  isTouched={isTouched}
                  value={field.value}
                  defaultValue={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    updateTaxFeesValue();
                  }}
                >
                  <SelectItemDefault value="">
                    Select a inclusion ...
                  </SelectItemDefault>
                  {includedWithinPriceItems.map(({ value, status }) => (
                    <SelectItem
                      key={`select-included-within-price-${status}-${id}`}
                      value={value}
                      selected={field.value === value && status}
                    >
                      {status}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {error && <AlertInputError>{error?.message}</AlertInputError>}
            </>
          )}
        />
      </GroupInput>
    </div>
  );
};
