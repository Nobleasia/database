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

import { stringToNumber } from "@/utils"

import {
  AddOfficeLabel,
  OfficeManagementCustomPlaceholder,
  OfficeManagementGroupInput,
  getEditOfficeLayout,
} from "@/features/office-management"

const Information = ({ available }) => {
  const config = useSWRConfig()

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
    setError,
    setValue,
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
    setValue("pic.phone_number", "")
    setValue("pic.role", "")
    setValue("pic.company", "")
  }, [picFullnameIsExist])

  if (isLoadingPropertyArea || picDataIsLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <>
      <OfficeManagementGroupInput>
        <AddOfficeLabel htmlFor="kodePropar" isRequired>
          Kode Propar
        </AddOfficeLabel>
        <Controller
          control={control}
          name="kode_propar"
          rules={{
            required: "Kode propar is required",

            pattern: {
              value: /^[A-Z]{1,7}-[0-9]{3}$/g,
              message: `The total character must not be more than 10, the last 3
              characters of kode_propar must be digits, NaN, and the rest of
              the characters must be capitalized letters.
              Example: TEST-001`,
            },
          }}
          render={({ field, fieldState: { isTouched, error } }) => {
            return (
              <>
                <InputField
                  {...field}
                  type="text"
                  id="kodePropar"
                  placeholder="Office kode propar"
                  disabled={isSubmitting}
                  isSubmitted={isSubmitted}
                  isTouched={isTouched}
                  isError={error}
                  onChange={(event) => {
                    const { value } = event.target

                    const isCustomInvalid =
                      value.match(/^[A-Z]{1,7}-[0-9]{3}$/g) === null

                    if (value.length > 0) {
                      if (isCustomInvalid) {
                        setError("kode_propar", {
                          type: "custom",
                          message: `The total character must not be more than 10, the last 3
                               characters of kode_propar must be digits, NaN, and the rest of
                               the characters must be capitalized letters.
                               Example: AMP-001, TEST-001, AMPRO-001, TESTPRO-001, etc`,
                        })
                      } else {
                        clearErrors("kode_propar")
                      }
                    }

                    if (value.length === 0) {
                      setError("kode_propar", {
                        type: "custom",
                        message: "Kode propar is required",
                      })
                    }

                    field.onChange(event.target.value.toUpperCase())
                  }}
                />
                {error ? (
                  <AlertInputError>{error?.message}</AlertInputError>
                ) : (
                  <OfficeManagementCustomPlaceholder ariaPlaceholder="Example: AMP-001">
                    Example: AMP-001
                  </OfficeManagementCustomPlaceholder>
                )}
              </>
            )
          }}
        />
      </OfficeManagementGroupInput>

      <OfficeManagementGroupInput>
        <AddOfficeLabel htmlFor="name" isRequired>
          Building Name
        </AddOfficeLabel>
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
                placeholder="Apartement name"
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
                <OfficeManagementCustomPlaceholder ariaPlaceholder="Example: AMP-001">
                  Example: Ampera Office
                </OfficeManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </OfficeManagementGroupInput>

      <GroupInput direction="column" className="md:w-[384px] md:min-w-max">
        <AddOfficeLabel htmlFor="address">Address</AddOfficeLabel>
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
                <OfficeManagementCustomPlaceholder>
                  Example: Jalan Ampera 1 No. 8
                </OfficeManagementCustomPlaceholder>
              )}
            </>
          )}
        />
      </GroupInput>

      <OfficeManagementGroupInput>
        <AddOfficeLabel htmlFor="building_completion">
          Building Completion
        </AddOfficeLabel>
        <Controller
          control={control}
          name="building_completion"
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="number"
                id="building_completion"
                placeholder="Office building completion"
                disabled={isSubmitting}
                isSubmitted={isSubmitted}
                isTouched={isTouched}
                isError={error}
                onChange={(event) => {
                  field.onChange(stringToNumber(event.target.value))
                }}
              />
              <OfficeManagementCustomPlaceholder>
                Example: 2023
              </OfficeManagementCustomPlaceholder>
            </>
          )}
        />
      </OfficeManagementGroupInput>

      <OfficeManagementGroupInput>
        <AddOfficeLabel htmlFor="certificates">Certificates</AddOfficeLabel>
        <Controller
          control={control}
          name="certificates"
          render={({ field, fieldState: { isTouched, error } }) => (
            <>
              <InputField
                {...field}
                type="text"
                id="certificates"
                placeholder="Office Certificate"
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

      {propertyAreaData?.data?.attributes.length > 0 && (
        <OfficeManagementGroupInput>
          <AddOfficeLabel htmlFor="property_area" isRequired>
            Property Area
          </AddOfficeLabel>

          <Controller
            control={control}
            name="property_area"
            render={({ field, fieldState: { isTouched, error } }) => (
              <SelectCreateable
                {...field}
                isClearable
                isSearchable
                id="property_area"
                placeholder="Select a property area ..."
                value={
                  propertyAreaOptions?.find(
                    (option) => option.value === watchPropertyArea
                  ) || ""
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
        </OfficeManagementGroupInput>
      )}

      <OfficeManagementGroupInput>
        <AddOfficeLabel htmlFor="availability">Availability</AddOfficeLabel>

        <Controller
          control={control}
          name="available"
          render={({ field, fieldState: { isTouched, error } }) => (
            <Select
              {...field}
              id="availability"
              placeholder="Select a availability status ..."
              disabled={isSubmitting}
              isError={error}
              isSubmitted={isSubmitted}
              isTouched={isTouched}
              defaultValue={field.value}
              onValueChange={(value) => {
                field.onChange(JSON.parse(value || false))
              }}
            >
              <SelectItemDefault value="">
                Select an availability status ...
              </SelectItemDefault>
              {available.map(({ value, label }) => (
                <SelectItem
                  key={`select-available-${value}`}
                  value={value}
                  selected={field.value === value && label}
                >
                  {label}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </OfficeManagementGroupInput>

      <OfficeManagementGroupInput>
        <AddOfficeLabel htmlFor="pic.fullname" isRequired>
          PIC Name
        </AddOfficeLabel>

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
      </OfficeManagementGroupInput>

      {!picFullnameIsExist && (
        <>
          <OfficeManagementGroupInput>
            <AddOfficeLabel htmlFor="pic.phone_number" isRequired>
              PIC Phone Number
            </AddOfficeLabel>
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
                      <OfficeManagementCustomPlaceholder>
                        Example : 081234567890
                      </OfficeManagementCustomPlaceholder>
                    )}
                  </>
                )
              }}
            />
          </OfficeManagementGroupInput>

          <OfficeManagementGroupInput>
            <AddOfficeLabel htmlFor="pic.company" isRequired>
              PIC Company
            </AddOfficeLabel>

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
                    <OfficeManagementCustomPlaceholder>
                      Example: Company A
                    </OfficeManagementCustomPlaceholder>
                  )}
                </>
              )}
            />
          </OfficeManagementGroupInput>

          <OfficeManagementGroupInput>
            <AddOfficeLabel htmlFor="pic.role" isRequired>
              PIC Role
            </AddOfficeLabel>

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
                    <OfficeManagementCustomPlaceholder>
                      Example: Owner
                    </OfficeManagementCustomPlaceholder>
                  )}
                </>
              )}
            />
          </OfficeManagementGroupInput>
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

Information.getLayout = getEditOfficeLayout

export default Information
