import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
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
  HomeManagementFilterMenu,
  HomeTableControl,
} from "@/features/home-management"

const HomeManagement = ({ showColumnFieldItems }) => {
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
        furnishing: [],
        availabilities: [],
        swimming_pool: [],
        backyard: [],
        house_type: [],
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
        land_size: {
          min: "",
          max: "",
        },
        building_size: {
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
        carport_or_garage: {
          min: "",
          max: "",
        },
        stories: {
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
    data: homeData,
    error: isError,
    isLoading,
    mutate: mutateHome,
  } = usePrivateFetcher([process.env.NEXT_PUBLIC_ENDPOINT_HOME_READ, {}], {
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

  const homesData = useMemo(() => {
    if (!homeData?.data?.attributes?.records) return []

    return homeData?.data?.attributes?.records
  }, [homeData?.data?.attributes?.records])

  const handleDeleteHome = async (slug) => {
    await instance.delete(
      `${process.env.NEXT_PUBLIC_ENDPOINT_HOME_DELETE}/${slug}?force=true`
    )

    await mutateHome()
  }

  const handleApplyingFilter = (filtersValues) => {
    const {
      property_areas: propertyAreas,
      lease_terms_types: leaseTermsTypes,
      lease_terms: leaseTerms,
      rental_price: rentalPrice,
      selling_price: sellingPrice,
      land_size: landSize,
      building_size: buildingSize,
      bedroom,
      bathroom,
      study_room: studyRoom,
      carport_or_garage: carportOrGarage,
      stories,
    } = filtersValues

    const formatFilterValue = (value, defaultValue = 0) => {
      return [value.min || defaultValue, value.max || Number.POSITIVE_INFINITY]
    }

    const columnFilters = [
      { id: "availability", value: filtersValues.availabilities },
      { id: "furnishing", value: filtersValues.furnishing },
      { id: "houseType", value: filtersValues.house_type },
      { id: "priceCurrency", value: filtersValues.price_currencies },
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
      { id: "landSize", value: formatFilterValue(landSize) },
      { id: "buildingSize", value: formatFilterValue(buildingSize) },
      { id: "stories", value: formatFilterValue(stories) },
      { id: "bedroom", value: formatFilterValue(bedroom) },
      { id: "bathroom", value: formatFilterValue(bathroom) },
      { id: "studyRoom", value: formatFilterValue(studyRoom) },
      { id: "carportOrGarage", value: formatFilterValue(carportOrGarage) },
      { id: "swimmingPool", value: filtersValues.swimming_pool },
      { id: "backyard", value: filtersValues.backyard },
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

  const handleSearchChange = (searchQuery) => {
    const queryParams = {
      ...router.query,
      page: 1, // Reset page to 1 when filters change
      search: searchQuery,
    }

    router.push({
      pathname: router.pathname,
      query: queryParams,
    })
  }

  useEffect(() => {
    const queryParams = {
      ...router.query,
      page: 1,
      search: queryWatch, // Update the search parameter with queryWatch
    }

    router.push({
      pathname: router.pathname,
      query: queryParams,
    })
  }, [queryWatch])

  useEffect(() => {
    const queryParams = {
      ...router.query,
    }

    if (queryParams.search) {
      const parsedSearchQuery = queryParams.search

      setValue("query", parsedSearchQuery)

      handleSearchChange(parsedSearchQuery)
    }

    if (queryParams.filters) {
      const parsedFilters = JSON.parse(queryParams.filters)

      Object.keys(parsedFilters).forEach((key) => {
        setValue(`filter.${key}`, parsedFilters[key])
      })

      handleApplyingFilter(parsedFilters)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Home Management | Noble Asia Database Management System</title>
      </Head>
      <HeaderPage>
        <TitlePage>Home Management</TitlePage>
        <BreadcrumbsContainer>
          <BreadcrumbsItem href="/home-management" disabled>
            Home Management
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
                    placeholder="Find a home property..."
                    isTouched={isTouched}
                    isError={error}
                  >
                    <MdSearch className="h-8 w-8 text-neutral-700" />
                  </InputField>
                )}
              />

              <HomeManagementFilterMenu
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
                    keyPrefix="home-management-show-column"
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
                href="/home-management/property-partialan"
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
                  href="/home-management/add"
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

          <HomeTableControl
            control={control}
            isLoading={isLoading}
            isError={isError}
            visibleColumnsObject={visibleColumnsObject}
            pageIndexWatch={pageIndexWatch}
            pageSizeWatch={pageSizeWatch}
            setValue={setValue}
            tableData={homesData}
            queryWatch={queryWatch}
            handleToggleToast={handleToggleToast}
            handleDeleteHome={handleDeleteHome}
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
        { id: "name", value: "name", label: "Name" },
        { id: "address", value: "address", label: "Address" },
        { id: "area", value: "area", label: "Area" },
        { id: "landSize", value: "landSize", label: "Land Size" },
        { id: "buildingSize", value: "buildingSize", label: "Building Size" },
        { id: "stories", value: "stories", label: "Stories" },
        { id: "furnishing", value: "furnishing", label: "Furnishing" },
        { id: "bedroom", value: "bedroom", label: "Bedroom" },
        { id: "bathroom", value: "bathroom", label: "Bathroom" },
        { id: "studyRoom", value: "studyRoom", label: "Study Room" },
        {
          id: "carportOrGarage",
          value: "carportOrGarage",
          label: "Carport / Garage",
        },
        { id: "backyard", value: "backyard", label: "Backyard" },
        { id: "swimmingPool", value: "swimmingPool", label: "Swimming Pool" },
        { id: "houseType", value: "houseType", label: "House Type" },
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
        { id: "compoundFee", value: "compoundFee", label: "Compound Fee" },
        {
          id: "compoundFeeCoverage",
          value: "compoundFeeCoverage",
          label: "Compound Fee Coverage",
        },
        { id: "paymentTerms", value: "paymentTerms", label: "Payment Terms" },
        { id: "leaseTerms", value: "leaseTerms", label: "Lease Terms" },
        { id: "taxFee", value: "taxFee", label: "Tax Fee" },
        { id: "facilities", value: "facilities", label: "Facilities" },
        { id: "remarks1", value: "remarks1", label: "Remarks 1" },
        { id: "remarks2", value: "remarks2", label: "Remarks 2" },
        { id: "remarks3", value: "remarks3", label: "Remarks 3" },
        { id: "updatedAt", value: "updatedAt", label: "Last Updated" },
      ],
    },
  }
}

HomeManagement.getLayout = getAdminLayout

export default HomeManagement
