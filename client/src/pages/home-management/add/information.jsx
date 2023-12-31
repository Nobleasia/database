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
  AddHomeLabel,
  HomeManagementCustomPlaceholder,
  HomeManagementGroupInput,
  getAddHomeLayout,
} from "@/features/home-management"

const Information = ({ available }) => {
  const config = useSWRConfig()

  const { data: kodeProparData } = usePrivateFetcher(
    [process.env.NEXT_PUBLIC_ENDPOINT_HOME_KODE_PROPAR_READ, {}],
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
      <HomeManagementGroupInput>
        <AddHomeLabel htmlFor="kode_propar" isRequired>
          Kode Propar
        </AddHomeLabel>
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
                  placeholder="Home kode propar"
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
                  <HomeManagementCustomPlaceholder ariaPlaceholder="Example: AMP001">
                    Example: AMP001
                  </HomeManagementCustomPlaceholder>
                )}
              </>
            )
          }}
        />
      </HomeManagementGroupInput>

      <HomeManagementGroupInput>
        <AddHomeLabel htmlFor="name" isRequired>
          Name
        </AddHomeLabel>
        <Controller
          control={control}
          name="name"
          rules={{
            required: "Name is required",
            pattern: {
              value: /^[a-zA-Z0-9 ]+$/g,
              message: "Name must not contain special characters",
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="text"
                id="name"
                placeholder="Home name"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  const { value } = event.target

                  const isCustomInvalid = /[^a-zA-Z0-9 ]+/.test(value)
                  if (isCustomInvalid) {
                    setError("name", {
                      type: "custom",
                      message: "Name must not contain special characters",
                    })
                  } else {
                    clearErrors("name")
                  }

                  field.onChange(value)
                }}
              />
              {error ? (
                <AlertInputError>{error?.message}</AlertInputError>
              ) : (
                <HomeManagementCustomPlaceholder ariaPlaceholder="Example: AMP-001">
                  Example: Ampera Home
                </HomeManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </HomeManagementGroupInput>

      <GroupInput direction="column" className="md:w-[384px] md:min-w-max">
        <AddHomeLabel htmlFor="address">Address</AddHomeLabel>
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
                <HomeManagementCustomPlaceholder>
                  Example: Jalan Ampera 1 No. 8
                </HomeManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </GroupInput>

      {propertyAreaData?.data?.attributes.length > 0 && (
        <HomeManagementGroupInput>
          <AddHomeLabel htmlFor="property_area" isRequired>
            Property Area
          </AddHomeLabel>

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
        </HomeManagementGroupInput>
      )}

      <HomeManagementGroupInput>
        <AddHomeLabel htmlFor="available">Availability</AddHomeLabel>

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
      </HomeManagementGroupInput>

      <HomeManagementGroupInput>
        <AddHomeLabel htmlFor="pic.fullname" isRequired>
          PIC Name
        </AddHomeLabel>

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
      </HomeManagementGroupInput>

      {!picFullnameIsExist && (
        <>
          <HomeManagementGroupInput>
            <AddHomeLabel htmlFor="pic.phone_number" isRequired>
              PIC Phone Number
            </AddHomeLabel>
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
                      <HomeManagementCustomPlaceholder>
                        Example : 081234567890
                      </HomeManagementCustomPlaceholder>
                    )}
                  </>
                )
              }}
            />
          </HomeManagementGroupInput>

          <HomeManagementGroupInput>
            <AddHomeLabel htmlFor="pic.company" isRequired>
              PIC Company
            </AddHomeLabel>

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
                    <HomeManagementCustomPlaceholder>
                      Example: Company A
                    </HomeManagementCustomPlaceholder>
                  )}
                </>
              )}
            />
          </HomeManagementGroupInput>

          <HomeManagementGroupInput>
            <AddHomeLabel htmlFor="pic.role" isRequired>
              PIC Role
            </AddHomeLabel>

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
                    <HomeManagementCustomPlaceholder>
                      Example: Owner
                    </HomeManagementCustomPlaceholder>
                  )}
                </>
              )}
            />
          </HomeManagementGroupInput>
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
    },
  }
}

export default Information

Information.getLayout = getAddHomeLayout
