import Head from "next/head"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { AiFillPlusCircle } from "react-icons/ai"
import { MdSearch, MdViewColumn } from "react-icons/md"

import { getAdminLayout } from "@/layouts"

import {
  useAuth,
  useAxiosPrivate,
  useHandleToast,
  usePrivateFetcher,
} from "@/hooks"

import {
  BreadcrumbsContainer,
  BreadcrumbsItem,
  Button,
  HeaderPage,
  InputField,
  SelectMultiple,
  TitlePage,
  Toast,
  ToastProvider,
  ToastViewport,
} from "@/components"

import {
  OfficeManagementFilterMenu,
  OfficeTableControl,
} from "@/features/office-management"

const OfficeManagement = ({ showColumnFieldItems }) => {
  const { auth } = useAuth()
  const instance = useAxiosPrivate()
  const { toast, handleToggleToast } = useHandleToast()

  const { control, setValue, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      query: "",
      filter: {
        payment_terms: [],
        property_areas: [],
        condition: [],
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
        semi_gross_area: {
          min: "",
          max: "",
        },
      },
      showColumn: ["all"],
      pageSize: 25,
      pageIndex: 0,
    },
  })

  const [columnFilters, setColumnFilters] = useState([])

  const [
    // eslint-disable-next-line no-unused-vars
    queryWatch,
    // eslint-disable-next-line no-unused-vars
    filterWatch,
    showColumnWatch,
    pageSizeWatch,
    pageIndexWatch,
  ] = useWatch({
    control,
    name: ["query", "filter", "showColumn", "pageSize", "pageIndex"],
  })

  const {
    data: officeData,
    error: isError,
    isLoading,
    mutate: mutateOffice,
  } = usePrivateFetcher([process.env.NEXT_PUBLIC_ENDPOINT_OFFICE_READ, {}], {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const visibleColumnsObject = useMemo(() => {
    return showColumnFieldItems.reduce((acc, curr) => {
      if (showColumnWatch[0] === "all") {
        acc[curr.value] = true
      } else {
        acc[curr.value] = showColumnWatch?.includes(curr.value)
      }

      return acc
    }, {})
  }, [showColumnWatch])

  const toastState = useMemo(() => {
    return { ...toast }
  }, [toast])

  const officesData = useMemo(() => {
    if (!officeData?.data?.attributes?.records) return []

    return officeData?.data?.attributes?.records
  }, [officeData?.data?.attributes?.records])

  const handleDeleteOffice = async (slug) => {
    await instance.delete(
      `${process.env.NEXT_PUBLIC_ENDPOINT_OFFICE_DELETE}/${slug}?force=true`
    )

    await mutateOffice()
  }

  const handleApplyingFilter = (filtersValues) => {
    const {
      availabilities,
      condition,
      property_areas: propertyAreas,
      price_currencies: priceCurrencies,
      lease_terms_types: leaseTermsTypes,
      lease_terms: leaseTerms,
      rental_price: rentalPrice,
      selling_price: sellingPrice,
      semi_gross_area: semiGrossArea,
    } = filtersValues

    const formatFilterValue = (value, defaultValue = 0) => {
      return [value.min || defaultValue, value.max || Number.POSITIVE_INFINITY]
    }

    const columnFilters = [
      { id: "availability", value: availabilities },
      { id: "condition", value: condition },
      { id: "paymentTerms", value: filtersValues.payment_terms },
      { id: "priceCurrency", value: priceCurrencies },
      {
        id: "leaseTerms",
        value: {
          min: leaseTerms.min || 0,
          max: leaseTerms.max || Number.POSITIVE_INFINITY,
          leaseTermsTypes,
        },
      },
      { id: "rentalPrice", value: formatFilterValue(rentalPrice) },
      { id: "sellingPrice", value: formatFilterValue(sellingPrice) },
      { id: "semiGrossArea", value: formatFilterValue(semiGrossArea) },
      { id: "area", value: propertyAreas },
    ]

    setColumnFilters(columnFilters)
  }

  return (
    <>
      <Head>
        <title>Office Management | Noble Asia Database Management System</title>
      </Head>
      <HeaderPage>
        <TitlePage>Office Management</TitlePage>
        <BreadcrumbsContainer>
          <BreadcrumbsItem href="/office-management" disabled>
            Office Management
          </BreadcrumbsItem>
        </BreadcrumbsContainer>
      </HeaderPage>

      <ToastProvider swipeDirection="right" duration={1500}>
        <section className="flex flex-col gap-5 rounded-md bg-white p-5">
          <div className="grid h-max grid-rows-[max-content_max-content] gap-5 lg:grid-rows-1 xl:max-h-12 xl:grid-cols-[2fr_1fr]">
            <div className="grid grid-rows-3 gap-3 lg:grid-cols-[1fr_max-content_1fr] lg:grid-rows-1">
              <Controller
                control={control}
                name="query"
                render={({ field, formState: { isTouched, error } }) => (
                  <InputField
                    {...field}
                    type="search"
                    id="kodePropar"
                    placeholder="Find an office property..."
                    isTouched={isTouched}
                    isError={error}
                  >
                    <MdSearch className="h-8 w-8 text-neutral-700" />
                  </InputField>
                )}
              />

              <OfficeManagementFilterMenu
                control={control}
                reset={reset}
                filterValues={filterWatch}
                onApplyingFilter={handleApplyingFilter}
              />

              <Controller
                control={control}
                name="showColumn"
                render={({ field, formState: { isTouched, error } }) => (
                  <SelectMultiple
                    {...field}
                    items={showColumnFieldItems}
                    value={showColumnWatch}
                    id="showColumn"
                    keyPrefix="office-management-show-column"
                    isTouched={isTouched}
                    isError={error}
                    onValueChange={field.onChange}
                    position="popper"
                    sideOffset={8}
                    defaultValue="all"
                    placeholder={
                      <span className="flex items-center gap-3 font-medium text-npa-neutral-700">
                        <div className="h-max w-max">
                          <MdViewColumn className="h-6 w-6" />
                        </div>
                        Show Column
                      </span>
                    }
                  />
                )}
              />
            </div>
            <div className="flex h-max flex-col items-center gap-4 lg:flex-row xl:h-full xl:justify-end">
              <Link
                href="/office-management/property-partialan"
                className="flex w-full items-center rounded-md bg-npa-info-300 p-[10px] text-center font-semibold text-npa-neutral-25 transition-all duration-200 hover:bg-npa-info-400 active:bg-npa-info-500 lg:h-full lg:w-max"
              >
                <Button
                  variant="custom"
                  className="h-full w-full text-center"
                  tabIndex={-1}
                >
                  Property Partialan
                </Button>
              </Link>
              {auth?.user_role !== "user" && (
                <Link
                  href="/office-management/add"
                  className="flex h-full w-full items-center justify-center gap-3 rounded-md bg-npa-charcoal-400 p-[10px] font-semibold text-npa-neutral-25 transition-all duration-200 hover:bg-npa-charcoal-500 active:bg-npa-charcoal-600 lg:w-max"
                >
                  <Button
                    variant="custom"
                    className="inline-flex items-center gap-2"
                    tabIndex={-1}
                  >
                    <AiFillPlusCircle className="h-5 w-5" />
                    <span>Add Property</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <OfficeTableControl
            control={control}
            isLoading={isLoading}
            isError={isError}
            visibleColumnsObject={visibleColumnsObject}
            pageIndexWatch={pageIndexWatch}
            pageSizeWatch={pageSizeWatch}
            setValue={setValue}
            tableData={officesData}
            queryWatch={queryWatch}
            handleToggleToast={handleToggleToast}
            handleDeleteOffice={handleDeleteOffice}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        </section>

        {toastState.open && (
          <Toast
            {...toastState}
            onOpenChange={() => {
              handleToggleToast({
                message: "",
                variant: "",
                open: false,
              })
            }}
          />
        )}

        <ToastViewport />
      </ToastProvider>
    </>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      showColumnFieldItems: [
        {
          id: "kodePropar",
          value: "kodePropar",
          label: "Kode Propar",
        },
        { id: "buildingName", value: "buildingName", label: "Building Name" },
        { id: "address", value: "address", label: "Address" },
        { id: "area", value: "area", label: "Area" },
        {
          id: "buildingCompletion",
          value: "buildingCompletion",
          label: "Building Completion",
        },
        { id: "certificates", value: "certificates", label: "Certificates" },
        { id: "grade", value: "grade", label: "Grade" },
        { id: "floor", value: "floor", label: "Floor" },
        { id: "condition", value: "condition", label: "Condition" },
        {
          id: "semiGrossArea",
          value: "semiGrossArea",
          label: "Semi Gross Area",
        },
        { id: "availability", value: "availability", label: "Availability" },
        { id: "picName", value: "picName", label: "PIC Name" },
        { id: "picRole", value: "picRole", label: "PIC Role" },
        {
          id: "picPhoneNumber",
          value: "picPhoneNumber",
          label: "PIC Phone Number",
        },
        {
          id: "priceCurrency",
          value: "priceCurrency",
          label: "Price Currency",
        },
        { id: "rentalPrice", value: "rentalPrice", label: "Rental Price" },
        { id: "sellingPrice", value: "sellingPrice", label: "Selling Price" },
        {
          id: "serviceCharge",
          value: "serviceCharge",
          label: "Service Charge",
        },
        {
          id: "overtime",
          value: "overtime",
          label: "Overtime",
        },
        {
          id: "securityDeposit",
          value: "securityDeposit",
          label: "Security Deposit",
        },
        { id: "paymentTerms", value: "paymentTerms", label: "Payment Terms" },
        { id: "leaseTerms", value: "leaseTerms", label: "Lease Terms" },
        { id: "taxFee", value: "taxFee", label: "Tax Fee" },
        { id: "facilities", value: "facilities", label: "Facilities" },
        { id: "parkingRatio", value: "parkingRatio", label: "Parking Ratio" },
        { id: "remarks1", value: "remarks1", label: "Remarks 1" },
        { id: "remarks2", value: "remarks2", label: "Remarks 2" },
        { id: "remarks3", value: "remarks3", label: "Remarks 3" },
        { id: "updatedAt", value: "updatedAt", label: "Last Updated" },
      ],
    },
  }
}

OfficeManagement.getLayout = getAdminLayout

export default OfficeManagement
