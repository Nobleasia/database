import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
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
  LandManagementFilterMenu,
  LandTableControl,
} from "@/features/land-management"

const LandManagement = ({ showColumnFieldItems }) => {
  const router = useRouter()
  const { auth } = useAuth()
  const instance = useAxiosPrivate()
  const { toast, handleToggleToast } = useHandleToast()

  const { control, setValue, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      query: "",
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
    data: landData,
    error: isError,
    isLoading,
    mutate: mutateLand,
  } = usePrivateFetcher([process.env.NEXT_PUBLIC_ENDPOINT_LAND_READ, {}], {
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

  const landsData = useMemo(() => {
    if (!landData?.data?.attributes?.records) return []

    return landData?.data?.attributes?.records
  }, [landData?.data?.attributes?.records])

  const handleDeleteLand = async (slug) => {
    await instance.delete(
      `${process.env.NEXT_PUBLIC_ENDPOINT_LAND_DELETE}/${slug}?force_true`
    )

    await mutateLand()
  }

  const handleApplyingFilter = (filtersValues) => {
    const {
      zone,
      property_areas: propertyAreas,
      lease_terms_types: leaseTermsTypes,
      lease_terms: leaseTerms,
      price,
      land_size: landSize,
    } = filtersValues

    const formatFilterValue = (value, defaultValue = 0) => {
      return [value.min || defaultValue, value.max || Number.POSITIVE_INFINITY]
    }

    const columnFilters = [
      { id: "availability", value: filtersValues.availabilities },
      { id: "zone", value: zone },
      {
        id: "leaseTerms",
        value: {
          min: leaseTerms.min || 0,
          max: leaseTerms.max || Number.POSITIVE_INFINITY,
          leaseTermsTypes,
        },
      },
      { id: "price", value: formatFilterValue(price) },
      { id: "landSize", value: formatFilterValue(landSize) },
      { id: "area", value: propertyAreas },
    ]

    setColumnFilters(columnFilters)

    const queryParams = {
      ...router.query,
      page: 1, // Reset page to 1 when filters change
      filters: JSON.stringify(filtersValues), // Store filters in query params
    }

    router.push({
      pathname: router.pathname,
      query: queryParams,
    })
  }

  return (
    <>
      <Head>
        <title>Land Management | Noble Asia Database Management System</title>
      </Head>
      <HeaderPage>
        <TitlePage>Land Management</TitlePage>
        <BreadcrumbsContainer>
          <BreadcrumbsItem href="/land-management" disabled>
            Land Management
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
                    placeholder="Find a land property..."
                    isTouched={isTouched}
                    isError={error}
                  >
                    <MdSearch className="h-8 w-8 text-neutral-700" />
                  </InputField>
                )}
              />

              <LandManagementFilterMenu
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
                    keyPrefix="land-management-show-column"
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
                href="/land-management/property-partialan"
                className="flex w-full items-center rounded-md bg-npa-info-300 p-[10px] text-center font-semibold text-npa-neutral-25 transition-all duration-200 hover:bg-npa-info-400 active:bg-npa-info-500 lg:h-full lg:w-max"
              >
                <Button
                  variant="custom"
                  className="h-full w-full text-center"
                  tabIndex={-1}
                >
                  Property Particular
                </Button>
              </Link>
              {auth?.user_role !== "user" && (
                <Link
                  href="/land-management/add"
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

          <LandTableControl
            control={control}
            isLoading={isLoading}
            isError={isError}
            visibleColumnsObject={visibleColumnsObject}
            pageIndexWatch={pageIndexWatch}
            pageSizeWatch={pageSizeWatch}
            setValue={setValue}
            tableData={landsData}
            queryWatch={queryWatch}
            handleToggleToast={handleToggleToast}
            handleDeleteLand={handleDeleteLand}
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
        { id: "address", value: "address", label: "Address" },
        { id: "area", value: "area", label: "Area" },
        { id: "landSize", value: "landSize", label: "Land Size" },
        { id: "ownership", value: "ownership", label: "Ownership" },
        { id: "availability", value: "availability", label: "Availability" },
        { id: "zone", value: "zone", label: "Zone" },
        { id: "surroundings", value: "surroundings", label: "Surroundings" },
        { id: "picName", value: "picName", label: "PIC Name" },
        { id: "picRole", value: "picRole", label: "PIC Role" },
        {
          id: "picPhoneNumber",
          value: "picPhoneNumber",
          label: "PIC Phone Number",
        },
        { id: "price", value: "price", label: "Price" },
        { id: "paymentTerms", value: "paymentTerms", label: "Payment Terms" },
        { id: "leaseTerms", value: "leaseTerms", label: "Lease Terms" },
        { id: "taxFee", value: "taxFee", label: "Tax Fee" },
        { id: "remarks1", value: "remarks1", label: "Remarks 1" },
        { id: "remarks2", value: "remarks2", label: "Remarks 2" },
        { id: "remarks3", value: "remarks3", label: "Remarks 3" },
        { id: "updatedAt", value: "updatedAt", label: "Last Updated" },
      ],
    },
  }
}

LandManagement.getLayout = getAdminLayout

export default LandManagement
