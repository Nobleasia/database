import { Controller, useFormContext } from "react-hook-form"

import {
  AlertInputError,
  GroupInput,
  InputField,
  Select,
  SelectItem,
  SelectItemDefault,
} from "@/components"

import { stringToNumber } from "@/utils"

import {
  AddApartmentLabel,
  ApartmentManagementCustomPlaceholder,
  ApartmentManagementGroupInput,
  getEditApartmentLayout,
} from "@/features/apartment-management"

const Specification = ({ furnishings }) => {
  const {
    control,
    setError,
    clearErrors,
    formState: { isSubmitting, isSubmitted },
  } = useFormContext()

  return (
    <>
      <ApartmentManagementGroupInput>
        <AddApartmentLabel htmlFor="size">Size (sqm)</AddApartmentLabel>
        <Controller
          control={control}
          name="size"
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="number"
                id="size"
                placeholder="Apartment size"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  field.onChange(stringToNumber(event.target.value))
                }}
              />
              <ApartmentManagementCustomPlaceholder>
                Example: 500 sqm
              </ApartmentManagementCustomPlaceholder>
            </>
          )}
        />
      </ApartmentManagementGroupInput>

      <ApartmentManagementGroupInput>
        <AddApartmentLabel htmlFor="tower">Tower</AddApartmentLabel>
        <Controller
          control={control}
          name="tower"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9 ()/-]+$/g,
              message: "Tower must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="text"
                id="tower"
                placeholder="Apartment tower"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  const { value } = event.target

                  const isCustomInvalid = /[^a-zA-Z0-9 ()/-]+/.test(value)
                  if (isCustomInvalid) {
                    setError("tower", {
                      type: "custom",
                      message: "Tower must not contain special characters",
                    })
                  } else {
                    clearErrors("tower")
                  }

                  field.onChange(value)
                }}
              />
              {error ? (
                <AlertInputError>{error?.message}</AlertInputError>
              ) : (
                <ApartmentManagementCustomPlaceholder>
                  Example: Jamrud
                </ApartmentManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </ApartmentManagementGroupInput>

      <ApartmentManagementGroupInput>
        <AddApartmentLabel htmlFor="floor">Floor</AddApartmentLabel>
        <Controller
          control={control}
          name="floor"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9 ()/-]+$/g,
              message: "Floor must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="text"
                id="floor"
                placeholder="Apartment floor"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  const { value } = event.target

                  const isCustomInvalid = /[^a-zA-Z0-9 ()/-]+/.test(value)
                  if (isCustomInvalid) {
                    setError("floor", {
                      type: "custom",
                      message: "Floor must not contain special characters",
                    })
                  } else {
                    clearErrors("floor")
                  }

                  field.onChange(value)
                }}
              />
              {error ? (
                <AlertInputError>{error?.message}</AlertInputError>
              ) : (
                <ApartmentManagementCustomPlaceholder>
                  Example: 7A
                </ApartmentManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </ApartmentManagementGroupInput>

      <ApartmentManagementGroupInput>
        <AddApartmentLabel htmlFor="bedroom">Bedroom</AddApartmentLabel>
        <Controller
          control={control}
          name="bedroom"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9 ]+$/g,
              message: "Bedroom must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                onChange={(event) => {
                  field.onChange(stringToNumber(event.target.value))
                }}
                type="number"
                id="bedroom"
                min={0}
                placeholder="Apartment bedroom unit"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
              />
              <ApartmentManagementCustomPlaceholder>
                Example: 7 (unit)
              </ApartmentManagementCustomPlaceholder>
            </>
          )}
        />
      </ApartmentManagementGroupInput>

      <ApartmentManagementGroupInput>
        <AddApartmentLabel htmlFor="bathroom">Bathroom</AddApartmentLabel>
        <Controller
          control={control}
          name="bathroom"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9 ]+$/g,
              message: "Bathroom must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="number"
                id="bathroom"
                min={0}
                placeholder="Apartment bathroom unit"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  field.onChange(stringToNumber(event.target.value))
                }}
              />
              <ApartmentManagementCustomPlaceholder>
                Example: 7 (unit)
              </ApartmentManagementCustomPlaceholder>
            </>
          )}
        />
      </ApartmentManagementGroupInput>

      <ApartmentManagementGroupInput>
        <AddApartmentLabel htmlFor="studyroom">Study Room</AddApartmentLabel>
        <Controller
          control={control}
          name="study_room"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9 ]+$/g,
              message: "Study room must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="number"
                id="studyroom"
                min={0}
                placeholder="Apartment study room unit"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  field.onChange(stringToNumber(event.target.value))
                }}
              />
              <ApartmentManagementCustomPlaceholder>
                Example: 7 (unit)
              </ApartmentManagementCustomPlaceholder>
            </>
          )}
        />
      </ApartmentManagementGroupInput>

      <ApartmentManagementGroupInput>
        <AddApartmentLabel htmlFor="furnishing">Furnishing</AddApartmentLabel>

        <Controller
          control={control}
          name="furnishing"
          render={({ field, fieldState: { isTouched, error } }) => (
            <Select
              {...field}
              id="furnishing"
              placeholder="Select a furnishing type ..."
              disabled={isSubmitting}
              isError={error}
              isSubmitted={isSubmitted}
              isTouched={isTouched}
              value={field.value}
              defaultValue={field.value}
              onValueChange={field.onChange}
            >
              <SelectItemDefault value="">
                Choose a furnishing type ...
              </SelectItemDefault>

              {furnishings.map((item) => (
                <SelectItem
                  key={`select-condition-${item}`}
                  value={item}
                  selected={field.value === item && item}
                >
                  {item}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </ApartmentManagementGroupInput>

      <GroupInput direction="column" className="md:w-[384px] md:min-w-max">
        <AddApartmentLabel htmlFor="remarks_1">First Remark</AddApartmentLabel>
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
                <ApartmentManagementCustomPlaceholder>
                  Example: Unreachable
                </ApartmentManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </GroupInput>

      <GroupInput direction="column" className="md:w-[384px] md:min-w-max">
        <AddApartmentLabel htmlFor="remarks_2">Second Remark</AddApartmentLabel>
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
                <ApartmentManagementCustomPlaceholder>
                  Example: Unreachable
                </ApartmentManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </GroupInput>

      <GroupInput direction="column" className="md:w-[384px] md:min-w-max">
        <AddApartmentLabel htmlFor="remarks_3">Third Remark</AddApartmentLabel>
        <Controller
          control={control}
          name="remarks_3"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9., ]+$/g,
              message: "remarks_3 must not contain special characters",
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
                      message: "remarks_3 must not contain special characters",
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
                <ApartmentManagementCustomPlaceholder>
                  Example: Unreachable
                </ApartmentManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </GroupInput>
    </>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      furnishings: ["Fully Furnished", "Semi Furnished", "Unfurnished"],
    },
  }
}

Specification.getLayout = getEditApartmentLayout

export default Specification
