import { useEffect, useMemo } from "react"
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { useSWRConfig } from "swr"

import { usePrivateFetcher } from "@/hooks"

import {
  AlertInputError,
  GroupInput,
  InputField,
  Loader,
  Select,
  SelectCreateable,
  SelectItem,
  SelectItemDefault,
} from "@/components"

import {
  AddOfficeLabel,
  OfficeManagementCustomPlaceholder,
  OfficeManagementGroupInput,
  PricingAndPaymentTermsAddItem,
  PricingAndPaymentTermsDeleteItem,
  PricingAndPaymentTermsTaxItem,
  getEditOfficeLayout,
  useUpdateTaxFeesValue,
} from "@/features/office-management"

const PricingAndPaymentTerms = ({
  priceCurrencies,
  taxTypes,
  includedWithinPriceItems,
  overtimeTime,
}) => {
  const config = useSWRConfig()
  const { data: paymentTermsData, isLoading: isLoadingPaymentTerms } =
    usePrivateFetcher(
      [process.env.NEXT_PUBLIC_ENDPOINT_PAYMENT_TERMS_READ, {}],
      config
    )

  const {
    control,
    getValues,
    setValue,
    clearErrors,
    formState: { isSubmitting, isSubmitted },
  } = useFormContext()

  const updateTaxFeesValue = useUpdateTaxFeesValue(setValue, getValues)

  const { fields, append, remove } = useFieldArray({
    control,
    name: "taxFees",
  })

  const [watchPaymentTerms, watchTaxFees, watchFees] = useWatch({
    control,
    name: ["fees.property_payment_terms_name", "taxFees", "fees"],
  })

  const paymentTermsOptions = useMemo(() => {
    if (paymentTermsData?.data?.attributes.length === 0) return []

    return paymentTermsData?.data?.attributes?.map(
      ({ payment_term: paymentTerm }) => ({
        value: paymentTerm,
        label: paymentTerm,
      })
    )
  }, [paymentTermsData?.data?.attributes])

  const controlledTaxFeesFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchTaxFees[index],
    }
  })

  const addItemButtonIsDisabled = useMemo(() => {
    const lastControlledTaxFeesFieldValues = Object.values(
      controlledTaxFeesFields[controlledTaxFeesFields.length - 1]
    )

    const hasLessThanFourTruthyValues =
      lastControlledTaxFeesFieldValues.filter((value) => value !== "").length <
      4

    const hasExactlyTwoEntries =
      Object.entries(controlledTaxFeesFields).length === 2

    const isDisabled = hasLessThanFourTruthyValues || hasExactlyTwoEntries

    return isDisabled
  }, [controlledTaxFeesFields])

  const optionalRequiredFields = useMemo(() => {
    const isOneFieldFeesFilled = Object.values(watchFees).some(Boolean)

    const taxFeesFilledItems = Object.values(controlledTaxFeesFields).filter(
      ({ includedWithinPrice, percentage, taxType }) =>
        Boolean(includedWithinPrice) || percentage !== "" || Boolean(taxType)
    )

    return { isFeesRequired: isOneFieldFeesFilled, taxFeesFilledItems }
  }, [watchFees, controlledTaxFeesFields])

  useEffect(() => {
    const isOneFieldFeesFilled = Object.values(watchFees).some(Boolean)

    const [firstTaxTypeValue, secondTaxTypeValue] = [
      controlledTaxFeesFields[0]?.taxType,
      controlledTaxFeesFields[1]?.taxType,
    ]

    if (firstTaxTypeValue === secondTaxTypeValue) {
      remove(1)
      updateTaxFeesValue()
    }

    if (!isOneFieldFeesFilled && isSubmitted) {
      const fieldsToClear = [
        "fees.rental_price",
        "fees.selling_price",
        "fees.price_currency",
        "fees.property_payment_terms_name",
        "fees.lease_term_time",
        "fees.service_charge_price",
        "fees.overtime_price",
        "fees.overtime_time",
      ]
      fieldsToClear.forEach((field) => clearErrors(field))
    }
  }, [watchFees, controlledTaxFeesFields, remove, clearErrors, isSubmitted])

  if (isLoadingPaymentTerms) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <>
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">Pricing</h2>

        <OfficeManagementGroupInput>
          <AddOfficeLabel
            htmlFor="fees.price_currency"
            isRequired={optionalRequiredFields.isFeesRequired}
          >
            Price Currency
          </AddOfficeLabel>

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
                  {priceCurrencies.map((item) => (
                    <SelectItem
                      key={`select-price-currency-${item}`}
                      value={item}
                      selected={field.value === item && item}
                    >
                      {item}
                    </SelectItem>
                  ))}
                </Select>
                {error && (
                  <p className="text-sm text-red-500" role="alert">
                    {error?.message}
                  </p>
                )}
              </>
            )}
          />
        </OfficeManagementGroupInput>

        <OfficeManagementGroupInput>
          <AddOfficeLabel
            htmlFor="fees.rental_price"
            isRequired={optionalRequiredFields.isFeesRequired}
          >
            Rental Price
          </AddOfficeLabel>
          <Controller
            control={control}
            name="fees.rental_price"
            rules={{
              required: {
                value: optionalRequiredFields.isFeesRequired || false,
                message: "Rental price is required",
              },
            }}
            render={({ field, fieldState: { isTouched, error } }) => (
              <>
                <InputField
                  {...field}
                  onChange={(event) =>
                    field.onChange(parseInt(event.target.value, 10) || "")
                  }
                  type="number"
                  id="fees.rental_price"
                  placeholder="Office rental price"
                  disabled={isSubmitting}
                  isSubmitted={isSubmitted}
                  isTouched={isTouched}
                  isError={error}
                />
                {error ? (
                  <AlertInputError>{error?.message}</AlertInputError>
                ) : (
                  <OfficeManagementCustomPlaceholder>
                    Example: 500.000.000
                  </OfficeManagementCustomPlaceholder>
                )}
              </>
            )}
          />
        </OfficeManagementGroupInput>

        <OfficeManagementGroupInput>
          <AddOfficeLabel
            htmlFor="fees.selling_price"
            isRequired={optionalRequiredFields.isFeesRequired}
          >
            Selling Price
          </AddOfficeLabel>
          <Controller
            control={control}
            name="fees.selling_price"
            rules={{
              required: {
                value: optionalRequiredFields.isFeesRequired || false,
                message: "Sell price is required",
              },
            }}
            render={({ field, fieldState: { isTouched, error } }) => (
              <>
                <InputField
                  {...field}
                  onChange={(event) =>
                    field.onChange(parseInt(event.target.value, 10) || "")
                  }
                  type="number"
                  id="fees.selling_price"
                  placeholder="Office sell price"
                  disabled={isSubmitting}
                  isSubmitted={isSubmitted}
                  isTouched={isTouched}
                  isError={error}
                />
                {error ? (
                  <AlertInputError>{error?.message}</AlertInputError>
                ) : (
                  <OfficeManagementCustomPlaceholder>
                    Example: 500.000.000
                  </OfficeManagementCustomPlaceholder>
                )}
              </>
            )}
          />
        </OfficeManagementGroupInput>

        <OfficeManagementGroupInput>
          <AddOfficeLabel
            htmlFor="fees.service_charge_price"
            isRequired={optionalRequiredFields.isFeesRequired}
          >
            Service Charge
          </AddOfficeLabel>
          <Controller
            control={control}
            name="fees.service_charge_price"
            rules={{
              required: {
                value: optionalRequiredFields.isFeesRequired || false,
                message: "Service charge price is required",
              },
            }}
            render={({ field, fieldState: { isTouched, error } }) => (
              <>
                <InputField
                  {...field}
                  onChange={(event) =>
                    field.onChange(parseInt(event.target.value, 10) || "")
                  }
                  type="number"
                  id="fees.service_charge_price"
                  placeholder="Office service charge price"
                  disabled={isSubmitting}
                  isSubmitted={isSubmitted}
                  isTouched={isTouched}
                  isError={error}
                />
                {error ? (
                  <AlertInputError>{error?.message}</AlertInputError>
                ) : (
                  <OfficeManagementCustomPlaceholder>
                    Example: 500.000.000
                  </OfficeManagementCustomPlaceholder>
                )}
              </>
            )}
          />
        </OfficeManagementGroupInput>

        <div className="flex w-full flex-col gap-4 lg:flex-row">
          <OfficeManagementGroupInput>
            <AddOfficeLabel
              htmlFor="fees.overtime_price"
              isRequired={optionalRequiredFields.isFeesRequired}
            >
              Service Charge
            </AddOfficeLabel>
            <Controller
              control={control}
              name="fees.overtime_price"
              rules={{
                required: {
                  value: optionalRequiredFields.isFeesRequired || false,
                  message: "Overtime price is required",
                },
              }}
              render={({ field, fieldState: { isTouched, error } }) => (
                <>
                  <InputField
                    {...field}
                    onChange={(event) =>
                      field.onChange(parseInt(event.target.value, 10) || "")
                    }
                    type="number"
                    id="fees.overtime_price"
                    placeholder="Office overtime price"
                    disabled={isSubmitting}
                    isSubmitted={isSubmitted}
                    isTouched={isTouched}
                    isError={error}
                  />
                  {error ? (
                    <AlertInputError>{error?.message}</AlertInputError>
                  ) : (
                    <OfficeManagementCustomPlaceholder>
                      Example: 500.000.000
                    </OfficeManagementCustomPlaceholder>
                  )}
                </>
              )}
            />
          </OfficeManagementGroupInput>

          <OfficeManagementGroupInput>
            <AddOfficeLabel
              htmlFor="fees.overtime_time"
              isRequired={optionalRequiredFields.isFeesRequired}
            >
              Price Currency
            </AddOfficeLabel>

            <Controller
              control={control}
              name="fees.overtime_time"
              rules={{
                required: {
                  value: optionalRequiredFields.isFeesRequired || false,
                  message: "Overtime type is required",
                },
              }}
              render={({ field, fieldState: { isTouched, error } }) => (
                <>
                  <Select
                    {...field}
                    id="fees.overtime_type"
                    placeholder="Select an overtime type ..."
                    disabled={isSubmitting}
                    isError={error}
                    isSubmitted={isSubmitted}
                    isTouched={isTouched}
                    value={field.value}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectItemDefault value="">
                      Select a overtime type ...
                    </SelectItemDefault>
                    {overtimeTime.map((item) => (
                      <SelectItem
                        key={`select-service-charge-type-${item}`}
                        value={item}
                        selected={field.value === item && item}
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </Select>
                  {error ? (
                    <AlertInputError>{error?.message}</AlertInputError>
                  ) : (
                    <OfficeManagementCustomPlaceholder>
                      Example: Month
                    </OfficeManagementCustomPlaceholder>
                  )}
                </>
              )}
            />
          </OfficeManagementGroupInput>
        </div>

        <OfficeManagementGroupInput>
          <AddOfficeLabel htmlFor="security_deposit">
            Security Deposit
          </AddOfficeLabel>
          <Controller
            control={control}
            name="security_deposit"
            render={({ field, fieldState: { isTouched, error } }) => (
              <>
                <InputField
                  {...field}
                  type="text"
                  id="security_deposit"
                  placeholder="Office security deposit"
                  disabled={isSubmitting}
                  isSubmitted={isSubmitted}
                  isTouched={isTouched}
                  isError={error}
                  onChange={(event) => {
                    field.onChange(event.target.value)
                  }}
                />
                <OfficeManagementCustomPlaceholder>
                  Example: -
                </OfficeManagementCustomPlaceholder>
              </>
            )}
          />
        </OfficeManagementGroupInput>
      </section>

      {paymentTermsData?.data?.attributes.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-semibold">Payment Terms</h2>

          <div className="grid w-full auto-rows-auto grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-1">
            <GroupInput direction="column">
              <AddOfficeLabel
                htmlFor="fees.property_payment_terms_name"
                isRequired={optionalRequiredFields.isFeesRequired}
              >
                Payment Terms
              </AddOfficeLabel>

              <Controller
                control={control}
                name="fees.property_payment_terms_name"
                rules={{
                  required: {
                    value: optionalRequiredFields.isFeesRequired || false,
                    message: "Office payment terms name is required",
                  },
                }}
                render={({ field, fieldState: { isTouched, error } }) => (
                  <>
                    <div className="h-max">
                      <SelectCreateable
                        {...field}
                        isClearable
                        isSearchable
                        defaultValue={paymentTermsData?.data?.attributes
                          .filter(
                            (paymentTerm) =>
                              paymentTerm.region_name === watchPaymentTerms
                          )
                          .map((paymentTerm) => ({
                            value: paymentTerm.region_name,
                            label: paymentTerm.region_name,
                          }))}
                        id="fees.property_payment_terms_name"
                        placeholder="Select a payment terms ..."
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
                        disabled={isSubmitting}
                        isError={error}
                        isSubmitted={isSubmitted}
                        isTouched={isTouched}
                        onValueChange={(value) => {
                          field.onChange(value?.value || "")
                        }}
                        options={paymentTermsData?.data?.attributes.map(
                          ({ payment_term: paymentTerm }) => ({
                            label: paymentTerm,
                            value: paymentTerm,
                          })
                        )}
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
              <AddOfficeLabel
                htmlFor="fees.lease_term_time"
                isRequired={optionalRequiredFields.isFeesRequired}
              >
                Lease Terms
              </AddOfficeLabel>
              <Controller
                control={control}
                name="fees.lease_term_time"
                rules={{
                  required: {
                    value: optionalRequiredFields.isFeesRequired || false,
                    message: "Lease terms is required",
                  },
                }}
                render={({ field, fieldState: { isTouched, error } }) => (
                  <>
                    <InputField
                      {...field}
                      onChange={(event) =>
                        field.onChange(parseInt(event.target.value, 10) || "")
                      }
                      type="number"
                      id="fees.lease_term_time"
                      placeholder="Office Lease Terms"
                      disabled={isSubmitting}
                      isSubmitted={isSubmitted}
                      isTouched={isTouched}
                      isError={error}
                    />
                    {error ? (
                      <AlertInputError>{error?.message}</AlertInputError>
                    ) : (
                      <OfficeManagementCustomPlaceholder>
                        Example: 7&nbsp;
                        {watchFees.lease_term_type === ""
                          ? "(year/month)"
                          : `(${watchFees.lease_term_type.toLowerCase()})`}
                      </OfficeManagementCustomPlaceholder>
                    )}
                  </>
                )}
              />
            </GroupInput>

            <GroupInput direction="column">
              <AddOfficeLabel
                htmlFor="fees.lease_term_type"
                isRequired={optionalRequiredFields.isFeesRequired}
              >
                Lease Terms Time
              </AddOfficeLabel>

              <Controller
                control={control}
                name="fees.lease_term_type"
                rules={{
                  required: {
                    value: optionalRequiredFields.isFeesRequired || false,
                    message: "Lease terms time is required",
                  },
                }}
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

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold">Tax</h2>

        <div className="flex flex-col gap-12">
          {controlledTaxFeesFields.map((field, index) => {
            const isTaxFeeRequired =
              (optionalRequiredFields.taxFeesFilledItems?.[index] && true) ||
              false

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
                      remove(index)
                      updateTaxFeesValue()
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>

        <PricingAndPaymentTermsAddItem
          disabled={addItemButtonIsDisabled}
          onClick={() =>
            append({
              taxType: "",
              percentage: "",
              includedWithinPrice: "",
            })
          }
        />
      </section>
    </>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      serviceChargeTime: ["Month", "Year"],
      overtimeTime: ["Hour", "Day"],
      priceCurrencies: ["Rupiah", "US Dollar"],
      officePaymentTermsName: ["Full in Advance", "Half in Advance"],
      taxTypes: ["Value Added Tax", "Withholding Tax"],
      includedWithinPriceItems: [
        { value: "Included", status: "Included" },
        { value: "Excluded", status: "Excluded" },
      ],
    },
  }
}

PricingAndPaymentTerms.getLayout = getEditOfficeLayout

export default PricingAndPaymentTerms
