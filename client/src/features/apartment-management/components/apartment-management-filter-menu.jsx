import cn from "classnames"
import { useMemo } from "react"
import { MdClose, MdFilterList } from "react-icons/md"

import { usePrivateFetcher } from "@/hooks"

import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components"

import { ApartmentManagementFilterCheckboxField } from "./apartment-management-filter-checkbox-field"
import { ApartmentManagementFilterMinMaxInputFields } from "./apartment-management-filter-min-max-input-fields"
import { ApartmentManagementFilterSelectMultiple } from "./apartment-management-filter-select-multiple"

const furnishingItems = [
  {
    id: "unfurnished",
    label: "Unfurnished",
    value: "Unfurnished",
  },
  {
    id: "semi-furnished",
    name: "Semi Furnished",
    value: "Semi Furnished",
  },
  {
    id: "fully-furnished",
    label: "Fully Furnished",
    value: "Fully Furnished",
  },
]

const availabilityItems = [
  {
    id: "yes",
    label: "Yes",
    value: "Yes",
  },
  {
    id: "no",
    label: "No",
    value: "No",
  },
]

const roomsItems = [
  {
    id: "bedroom",
    title: "Bedroom",
    name: "bedroom",
  },
  {
    id: "bathroom",
    title: "Bathroom",
    name: "bathroom",
  },
  {
    id: "study-room",
    title: "Study Room",
    name: "study_room",
  },
]

const priceCurrencies = [
  {
    id: "rupiah",
    label: "Rupiah",
    value: "Rupiah",
  },
  {
    id: "dollar",
    label: "Dollar",
    value: "US Dollar",
  },
]

const propertyPrices = [
  {
    id: "rental-price",
    title: "Rental Price",
    name: "rental_price",
  },
  {
    id: "selling-price",
    title: "Selling Price",
    name: "selling_price",
  },
]

const leaseTermsTypes = [
  {
    id: "month",
    label: "Month",
    value: "Month",
  },
  {
    id: "year",
    label: "Year",
    value: "Year",
  },
]

export const ApartmentManagementFilterMenu = ({
  control,
  reset,
  filterValues,
  onApplyingFilter,
}) => {
  const fetcherConfig = {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  }
  const {
    data: apartmentPropertyAreaData,
    isLoading: apartmentPropertyAreaDataIsLoading,
  } = usePrivateFetcher(
    [process.env.NEXT_PUBLIC_ENDPOINT_PROPERTY_AREA_READ, {}],
    fetcherConfig
  )
  const {
    data: apartmentPaymentTermData,
    isLoading: apartmentPaymentTermDataIsLoading,
  } = usePrivateFetcher(
    [process.env.NEXT_PUBLIC_ENDPOINT_PAYMENT_TERMS_READ, {}],
    fetcherConfig
  )

  const areaOptions = useMemo(() => {
    if (!apartmentPropertyAreaData?.data?.attributes) return []

    return apartmentPropertyAreaData?.data?.attributes.map((area) => ({
      value: area.region_name,
      label: area.region_name,
    }))
  }, [apartmentPropertyAreaData?.data?.attributes])

  const apartmentPaymentTermsOptions = useMemo(() => {
    if (!apartmentPaymentTermData?.data?.attributes) return []

    return apartmentPaymentTermData?.data?.attributes.map(
      ({ payment_term: paymentTerm }) => ({
        value: paymentTerm,
        label: paymentTerm,
      })
    )
  }, [apartmentPaymentTermData?.data?.attributes])

  const onCheckboxCheckedChange = (value, itemValue, field) => {
    if (value) {
      field.onChange([...field.value, itemValue])
    } else {
      field.onChange(field.value.filter((item) => item !== itemValue))
    }
  }

  const onResetFilterValues = () => {
    reset(
      (formValues) => ({
        ...formValues,
        filter: {
          payment_terms: [],
          property_areas: [],
          furnishing: [],
          availabilities: [],
          price_currencies: [],
          lease_terms_types: [],
          lease_terms: {
            min: "",
            max: "",
          },
          rental_price: {
            min: "",
            max: "",
          },
          selling_price: {
            min: "",
            max: "",
          },
          size: {
            min: "",
            max: "",
          },
          bedroom: {
            min: "",
            max: "",
          },
          bathroom: {
            min: "",
            max: "",
          },
          study_room: {
            min: "",
            max: "",
          },
        },
      }),
      {
        keepDefaultValues: true,
      }
    )
  }

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button
          variant="custom"
          type="button"
          className={cn(
            "group flex h-full w-full items-center justify-between gap-3 rounded-lg border-1 border-npa-neutral-400 py-2 px-3 text-left font-medium text-npa-neutral-700 duration-300 focus:shadow-input focus:outline-none focus:ring-4 focus:ring-npa-purple-400/30 data-[state=open]:ring-4 data-[state=open]:ring-npa-purple-400/30  hover:border-npa-purple-400"
          )}
        >
          <div className="flex h-full w-full items-center gap-3">
            <MdFilterList className="h-7 w-7" />
            Filter
          </div>
        </Button>
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay />

        <DialogContent className="flex h-4/5 w-11/12 flex-col gap-4 lg:w-10/12">
          <div className="flex h-max items-center justify-between border-b-1 border-b-npa-neutral-300 pb-2">
            <div className="flex flex-col gap-2">
              <DialogTitle>Apartment Filter Properties</DialogTitle>
              <DialogDescription>
                Select properties that you want to set
              </DialogDescription>
            </div>
            <DialogClose className="h-max rounded-md bg-npa-neutral-100 p-1">
              <MdClose className="h-6 w-6" />
            </DialogClose>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto px-4">
            {/* Property Area */}
            <div className="flex flex-col gap-3 border-b-1 pb-4">
              <ApartmentManagementFilterSelectMultiple
                control={control}
                label="Property Area"
                id="filter.property_areas"
                name="filter.property_areas"
                placeholder="Find area ..."
                isLoading={apartmentPropertyAreaDataIsLoading}
                disabled={apartmentPropertyAreaDataIsLoading}
                options={areaOptions}
                onChangeValue={(field, value) => {
                  field.onChange(value.map((area) => area.value))
                }}
              />
            </div>

            {/* Size, Furnishing, Availability */}
            <div className="flex flex-col gap-3 border-b-1 pb-4">
              <div className="flex flex-col gap-8 md:flex-row">
                <div className="flex flex-col gap-3">
                  <h2 className="font-semibold">Size</h2>
                  <div className="grid grid-cols-1 grid-rows-2 gap-4 xl:grid-cols-2 xl:grid-rows-1">
                    <ApartmentManagementFilterMinMaxInputFields
                      control={control}
                      name="filter.size"
                      prefixId="filter.size"
                      placeholderPrefix="size"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-8 sm:flex-row md:flex-row">
                  <div className="flex h-full w-max flex-col gap-3">
                    <h2 className="font-semibold">Furnishing</h2>
                    <div className="grid grid-cols-1 grid-rows-3 gap-5 xl:grid-cols-2 xl:grid-rows-2">
                      {furnishingItems.map((furnishingItem) => (
                        <ApartmentManagementFilterCheckboxField
                          key={`filter-field-furnishings-${furnishingItem.id}`}
                          id={`filter.furnishings.${furnishingItem.id}`}
                          name="filter.furnishing"
                          itemValue={furnishingItem.value}
                          label={furnishingItem.label}
                          control={control}
                          onValueChange={onCheckboxCheckedChange}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex h-full w-max flex-col gap-3">
                    <h2 className="font-semibold">Availability</h2>
                    <div className="grid grid-rows-2 gap-5">
                      {availabilityItems.map((availabilityItem) => (
                        <ApartmentManagementFilterCheckboxField
                          key={`filter-field-availabilities-${availabilityItem.id}`}
                          id={`filter.availabilities.${availabilityItem.id}`}
                          name="filter.availabilities"
                          itemValue={availabilityItem.value}
                          label={availabilityItem.label}
                          control={control}
                          onValueChange={onCheckboxCheckedChange}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-b-1 pb-4">
              <div className="flex flex-col gap-8 md:flex-row">
                {roomsItems.map((room) => (
                  <div
                    className="flex flex-col gap-3"
                    key={`filter-field-room-${room.id}`}
                  >
                    <h2 className="font-semibold">{room.title}</h2>
                    <div className="grid grid-cols-1 grid-rows-2 gap-4 xl:grid-cols-2 xl:grid-rows-1">
                      <ApartmentManagementFilterMinMaxInputFields
                        control={control}
                        name={`filter.${room.name}`}
                        prefixId={`filter.${room.name}`}
                        placeholderPrefix={room.title.toLowerCase()}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Currencies, Rental Price, Selling Price */}
            <div className="grid auto-rows-max gap-8 border-b-1 pb-4 md:grid-cols-[max-content_1fr_1fr]">
              <div className="flex h-full w-max flex-col gap-3">
                <h2 className="font-semibold">Price Currency</h2>
                <div className="grid grid-rows-2 gap-5">
                  {priceCurrencies.map((priceCurrency) => (
                    <ApartmentManagementFilterCheckboxField
                      key={`filter-field-price-currencies-${priceCurrency.id}`}
                      id={`filter.price_currencies.${priceCurrency.id}`}
                      name="filter.price_currencies"
                      itemValue={priceCurrency.value}
                      label={priceCurrency.label}
                      control={control}
                      onValueChange={onCheckboxCheckedChange}
                    />
                  ))}
                </div>
              </div>

              {propertyPrices.map((price) => (
                <div
                  className="flex flex-col gap-3"
                  key={`filter-field-room-${price.id}`}
                >
                  <h2 className="font-semibold">{price.title}</h2>
                  <div className="grid grid-cols-1 grid-rows-2 gap-4 xl:grid-cols-2 xl:grid-rows-1">
                    <ApartmentManagementFilterMinMaxInputFields
                      control={control}
                      name={`filter.${price.name}`}
                      prefixId={`filter.${price.name}`}
                      placeholderPrefix={price.title.toLowerCase()}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid auto-rows-max gap-8 border-b-1  pb-4 xl:grid-cols-2">
              <div className="flex flex-col gap-3">
                <ApartmentManagementFilterSelectMultiple
                  control={control}
                  label="Payment Terms"
                  subLabel="Choose the payment terms"
                  id="filter.payment_terms"
                  name="filter.payment_terms"
                  placeholder="Find payment term ..."
                  isLoading={apartmentPaymentTermDataIsLoading}
                  options={apartmentPaymentTermsOptions}
                  onChangeValue={(field, value) => {
                    field.onChange(
                      value.map((paymentTerm) => paymentTerm.value)
                    )
                  }}
                />
              </div>

              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-[1fr_max-content]">
                <div className="flex flex-col gap-3">
                  <h2 className="font-semibold">Lease Terms</h2>
                  <div className="grid grid-cols-1 grid-rows-2 gap-4 xl:grid-cols-2 xl:grid-rows-1">
                    <ApartmentManagementFilterMinMaxInputFields
                      control={control}
                      name="filter.lease_terms"
                      prefixId="filter.lease_terms"
                      placeholderPrefix="lease terms"
                    />
                  </div>
                </div>

                <div className="flex h-full w-max flex-col gap-3">
                  <h2 className="font-semibold">Lease Terms Type</h2>
                  <div className="grid grid-cols-1 grid-rows-2 gap-5">
                    {leaseTermsTypes.map((leaseTermType) => (
                      <ApartmentManagementFilterCheckboxField
                        key={`filter-field-lease_term_type-${leaseTermType.id}`}
                        id={`filter.lease_terms_types.${leaseTermType.id}`}
                        name="filter.lease_terms_types"
                        itemValue={leaseTermType.value}
                        label={leaseTermType.label}
                        control={control}
                        onValueChange={onCheckboxCheckedChange}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              isFullWidth={false}
              type="reset"
              variant="outline"
              onClick={onResetFilterValues}
            >
              Clear
            </Button>

            <DialogClose asChild>
              <Button
                isFullWidth={false}
                variant="primary"
                onClick={() => onApplyingFilter(filterValues)}
              >
                Apply Filter
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  )
}
