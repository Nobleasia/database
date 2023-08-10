import { useMemo } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useSWRConfig } from "swr";

import { usePrivateFetcher } from "@/hooks";

import { GroupInput, Loader, SelectCreateable } from "@/components";

import {
  AddHomeLabel,
  getAddHomeLayout,
} from "@/features/home-management";

const FacilityAndAccess = () => {
  const config = useSWRConfig();

  const {
    data: propertyFacilityData,
    isLoading: isLoadingPropertyFacilityData,
  } = usePrivateFetcher(
    [process.env.NEXT_PUBLIC_ENDPOINT_FACILITIES_READ, {}],
    config
  );

  const {
    control,
    formState: { isSubmitting, isSubmitted },
  } = useFormContext();

  const [watchFacilities] = useWatch({
    control,
    name: ["facilities"],
  });

  const selectedFacilitiesValue = useMemo(() => {
    return watchFacilities.map((facility) => ({
      value: facility,
      label: facility,
    }));
  }, [watchFacilities]);

  if (isLoadingPropertyFacilityData) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-semibold">Property Facility</h2>
      <div className="flex flex-col gap-4">
        <GroupInput direction="column">
          <AddHomeLabel htmlFor="facilities">
            Please press enter to fill facility
          </AddHomeLabel>
          <Controller
            name="facilities"
            control={control}
            render={({ field, fieldState: { isTouched, error } }) => (
              <SelectCreateable
                isMulti
                isSeachable
                isClearable
                {...field}
                id="facilities"
                placeholder="Please press enter to fill facility..."
                defaultOpen={false}
                isError={error}
                isSubmitted={isSubmitted}
                disabled={isSubmitting}
                isTouched={isTouched}
                value={selectedFacilitiesValue}
                onValueChange={(value) => {
                  field.onChange(value.map((item) => item.value));
                }}
                options={
                  propertyFacilityData?.data?.attributes.map(
                    ({ facility_name: facilityName }) => ({
                      value: facilityName,
                      label: facilityName,
                    })
                  ) || []
                }
              />
            )}
          />
        </GroupInput>
      </div>
    </section>
  );
};

FacilityAndAccess.getLayout = getAddHomeLayout;

export default FacilityAndAccess;
