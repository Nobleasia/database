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
  AddLandLabel,
  LandManagementCustomPlaceholder,
  LandManagementGroupInput,
  PricingAndPaymentTermsAddItem,
  PricingAndPaymentTermsDeleteItem,
  PricingAndPaymentTermsTaxItem,
  getEditLandLayout,
  useUpdateTaxFeesValue,
} from "@/features/land-management"

const PricingAndPaymentTerms = ({ taxTypes, includedWithinPriceItems }) => {
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
        "fees.price",
        "fees.price_currency",
        "fees.property_payment_terms_name",
        "fees.lease_term_time",
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
                  <SelectItem
                    key="select-price-currency-rupiah"
                    value="Rupiah"
                    selected
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
            Price (sqm)
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
                  onChange={(event) =>
                    field.onChange(parseInt(event.target.value, 10) || "")
                  }
                  type="number"
                  id="fees.price"
                  placeholder="Land price"
                  disabled={isSubmitting}
                  isSubmitted={isSubmitted}
                  isTouched={isTouched}
                  isError={error}
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
                      onChange={(event) =>
                        field.onChange(parseInt(event.target.value, 10) || "")
                      }
                      type="number"
                      id="fees.lease_term_time"
                      placeholder="Land Lease Terms"
                      disabled={isSubmitting}
                      isSubmitted={isSubmitted}
                      isTouched={isTouched}
                      isError={error}
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
      landPaymentTermsName: ["Full in Advance", "Half in Advance"],
      taxTypes: ["Value Added Tax", "Withholding Tax"],
      includedWithinPriceItems: [
        { value: "Included", status: "Included" },
        { value: "Excluded", status: "Excluded" },
      ],
    },
  }
}

PricingAndPaymentTerms.getLayout = getEditLandLayout

export default PricingAndPaymentTerms
