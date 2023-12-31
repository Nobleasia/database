import { useEffect, useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
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
  getAddLandLayout,
} from "@/features/land-management"

const Information = ({ available, ownership, zone }) => {
  const config = useSWRConfig()

  const { data: kodeProparData } = usePrivateFetcher(
    [process.env.NEXT_PUBLIC_ENDPOINT_LAND_KODE_PROPAR_READ, {}],
    config
  )

  const { data: propertyAreaData, isLoading: isLoadingPropertyArea } =
    usePrivateFetcher(
      [process.env.NEXT_PUBLIC_ENDPOINT_PROPERTY_AREA_READ, {}],
      config
    )

  const { data: picData, isLoading: picDataIsLoading } = usePrivateFetcher(
    [process.env.NEXT_PUBLIC_ENDPOINT_PIC_READ, {}],
    config
  )

  const { data: picCompanyData, isLoading: picCompanyIsLoading } =
    usePrivateFetcher(
      [`${process.env.NEXT_PUBLIC_ENDPOINT_PIC_COMPANIES_READ}`, {}],
      {
        revalidateOnMount: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      }
    )

  const { data: picRoleData, isLoading: picRoleIsLoading } = usePrivateFetcher(
    [`${process.env.NEXT_PUBLIC_ENDPOINT_PIC_ROLES_READ}`, {}],
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  const {
    control,
    setValue,
    setError,
    clearErrors,
    formState: { isSubmitting, isSubmitted },
  } = useFormContext()

  const [
    watchPicFullname,
    watchPicRoleName,
    watchPicCompanyName,
    watchPropertyArea,
  ] = useWatch({
    control,
    name: ["pic.fullname", "pic.role", "pic.company", "property_area"],
  })

  const picFullnameIsExist = useMemo(() => {
    return (
      picData?.data?.attributes.filter(
        ({ fullname }) => fullname === watchPicFullname
      ).length > 0
    )
  }, [watchPicFullname, picData?.data?.attributes])

  const picFullnameOptions = useMemo(() => {
    if (!picData?.data?.attributes?.length === 0) return []

    return picData?.data?.attributes?.map(({ fullname }) => ({
      value: fullname,
      label: fullname,
    }))
  }, [picData?.data?.attributes, picDataIsLoading])

  const propertyAreaOptions = useMemo(() => {
    if (!propertyAreaData?.data?.attributes.length === 0) return []

    return propertyAreaData?.data?.attributes.map(
      ({ region_name: regionName }) => ({
        value: regionName,
        label: regionName,
      })
    )
  }, [propertyAreaData?.data?.attributes, isLoadingPropertyArea])

  const picRoleOptions = useMemo(() => {
    if (!picRoleData?.data?.attributes.length === 0) return []

    return picRoleData?.data?.attributes.map((role) => ({
      value: role.name,
      label: role.name,
    }))
  }, [picRoleData?.data?.attributes, picRoleIsLoading])

  const picCompaniesOptions = useMemo(() => {
    if (!picCompanyData?.data?.attributes.length === 0) return []

    return picCompanyData?.data?.attributes.map((role) => ({
      value: role.name,
      label: role.name,
    }))
  }, [picCompanyData?.data?.attributes, picCompanyIsLoading])

  useEffect(() => {
    if (picFullnameIsExist) {
      setValue("pic.phone_number", "")
      setValue("pic.role", "")
      setValue("pic.company", "")
    }
  }, [picFullnameIsExist])

  if (isLoadingPropertyArea || picDataIsLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader />
      </div>
    )
  }

  return (
    <>
      <LandManagementGroupInput>
        <AddLandLabel htmlFor="kode_propar" isRequired>
          Kode Propar
        </AddLandLabel>
        <Controller
          control={control}
          name="kode_propar"
          rules={{
            required: "Kode propar is required",
            pattern: {
              value: /^[A-Z]{1,7}[0-9]{3}$/g,
              message: `The total character must not be more than 10, the last 3
              characters of kode_propar must be digits, NaN, and the rest of
              the characters must be capitalized letters.
              Example: TEST001`,
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => {
            return (
              <>
                <InputField
                  {...field}
                  type="text"
                  id="kode_propar"
                  placeholder="Land kode propar"
                  disabled={isSubmitting}
                  isSubmitted={isSubmitted}
                  isTouched={isTouched}
                  isError={error}
                  onChange={(event) => {
                    const { value } = event.target
                    const enteredValue = value.toUpperCase()
                    const isCustomInvalid =
                      value.match(/^[A-Z]{1,7}[0-9]{3}$/g) === null

                    const isExistingKodePropar =
                      kodeProparData &&
                      kodeProparData?.data?.attributes?.some(
                        (item) => item.kode_propar === enteredValue
                      )

                    if (value.length === 0) {
                      setError("kode_propar", {
                        type: "custom",
                        message: "Kode propar is required",
                      })
                    } else if (isCustomInvalid) {
                      setError("kode_propar", {
                        type: "custom",
                        message: `The total character must not be more than 10, the last 3
                                  characters of kode_propar must be digits, NaN, and the rest of
                                  the characters must be capitalized letters.
                                  Example: AMP001`,
                      })
                    } else if (isExistingKodePropar) {
                      setError("kode_propar", {
                        type: "custom",
                        message: "Kode Propar already exists",
                      })
                    } else {
                      // Clear error before checking for existing kodeProparData
                      clearErrors("kode_propar")
                    }

                    // Trigger field onChange with uppercase value
                    field.onChange(enteredValue)
                  }}
                />
                {error ? (
                  <AlertInputError>{error?.message}</AlertInputError>
                ) : (
                  <LandManagementCustomPlaceholder ariaPlaceholder="Example: AMP001">
                    Example: AMP001
                  </LandManagementCustomPlaceholder>
                )}
              </>
            )
          }}
        />
      </LandManagementGroupInput>

      <GroupInput direction="column" className="md:w-[384px] md:min-w-max">
        <AddLandLabel htmlFor="address">Address</AddLandLabel>
        <Controller
          control={control}
          name="address"
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9., ]+$/g,
              message: "Address must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="textarea"
                id="address"
                placeholder="Enter address"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  const { value } = event.target
                  const isCustomInvalid = /[^a-zA-Z0-9., ]+/g.test(value)

                  if (isCustomInvalid) {
                    setError("address", {
                      type: "custom",
                      message: "Address must not contain special characters",
                    })
                  } else {
                    clearErrors("address")
                  }

                  field.onChange(value)
                }}
              />
              {error ? (
                <AlertInputError>{error?.message}</AlertInputError>
              ) : (
                <LandManagementCustomPlaceholder>
                  Example: Jalan Ampera 1 No. 8
                </LandManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </GroupInput>

      {propertyAreaData?.data?.attributes.length > 0 && (
        <LandManagementGroupInput>
          <AddLandLabel htmlFor="property_area" isRequired>
            Property Area
          </AddLandLabel>

          <Controller
            control={control}
            name="property_area"
            render={({ field, fieldState: { isTouched, error } }) => (
              <SelectCreateable
                {...field}
                isClearable
                isSearchable
                defaultValue=""
                id="property_area"
                placeholder="Select a property area ..."
                value={
                  field.value === ""
                    ? []
                    : propertyAreaOptions?.find(
                        (propertyAreaName) =>
                          propertyAreaName.value === watchPropertyArea
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
                options={propertyAreaOptions}
              />
            )}
          />
        </LandManagementGroupInput>
      )}

      <LandManagementGroupInput>
        <AddLandLabel htmlFor="available">Availability</AddLandLabel>

        <Controller
          control={control}
          name="available"
          render={({ field, fieldState: { isTouched, error } }) => (
            <Select
              {...field}
              id="available"
              placeholder="Select a availability status ..."
              disabled={isSubmitting}
              isError={error}
              isSubmitted={isSubmitted}
              isTouched={isTouched}
              defaultValue={field.value}
              onValueChange={(value) => {
                field.onChange(JSON.parse(value))
              }}
            >
              <SelectItemDefault value="">
                Select an availability status ...
              </SelectItemDefault>
              {available.map(({ value, label }) => (
                <SelectItem
                  key={`select-available-${label}-${value}`}
                  value={JSON.parse(value)}
                  selected={field.value === value && label}
                >
                  {label}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </LandManagementGroupInput>

      <LandManagementGroupInput>
        <AddLandLabel htmlFor="zone">Zone</AddLandLabel>

        <Controller
          control={control}
          name="zone"
          render={({ field, fieldState: { isTouched, error } }) => (
            <Select
              {...field}
              id="zone"
              placeholder="Select a zone type ..."
              disabled={isSubmitting}
              isError={error}
              isSubmitted={isSubmitted}
              isTouched={isTouched}
              value={field.value}
              defaultValue={field.value}
              onValueChange={field.onChange}
            >
              <SelectItemDefault value="">
                Choose a zone type ...
              </SelectItemDefault>

              {zone.map(({ id, label, value }) => (
                <SelectItem
                  key={`select-zone-${value}-${id}`}
                  value={value}
                  selected={field.value === value && label}
                >
                  {label}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </LandManagementGroupInput>

      <LandManagementGroupInput>
        <AddLandLabel htmlFor="ownership">Ownership</AddLandLabel>
        <Controller
          control={control}
          name="ownership"
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="ownership"
                id="ownership"
                placeholder="Ownership"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  field.onChange(event.target.value)
                }}
              />
              <LandManagementCustomPlaceholder>
                Example: -
              </LandManagementCustomPlaceholder>
            </>
          )}
        />
      </LandManagementGroupInput>

      <LandManagementGroupInput>
        <AddLandLabel htmlFor="surroundings">Surroundings</AddLandLabel>
        <Controller
          control={control}
          name="surroundings"
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="surroundings"
                id="surroundings"
                placeholder="Surroundings"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  field.onChange(event.target.value)
                }}
              />
              <LandManagementCustomPlaceholder>
                Example: -
              </LandManagementCustomPlaceholder>
            </>
          )}
        />
      </LandManagementGroupInput>

      <LandManagementGroupInput>
        <AddLandLabel htmlFor="pic.fullname" isRequired>
          PIC Name
        </AddLandLabel>

        <Controller
          control={control}
          name="pic.fullname"
          render={({ field, fieldState: { isTouched, error } }) => (
            <SelectCreateable
              {...field}
              isClearable
              isSearchable
              defaultValue=""
              id="pic.fullname"
              placeholder="Select or create a PIC name ..."
              value={
                field.value === ""
                  ? []
                  : picFullnameOptions?.find(
                      (picFullname) => picFullname.value === watchPicFullname
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
              options={picFullnameOptions}
            />
          )}
        />
      </LandManagementGroupInput>

      {!picFullnameIsExist && (
        <>
          <LandManagementGroupInput>
            <AddLandLabel htmlFor="pic.phone_number" isRequired>
              PIC Phone Number
            </AddLandLabel>
            <Controller
              control={control}
              name="pic.phone_number"
              rules={{
                required: "Phone number is required",
                pattern: {
                  value: /^08\d{8,11}$/gi,
                  message: "Phone number is not valid",
                },
              }}
              render={({ field, fieldState: { isTouched, error } }) => {
                return (
                  <>
                    <InputField
                      {...field}
                      type="text"
                      id="pic.phone_number"
                      placeholder="Enter PIC phone number ..."
                      disabled={isSubmitting}
                      isSubmitted={isSubmitted}
                      isTouched={isTouched}
                      isError={error}
                      onChange={(event) => {
                        const { value } = event.target
                        const isCustomInvalid =
                          value.match(/^08\d{8,11}$/gi) === null

                        if (value.length > 0 && isCustomInvalid) {
                          setError("pic.phone_number", {
                            type: "custom",
                            message: "Phone number is not valid",
                          })
                        } else {
                          clearErrors("pic.phone_number")
                        }

                        field.onChange(value)
                      }}
                    />
                    {error ? (
                      <AlertInputError>{error.message}</AlertInputError>
                    ) : (
                      <LandManagementCustomPlaceholder>
                        Example : 081234567890
                      </LandManagementCustomPlaceholder>
                    )}
                  </>
                )
              }}
            />
          </LandManagementGroupInput>

          <LandManagementGroupInput>
            <AddLandLabel htmlFor="pic.company" isRequired>
              PIC Company
            </AddLandLabel>

            <Controller
              name="pic.company"
              control={control}
              rules={{
                required: "PIC company is required",
              }}
              render={({ field, fieldState: { error, isTouched } }) => (
                <>
                  <SelectCreateable
                    {...field}
                    isSearchable
                    isClearable
                    id="pic.company"
                    placeholder="Select a PIC company ..."
                    isError={error}
                    isTouched={isTouched}
                    isSubmitted={isSubmitted}
                    disabled={isSubmitting}
                    options={picCompaniesOptions}
                    value={
                      field.value === ""
                        ? []
                        : picCompaniesOptions?.find(
                            (picCompany) =>
                              picCompany.value === watchPicCompanyName
                          ) || {
                            value: field.value,
                            label: field.value,
                          }
                    }
                    onValueChange={(value) => {
                      field.onChange(value?.value || "")
                    }}
                  />
                  {error ? (
                    <AlertInputError>{error.message}</AlertInputError>
                  ) : (
                    <LandManagementCustomPlaceholder>
                      Example: Company A
                    </LandManagementCustomPlaceholder>
                  )}
                </>
              )}
            />
          </LandManagementGroupInput>

          <LandManagementGroupInput>
            <AddLandLabel htmlFor="pic.role" isRequired>
              PIC Role
            </AddLandLabel>

            <Controller
              name="pic.role"
              control={control}
              rules={{
                required: "PIC role is required",
              }}
              render={({ field, fieldState: { error, isTouched } }) => (
                <>
                  <SelectCreateable
                    {...field}
                    isSearchable
                    isClearable
                    id="pic.role"
                    placeholder="Select a PIC role ..."
                    isError={error}
                    isTouched={isTouched}
                    isSubmitted={isSubmitted}
                    disabled={isSubmitting}
                    options={picRoleOptions}
                    value={
                      field.value === ""
                        ? []
                        : picRoleOptions?.find(
                            (picRole) => picRole.value === watchPicRoleName
                          ) || {
                            value: field.value,
                            label: field.value,
                          }
                    }
                    onValueChange={(value) => {
                      field.onChange(value?.value || "")
                    }}
                  />
                  {error ? (
                    <AlertInputError>{error.message}</AlertInputError>
                  ) : (
                    <LandManagementCustomPlaceholder>
                      Example: Owner
                    </LandManagementCustomPlaceholder>
                  )}
                </>
              )}
            />
          </LandManagementGroupInput>
        </>
      )}
    </>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      available: [
        {
          value: true,
          label: "Yes",
        },
        {
          value: false,
          label: "No",
        },
      ],
      ownership: [
        {
          id: 1,
          value: "Leasehold",
          label: "Leasehold",
        },
        {
          id: 2,
          value: "Freehold",
          label: "Freehold",
        },
      ],
      zone: [
        {
          id: 1,
          value: "Red",
          label: "Red",
        },
        {
          id: 2,
          value: "Yellow",
          label: "Yellow",
        },
        {
          id: 3,
          value: "Green",
          label: "Green",
        },
        {
          id: 4,
          value: "Others",
          label: "Others",
        },
      ],
    },
  }
}

Information.getLayout = getAddLandLayout

export default Information
