import { useEffect, useMemo } from "react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { useSWRConfig } from "swr";

import { usePrivateFetcher } from "@/hooks";

import {
  AlertInputError,
  GroupInput,
  InputField,
  Loader,
  Select,
  SelectCreateable,
  SelectItem,
  SelectItemDefault,
} from "@/components";

import { stringToNumber } from "@/utils";

import {
  AddLandLabel,
  LandManagementCustomPlaceholder,
  LandManagementGroupInput,
  PricingAndPaymentTermsAddItem,
  PricingAndPaymentTermsDeleteItem,
  PricingAndPaymentTermsTaxItem,
  getAddLandLayout,
  useUpdateTaxFeesValue,
} from "@/features/land-management";

const PricingAndPaymentTerms = ({ taxTypes, includedWithinPriceItems }) => {
  const config = useSWRConfig();
  const { data: paymentTermsData, isLoading: isLoadingPaymentTerms } =
    usePrivateFetcher(
      [process.env.NEXT_PUBLIC_ENDPOINT_PAYMENT_TERMS_READ, {}],
      config
    );

  const {
    control,
    getValues,
    setValue,
    clearErrors,
    formState: { isSubmitting, isSubmitted },
  } = useFormContext();

  const updateTaxFeesValue = useUpdateTaxFeesValue(setValue, getValues);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "taxFees",
  });

  const [watchTaxFees, watchFees] = useWatch({
    control,
    name: ["taxFees", "fees"],
  });

  const controlledTaxFeesFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchTaxFees[index],
    };
  });

  const paymentTermsOptions = useMemo(() => {
    if (paymentTermsData?.data?.attributes.length === 0) return [];

    return paymentTermsData?.data?.attributes?.map(
      ({ payment_term: paymentTerm }) => ({
        value: paymentTerm,
        label: paymentTerm,
      })
    );
  }, [paymentTermsData?.data?.attributes]);

  const addItemButtonIsDisabled = useMemo(() => {
    const lastControlledTaxFeesFieldValues = Object.values(
      controlledTaxFeesFields[controlledTaxFeesFields.length - 1]
    );

    const hasLessThanFourTruthyValues =
      lastControlledTaxFeesFieldValues.filter((value) => value !== "").length <
      4;

    const hasExactlyTwoEntries =
      Object.entries(controlledTaxFeesFields).length === 2;

    const isDisabled = hasLessThanFourTruthyValues || hasExactlyTwoEntries;

    return isDisabled;
  }, [controlledTaxFeesFields]);

  const optionalRequiredFields = useMemo(() => {
    const isOneFieldFeesFilled = Object.values(watchFees).some(Boolean);

    const taxFeesFilledItems = Object.values(controlledTaxFeesFields).filter(
      ({ includedWithinPrice, percentage, taxType }) =>
        Boolean(includedWithinPrice) || percentage !== "" || Boolean(taxType)
    );

    return { isFeesRequired: isOneFieldFeesFilled, taxFeesFilledItems };
  }, [watchFees, controlledTaxFeesFields]);

  useEffect(() => {
    const isOneFieldFeesFilled = Object.values(watchFees).some(Boolean);

    const [firstTaxTypeValue, secondTaxTypeValue] = [
      controlledTaxFeesFields[0]?.taxType,
      controlledTaxFeesFields[1]?.taxType,
    ];

    if (firstTaxTypeValue === secondTaxTypeValue) {
      remove(1);
      updateTaxFeesValue();
    }

    if (!isOneFieldFeesFilled && isSubmitted) {
      const fieldsToClear = [
        "fees.price",
        "fees.price_currency",
      ];
      fieldsToClear.forEach((field) => clearErrors(field));
    }
  }, [watchFees, controlledTaxFeesFields, remove, clearErrors, isSubmitted]);

  if (isLoadingPaymentTerms) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">Pricing</h2>

        <LandManagementGroupInput>
          <AddLandLabel
            htmlFor="fees.price_currency"
            isRequired={optionalRequiredFields.isFeesRequired}
          >
            Price Currency
          </AddLandLabel>

          <Controller
            control={control}
            name="fees.price_currency"
            rules={{
              required: {
                value: optionalRequiredFields.isFeesRequired || false,
                message: "Price currency is required",
              },
            }}
            render={({ field, fieldState: { isTouched, error } }) => (
              <>
                <Select
                  {...field}
                  id="fees.price_currency"
                  placeholder="Select a price currency ..."
                  disabled={isSubmitting}
                  isError={error}
                  isSubmitted={isSubmitted}
                  isTouched={isTouched}
                  value={field.value}
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectItemDefault value="">
                    Select a price currency ...
                  </SelectItemDefault>
                  <SelectItem
                    key="select-price-currency-rupiah"
                    value="Rupiah"
                    selected={field.value === "Rupiah" && "Rupiah"}
                  >
                    Rupiah
                  </SelectItem>
                </Select>
                {error && (
                  <p className="text-sm text-red-500" role="alert">
                    {error?.message}
                  </p>
                )}
              </>
            )}
          />
        </LandManagementGroupInput>

        <LandManagementGroupInput>
          <AddLandLabel
            htmlFor="fees.price"
            isRequired={optionalRequiredFields.isFeesRequired}
          >
            Price
          </AddLandLabel>
          <Controller
            control={control}
            name="fees.price"
            rules={{
              required: {
                value: optionalRequiredFields.isFeesRequired || false,
                message: "Price is required",
              },
            }}
            render={({ field, fieldState: { isTouched, error } }) => (
              <>
                <InputField
                  {...field}
                  type="number"
                  id="fees.price"
                  placeholder="Land price"
                  disabled={isSubmitting}
                  isSubmitted={isSubmitted}
                  isTouched={isTouched}
                  isError={error}
                  onChange={(event) => {
                    field.onChange(stringToNumber(event.target.value));
                  }}
                />
                {error ? (
                  <AlertInputError>{error?.message}</AlertInputError>
                ) : (
                  <LandManagementCustomPlaceholder>
                    Example: 500.000.000
                  </LandManagementCustomPlaceholder>
                )}
              </>
            )}
          />
        </LandManagementGroupInput>
      </section>

      {paymentTermsData?.data?.attributes.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-semibold">Payment Terms</h2>

          <div className="grid w-full auto-rows-auto grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-1">
            <GroupInput direction="column">
              <AddLandLabel
                htmlFor="fees.property_payment_terms_name"
              >
                Payment Terms
              </AddLandLabel>

              <Controller
                control={control}
                name="fees.property_payment_terms_name"
                render={({ field, fieldState: { isTouched, error } }) => (
                  <>
                    <div className="h-max">
                      <SelectCreateable
                        {...field}
                        isClearable
                        isSearchable
                        id="fees.property_payment_terms_name"
                        placeholder="Select a payment terms ..."
                        options={paymentTermsOptions}
                        disabled={isSubmitting}
                        isError={error}
                        isSubmitted={isSubmitted}
                        isTouched={isTouched}
                        onValueChange={(value) => {
                          field.onChange(value?.value || "");
                        }}
                        value={
                          field.value === ""
                            ? []
                            : paymentTermsOptions.find(
                                (paymentTerm) =>
                                  paymentTerm.value === field.value
                              ) || {
                                value: field.value,
                                label: field.value,
                              }
                        }
                      />
                    </div>
                    {error && (
                      <AlertInputError>{error?.message}</AlertInputError>
                    )}
                  </>
                )}
              />
            </GroupInput>

            <GroupInput direction="column">
              <AddLandLabel
                htmlFor="fees.lease_term_time"
              >
                Lease Terms
              </AddLandLabel>
              <Controller
                control={control}
                name="fees.lease_term_time"
                render={({ field, fieldState: { isTouched, error } }) => (
                  <>
                    <InputField
                      {...field}
                      type="number"
                      id="fees.lease_term_time"
                      placeholder="Land Lease Terms"
                      disabled={isSubmitting}
                      isSubmitted={isSubmitted}
                      isTouched={isTouched}
                      isError={error}
                      onChange={(event) => {
                        field.onChange(stringToNumber(event.target.value));
                      }}
                    />
                    {error ? (
                      <AlertInputError>{error?.message}</AlertInputError>
                    ) : (
                      <LandManagementCustomPlaceholder>
                        Example: 7&nbsp;
                        {watchFees.lease_term_type === ""
                          ? "(year/month)"
                          : `(${watchFees.lease_term_type.toLowerCase()})`}
                      </LandManagementCustomPlaceholder>
                    )}
                  </>
                )}
              />
            </GroupInput>

            <GroupInput direction="column">
              <AddLandLabel
                htmlFor="fees.lease_term_type"
              >
                Lease Terms Time
              </AddLandLabel>

              <Controller
                control={control}
                name="fees.lease_term_type"
                render={({ field, fieldState: { isTouched, error } }) => (
                  <>
                    <div className="h-max">
                      <Select
                        {...field}
                        id="fees.lease_term_type"
                        placeholder="Select a lease terms time ..."
                        disabled={isSubmitting}
                        isError={error}
                        isSubmitted={isSubmitted}
                        isTouched={isTouched}
                        value={field.value}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectItemDefault value="">
                          Select a lease terms time ...
                        </SelectItemDefault>
                        <SelectItem
                          value="Month"
                          selected={field.value === "Month" && "Month"}
                        >
                          Month
                        </SelectItem>
                        <SelectItem
                          value="Year"
                          selected={field.value === "Year" && "Year"}
                        >
                          Year
                        </SelectItem>
                      </Select>
                    </div>
                    {error && (
                      <AlertInputError>{error?.message}</AlertInputError>
                    )}
                  </>
                )}
              />
            </GroupInput>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold">Tax</h2>

          <div className="flex flex-col gap-12">
            {controlledTaxFeesFields.map((field, index) => {
              const isTaxFeeRequired =
                (optionalRequiredFields.taxFeesFilledItems?.[index] && true) ||
                false;

              return (
                <div className="flex flex-col items-start gap-1" key={field.id}>
                  <PricingAndPaymentTermsTaxItem
                    index={index}
                    control={control}
                    isSubmitting={isSubmitting}
                    isSubmitted={isSubmitted}
                    taxTypes={taxTypes}
                    includedWithinPriceItems={includedWithinPriceItems}
                    isTaxFeeRequired={isTaxFeeRequired}
                    firstTaxTypeValue={controlledTaxFeesFields[0].taxType}
                  />

                  {controlledTaxFeesFields.length > 1 && (
                    <PricingAndPaymentTermsDeleteItem
                      onClick={() => {
                        remove(index);
                        updateTaxFeesValue();
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <PricingAndPaymentTermsAddItem
          disabled={addItemButtonIsDisabled}
          onClick={() => {
            append({
              taxType: "",
              percentage: "",
              includedWithinPrice: "",
            });
          }}
        />
      </section>
    </>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      landPaymentTermsName: ["Full in Advance", "Half in Advance"],
      taxTypes: ["Value Added Tax", "Withholding Tax"],
      includedWithinPriceItems: [
        { value: "Included", status: "Included" },
        { value: "Exluded", status: "Exluded" },
      ],
    },
  };
}

PricingAndPaymentTerms.getLayout = getAddLandLayout;

export default PricingAndPaymentTerms;
