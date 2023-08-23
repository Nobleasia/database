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

import { LandManagementFilterCheckboxField } from "./land-management-filter-checkbox-field"
import { LandManagementFilterMinMaxInputFields } from "./land-management-filter-min-max-input-fields"
import { LandManagementFilterSelectMultiple } from "./land-management-filter-select-multiple"

const availabilityItems = [
  {
    id: "yes",
    value: "Yes",
    name: "Yes",
  },
  {
    id: "no",
    value: "No",
    name: "No",
  },
]

const zoneItems = [
  {
    id: "red",
    value: "Red",
    name: "Red",
  },
  {
    id: "yellow",
    value: "Yellow",
    name: "Yellow",
  },
  {
    id: "green",
    value: "Green",
    name: "Green",
  },
  {
    id: "others",
    value: "Others",
    name: "Others",
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

export const LandManagementFilterMenu = ({
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
    data: landPropertyAreaData,
    isLoading: landPropertyAreaDataIsLoading,
  } = usePrivateFetcher(
    [process.env.NEXT_PUBLIC_ENDPOINT_PROPERTY_AREA_READ, {}],
    fetcherConfig
  )

  const areaOptions = useMemo(() => {
    if (!landPropertyAreaData?.data?.attributes) return []

    return landPropertyAreaData?.data?.attributes.map((area) => ({
      value: area.region_name,
      label: area.region_name,
    }))
  }, [landPropertyAreaData?.data?.attributes])

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
          property_areas: [],
          zone: [],
          availabilities: [],
          lease_terms_types: [],
          lease_terms: {
            min: "",
            max: "",
          },
          price: {
            min: "",
            max: "",
          },
          land_size: {
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
              <DialogTitle>Land Filter Properties</DialogTitle>
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
              <LandManagementFilterSelectMultiple
                control={control}
                label="Property Area"
                id="filter.property_areas"
                name="filter.property_areas"
                placeholder="Find area ..."
                isLoading={landPropertyAreaDataIsLoading}
                disabled={landPropertyAreaDataIsLoading}
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
                  <h2 className="font-semibold">Land Size</h2>
                  <div className="grid grid-cols-1 grid-rows-2 gap-4 xl:grid-cols-2 xl:grid-rows-1">
                    <LandManagementFilterMinMaxInputFields
                      control={control}
                      name="filter.land_size"
                      prefixId="filter.land_size"
                      placeholderPrefix="size"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-8 sm:flex-row md:flex-row">
                  <div className="flex h-full w-max flex-col gap-3">
                    <h2 className="font-semibold">Availability</h2>
                    <div className="grid grid-rows-2 gap-5">
                      {availabilityItems.map((availabilityItem) => (
                        <LandManagementFilterCheckboxField
                          key={`filter-field-availability-${availabilityItem.id}`}
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

                  <div className="flex h-full w-max flex-col gap-3">
                    <h2 className="font-semibold">Zone</h2>
                    <div className="grid grid-cols-1 grid-rows-3 gap-5 xl:grid-cols-2 xl:grid-rows-2">
                      {zoneItems.map((zoneItem) => (
                        <LandManagementFilterCheckboxField
                          key={`filter-field-zone-${zoneItem.id}`}
                          id={`filter.zone.${zoneItem.id}`}
                          name="filter.zone"
                          itemValue={zoneItem.value}
                          label={zoneItem.label}
                          control={control}
                          onValueChange={onCheckboxCheckedChange}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Currencies, Rental Price, Selling Price */}
            <div className="grid auto-rows-max gap-8 border-b-1 pb-4 md:grid-cols-[max-content_1fr_1fr]">
              <div className="flex flex-col gap-3" key="filter-field-price">
                <h2 className="font-semibold">Price</h2>
                <div className="grid grid-cols-1 grid-rows-2 gap-4 xl:grid-cols-2 xl:grid-rows-1">
                  <LandManagementFilterMinMaxInputFields
                    control={control}
                    name="filter.price"
                    prefixId="filter.price"
                    placeholderPrefix="price"
                  />
                </div>
              </div>
            </div>

            <div className="grid auto-rows-max gap-8 border-b-1  pb-4 xl:grid-cols-2">
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-[1fr_max-content]">
                <div className="flex flex-col gap-3">
                  <h2 className="font-semibold">Lease Terms</h2>
                  <div className="grid grid-cols-1 grid-rows-2 gap-4 xl:grid-cols-2 xl:grid-rows-1">
                    <LandManagementFilterMinMaxInputFields
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
                      <LandManagementFilterCheckboxField
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
