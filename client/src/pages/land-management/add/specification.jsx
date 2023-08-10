import { Controller, useFormContext } from "react-hook-form"

import { AlertInputError, GroupInput, InputField } from "@/components"

import { stringToNumber } from "@/utils"

import {
  AddLandLabel,
  LandManagementCustomPlaceholder,
  LandManagementGroupInput,
  getAddLandLayout,
} from "@/features/land-management"

const Specification = () => {
  const {
    control,
    setError,
    clearErrors,
    formState: { isSubmitting, isSubmitted },
  } = useFormContext()

  return (
    <>
      <LandManagementGroupInput>
        <AddLandLabel htmlFor="land_size">Land Size (sqm)</AddLandLabel>
        <Controller
          control={control}
          name="land_size"
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="number"
                id="land_size"
                placeholder="Land size"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  field.onChange(stringToNumber(event.target.value))
                }}
              />
              <LandManagementCustomPlaceholder>
                Example: 500 sqm
              </LandManagementCustomPlaceholder>
            </>
          )}
        />
      </LandManagementGroupInput>

      <GroupInput direction="column" className="md:w-[384px] md:min-w-max">
        <AddLandLabel htmlFor="remarks_1">First Remark</AddLandLabel>
        <Controller
          control={control}
          name="remarks_1"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9., ]+$/g,
              message: "First remark must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="textarea"
                id="remarks_1"
                placeholder="Enter first remark"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  const { value } = event.target
                  const isCustomInvalid = /[^a-zA-Z0-9., ]+/g.test(value)

                  if (isCustomInvalid) {
                    setError("remarks_1", {
                      type: "custom",
                      message:
                        "First remark must not contain special characters",
                    })
                  } else {
                    clearErrors("remarks_1")
                  }

                  field.onChange(value)
                }}
              />
              {error ? (
                <AlertInputError>{error?.message}</AlertInputError>
              ) : (
                <LandManagementCustomPlaceholder>
                  Example: Unreachable
                </LandManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </GroupInput>

      <GroupInput direction="column" className="md:w-[384px] md:min-w-max">
        <AddLandLabel htmlFor="remarks_2">Second Remark</AddLandLabel>
        <Controller
          control={control}
          name="remarks_2"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9., ]+$/g,
              message: "Remark must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="textarea"
                id="remarks_2"
                placeholder="Enter second remark value"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  const { value } = event.target
                  const isCustomInvalid = /[^a-zA-Z0-9., ]+/g.test(value)

                  if (isCustomInvalid) {
                    setError("remarks_2", {
                      type: "custom",
                      message: "remarks_2 must not contain special characters",
                    })
                  } else {
                    clearErrors("remarks_2")
                  }

                  field.onChange(value)
                }}
              />
              {error ? (
                <AlertInputError>{error?.message}</AlertInputError>
              ) : (
                <LandManagementCustomPlaceholder>
                  Example: Unreachable
                </LandManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </GroupInput>

      <GroupInput direction="column" className="md:w-[384px] md:min-w-max">
        <AddLandLabel htmlFor="remarks_3">Third Remark</AddLandLabel>
        <Controller
          control={control}
          name="remarks_3"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9., ]+$/g,
              message: "Third Remark must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="textarea"
                id="remarks_3"
                placeholder="Enter third remark value"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  const { value } = event.target
                  const isCustomInvalid = /[^a-zA-Z0-9., ]+/g.test(value)

                  if (isCustomInvalid) {
                    setError("remarks_3", {
                      type: "custom",
                      message:
                        "Third remark must not contain special characters",
                    })
                  } else {
                    clearErrors("remarks_3")
                  }

                  field.onChange(value)
                }}
              />
              {error ? (
                <AlertInputError>{error?.message}</AlertInputError>
              ) : (
                <LandManagementCustomPlaceholder>
                  Example: Unreachable
                </LandManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </GroupInput>
    </>
  )
}

Specification.getLayout = getAddLandLayout

export default Specification
