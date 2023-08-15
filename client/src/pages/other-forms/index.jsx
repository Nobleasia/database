import Head from "next/head"
import { useMemo } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { MdSearch } from "react-icons/md"

import { getAdminLayout } from "@/layouts"

import {
  useAxiosPrivate,
  useDebounce,
  useHandleToast,
  usePrivateFetcher,
} from "@/hooks"

import {
  BreadcrumbsContainer,
  BreadcrumbsItem,
  HeaderPage,
  InputField,
  TitlePage,
  Toast,
  ToastProvider,
  ToastViewport,
} from "@/components"

import {
  AddPicCompanyDialog,
  AddPicDialog,
  AddPicRoleDialog,
  AddPropertyAreaDialog,
  AddPropertyFacilityDialog,
  AddPropertyPaymentTermsDialog,
  AreaTableControl,
  FacilitiesTableControl,
  OtherFormsContainer,
  PICCompaniesTableControl,
  PICRoleTableControl,
  PICTableControl,
  PaymentTermsTableControl,
} from "@/features/other-forms"

const OtherFormsManagement = () => {
  const fetcherConfig = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: true,
  }

  const instance = useAxiosPrivate()
  const { toast, handleToggleToast } = useHandleToast()

  const { control } = useForm({
    mode: "onChange",
    defaultValues: {
      // PIC
      queryPic: "",
      pageSizePic: 5,
      pageIndexPic: 0,

      // PIC Role
      queryPicRole: "",
      pageSizePicRole: 5,
      pageIndexPicRole: 0,

      // PIC Company
      queryPicCompanies: "",
      pageSizePicCompanies: 5,
      pageIndexPicCompanies: 0,

      // Area
      queryPropertyArea: "",
      pageSizePropertyArea: 5,
      pageIndexPropertyArea: 0,

      // Payment Terms
      queryPaymentTerms: "",
      pageSizePaymentTerms: 5,
      pageIndexPaymentTerms: 0,

      // Facilities
      queryFacilities: "",
      pageSizeFacilities: 5,
      pageIndexFacilities: 0,
    },
  })

  const [
    queryWatchPic,
    pageSizeWatchPic,
    // eslint-disable-next-line no-unused-vars
    pageIndexWatchPic,
    queryWatchPicRole,
    pageSizeWatchPicRole,
    // eslint-disable-next-line no-unused-vars
    pageIndexWatchPicRole,
    queryWatchPicCompanies,
    pageSizeWatchPicCompanies,
    // eslint-disable-next-line no-unused-vars
    pageIndexWatchPicCompanies,
    queryWatchArea,
    pageSizeWatchArea,
    // eslint-disable-next-line no-unused-vars
    pageIndexWatchArea,
    queryWatchPaymentTerms,
    pageSizeWatchPaymentTerms,
    // eslint-disable-next-line no-unused-vars
    pageIndexWatchPaymentTerms,
    queryWatchFacilities,
    pageSizeWatchFacilities,
    // eslint-disable-next-line no-unused-vars
    pageIndexWatchFacilities,
  ] = useWatch({
    control,
    name: [
      "queryPic",
      "pageSizePic",
      "pageIndexPic",
      "queryPicRole",
      "pageSizePicRole",
      "pageIndexPicRole",
      "queryPicCompanies",
      "pageSizePicCompanies",
      "pageIndexPicCompanies",
      "queryPropertyArea",
      "pageSizePropertyArea",
      "pageIndexPropertyArea",
      "queryPaymentTerms",
      "pageSizePaymentTerms",
      "pageIndexPaymentTerms",
      "queryFacilities",
      "pageSizeFacilities",
      "pageIndexFacilities",
    ],
  })

  const {
    data: picData,
    error: picError,
    isLoading: picLoading,
    mutate: mutatePic,
  } = usePrivateFetcher(
    [`${process.env.NEXT_PUBLIC_ENDPOINT_PIC_READ}`, {}],
    fetcherConfig
  )

  const {
    data: picRoleData,
    error: picRoleError,
    isLoading: picRoleLoading,
    mutate: mutatePicRole,
  } = usePrivateFetcher(
    [`${process.env.NEXT_PUBLIC_ENDPOINT_PIC_ROLES_READ}`, {}],
    fetcherConfig
  )

  const {
    data: picCompaniesData,
    error: picCompaniesError,
    isLoading: picCompaniesLoading,
    mutate: mutatePicCompanies,
  } = usePrivateFetcher(
    [`${process.env.NEXT_PUBLIC_ENDPOINT_PIC_COMPANIES_READ}`, {}],
    fetcherConfig
  )

  const {
    data: areaData,
    error: areaError,
    isLoading: areaLoading,
    mutate: mutateArea,
  } = usePrivateFetcher(
    [`${process.env.NEXT_PUBLIC_ENDPOINT_PROPERTY_AREA_READ}`, {}],
    fetcherConfig
  )

  const {
    data: paymentTermsData,
    error: paymentTermsError,
    isLoading: paymentTermsLoading,
    mutate: mutatePaymentTerms,
  } = usePrivateFetcher(
    [`${process.env.NEXT_PUBLIC_ENDPOINT_PAYMENT_TERMS_READ}`, {}],
    fetcherConfig
  )

  const {
    data: facilitiesData,
    error: facilitiesError,
    isLoading: facilitiesLoading,
    mutate: mutateFacilities,
  } = usePrivateFetcher(
    [`${process.env.NEXT_PUBLIC_ENDPOINT_FACILITIES_READ}`, {}],
    fetcherConfig
  )

  const toastState = useMemo(() => {
    return { ...toast }
  }, [toast])

  const pagesSize = useMemo(() => {
    const pageSizePic = Math.ceil(
      picData?.data?.attributes?.length === 0
        ? 1
        : picData?.data?.attributes?.length ?? 0 / pageSizeWatchPic
    )

    const pageSizePicRole = Math.ceil(
      picRoleData?.data?.attributes?.length === 0
        ? 1
        : picRoleData?.data?.attributes?.length ?? 0 / pageSizeWatchPicRole
    )

    const pageSizePicCompanies = Math.ceil(
      picCompaniesData?.data?.attributes?.length === 0
        ? 1
        : picCompaniesData?.data?.attributes?.length ??
            0 / pageSizeWatchPicCompanies
    )

    const pageSizeArea = Math.ceil(
      areaData?.data?.attributes?.length === 0
        ? 1
        : areaData?.data?.attributes?.length ?? 0 / pageSizeWatchArea
    )

    const pageSizePaymentTerms = Math.ceil(
      paymentTermsData?.data?.attributes?.length === 0
        ? 1
        : paymentTermsData?.data?.attributes?.length ??
            0 / pageSizeWatchPaymentTerms
    )

    const pageSizeFacilities = Math.ceil(
      facilitiesData?.data?.attributes?.length === 0
        ? 1
        : facilitiesData?.data?.attributes?.length ??
            0 / pageSizeWatchFacilities
    )

    return {
      pageSizePic,
      pageSizeArea,
      pageSizePaymentTerms,
      pageSizePicRole,
      pageSizePicCompanies,
      pageSizeFacilities,
    }
  }, [])

  const queryWatchPicDebounce = useDebounce(queryWatchPic, 500)
  const queryWatchPicRoleDebounce = useDebounce(queryWatchPicRole, 500)
  const queryWatchPicCompaniesDebounce = useDebounce(
    queryWatchPicCompanies,
    500
  )
  const queryWatchAreaDebounce = useDebounce(queryWatchArea, 500)
  const queryWatchPaymentTermsDebounce = useDebounce(
    queryWatchPaymentTerms,
    500
  )
  const queryWatchFacilitiesDebounce = useDebounce(queryWatchFacilities, 500)

  const filteredPicData = useMemo(() => {
    if (!picData?.data?.attributes) return []

    return picData?.data?.attributes?.filter((item) =>
      item.fullname.toLowerCase().includes(queryWatchPicDebounce.toLowerCase())
    )
  }, [picData, queryWatchPicDebounce])

  const filteredPicRoleData = useMemo(() => {
    if (!picRoleData?.data?.attributes) return []

    return picRoleData?.data?.attributes?.filter((item) =>
      item.name.toLowerCase().includes(queryWatchPicRoleDebounce.toLowerCase())
    )
  }, [picRoleData, queryWatchPicRoleDebounce])

  const filteredPicCompaniesData = useMemo(() => {
    if (!picCompaniesData?.data?.attributes) return []

    return picCompaniesData?.data?.attributes?.filter((item) =>
      item.name
        .toLowerCase()
        .includes(queryWatchPicCompaniesDebounce.toLowerCase())
    )
  }, [picCompaniesData, queryWatchPicCompaniesDebounce])

  const filteredAreaData = useMemo(() => {
    if (!areaData?.data?.attributes) return []

    return areaData?.data?.attributes?.filter((item) =>
      item.region_name
        .toLowerCase()
        .includes(queryWatchAreaDebounce.toLowerCase())
    )
  }, [areaData, queryWatchAreaDebounce])

  const filteredPaymentTermsData = useMemo(() => {
    if (!paymentTermsData?.data?.attributes) return []

    return paymentTermsData?.data?.attributes?.filter((item) =>
      item.payment_term
        .toLowerCase()
        .includes(queryWatchPaymentTermsDebounce.toLowerCase())
    )
  }, [paymentTermsData, queryWatchPaymentTermsDebounce])

  const filteredFacilities = useMemo(() => {
    if (!facilitiesData?.data?.attributes) return []

    return facilitiesData?.data?.attributes?.filter((item) =>
      item.facility_name
        .toLowerCase()
        .includes(queryWatchFacilitiesDebounce.toLowerCase())
    )
  }, [facilitiesData, queryWatchFacilitiesDebounce])

  const handleDeletePic = async (id) => {
    await instance.delete(
      `${process.env.NEXT_PUBLIC_ENDPOINT_PIC_DELETE}/${id}?force=true`
    )

    await mutatePic()
  }

  const handleDeletePicRole = async (id) => {
    await instance.delete(
      `${process.env.NEXT_PUBLIC_ENDPOINT_PIC_ROLES_DELETE}/${id}?force=true`
    )

    await mutatePicRole()
  }

  const handleDeletePicCompanies = async (id) => {
    await instance.delete(
      `${process.env.NEXT_PUBLIC_ENDPOINT_PIC_COMPANIES_DELETE}/${id}?force=true`
    )

    await mutatePicCompanies()
  }

  const handleDeleteArea = async (id) => {
    await instance.delete(
      `${process.env.NEXT_PUBLIC_ENDPOINT_PROPERTY_AREA_DELETE}/${id}?force=true`
    )

    await mutateArea()
  }

  const handleDeletePaymentTerm = async (id) => {
    await instance.delete(
      `${process.env.NEXT_PUBLIC_ENDPOINT_PAYMENT_TERMS_DELETE}/${id}?force=true`
    )

    await mutatePaymentTerms()
  }

  const handleDeleteFacilities = async (id) => {
    await instance.delete(
      `${process.env.NEXT_PUBLIC_ENDPOINT_FACILITIES_DELETE}/${id}?force=true`
    )

    await mutateFacilities()
  }

  return (
    <>
      <Head>
        <title>Other Forms | Noble Asia Database Management System</title>
      </Head>
      <HeaderPage>
        <TitlePage>Other Forms</TitlePage>
        <BreadcrumbsContainer>
          <BreadcrumbsItem href="/other-forms" disabled>
            Other Forms
          </BreadcrumbsItem>
        </BreadcrumbsContainer>
      </HeaderPage>

      <ToastProvider swipeDirection="right" duration={1500}>
        <div className="grid auto-rows-max grid-cols-1 gap-8 lg:grid-cols-2">
          <OtherFormsContainer
            containerTitle="Property Person in Charge"
            variant="full"
            title="Property Person in Charge"
            renderHeaderComponent={
              <>
                <Controller
                  control={control}
                  name="queryPic"
                  render={({ field, formState: { isTouched, error } }) => (
                    <InputField
                      {...field}
                      type="text"
                      id="queryPic"
                      placeholder="Find a PIC name ..."
                      isTouched={isTouched}
                      isError={error}
                    >
                      <MdSearch className="h-5 w-5 text-neutral-700" />
                    </InputField>
                  )}
                />

                <AddPicDialog mutateDataOrigin={mutatePic} />
              </>
            }
            renderTableComponent={
              <PICTableControl
                control={control}
                isLoading={picLoading}
                isError={picError}
                pageSizeWatch={pageSizeWatchPic}
                pageCount={pagesSize.pageSizePic}
                totalDataCount={filteredPicData?.length}
                tableData={filteredPicData}
                handleToggleToast={handleToggleToast}
                handleDeleteDataOrigin={handleDeletePic}
                mutateDataOrigin={mutatePic}
              />
            }
          />

          <OtherFormsContainer
            containerTitle="Property Person in Charge Role"
            renderHeaderComponent={
              <>
                <Controller
                  control={control}
                  name="queryPicRole"
                  render={({ field, formState: { isTouched, error } }) => (
                    <InputField
                      {...field}
                      type="text"
                      id="queryPic"
                      placeholder="Find a PIC role ...."
                      isTouched={isTouched}
                      isError={error}
                    >
                      <MdSearch className="h-5 w-5 text-neutral-700" />
                    </InputField>
                  )}
                />

                <AddPicRoleDialog mutateDataOrigin={mutatePicRole} />
              </>
            }
            renderTableComponent={
              <PICRoleTableControl
                control={control}
                isLoading={picRoleLoading}
                isError={picRoleError}
                pageSizeWatch={pageSizeWatchPicRole}
                pageCount={pagesSize.pageSizePic}
                totalDataCount={filteredPicRoleData?.length}
                tableData={filteredPicRoleData}
                handleToggleToast={handleToggleToast}
                handleDeleteDataOrigin={handleDeletePicRole}
                mutateDataOrigin={mutatePicRole}
              />
            }
          />

          <OtherFormsContainer
            containerTitle="Property Person in Charge Company"
            renderHeaderComponent={
              <>
                <Controller
                  control={control}
                  name="queryPicCompanies"
                  render={({ field, formState: { isTouched, error } }) => (
                    <InputField
                      {...field}
                      type="text"
                      id="queryPic"
                      placeholder="Find a PIC company ..."
                      isTouched={isTouched}
                      isError={error}
                    >
                      <MdSearch className="h-5 w-5 text-neutral-700" />
                    </InputField>
                  )}
                />

                <AddPicCompanyDialog mutateDataOrigin={mutatePicCompanies} />
              </>
            }
            renderTableComponent={
              <PICCompaniesTableControl
                control={control}
                isLoading={picCompaniesLoading}
                isError={picCompaniesError}
                pageSizeWatch={pageSizeWatchPicCompanies}
                pageCount={pagesSize.pageSizePicCompanies}
                totalDataCount={filteredPicCompaniesData?.length}
                tableData={filteredPicCompaniesData}
                handleToggleToast={handleToggleToast}
                mutateDataOrigin={mutatePicCompanies}
                handleDeleteDataOrigin={handleDeletePicCompanies}
              />
            }
          />

          <OtherFormsContainer
            containerTitle="Property Area"
            renderHeaderComponent={
              <>
                <Controller
                  control={control}
                  name="queryPropertyArea"
                  render={({ field, formState: { isTouched, error } }) => (
                    <InputField
                      {...field}
                      type="text"
                      id="queryPropertyArea"
                      placeholder="Find an area..."
                      isTouched={isTouched}
                      isError={error}
                    >
                      <MdSearch className="h-5 w-5 text-neutral-700" />
                    </InputField>
                  )}
                />

                <AddPropertyAreaDialog mutateDataOrigin={mutateArea} />
              </>
            }
            renderTableComponent={
              <AreaTableControl
                control={control}
                isLoading={areaLoading}
                isError={areaError}
                pageSizeWatch={pageSizeWatchArea}
                pageCount={pagesSize.pageSizeArea}
                totalDataCount={filteredAreaData?.length}
                tableData={filteredAreaData}
                handleToggleToast={handleToggleToast}
                mutateDataOrigin={mutateArea}
                handleDeleteDataOrigin={handleDeleteArea}
              />
            }
          />

          <OtherFormsContainer
            containerTitle="Property Payment Terms"
            renderHeaderComponent={
              <>
                <Controller
                  control={control}
                  name="queryPaymentTerms"
                  render={({ field, formState: { isTouched, error } }) => (
                    <InputField
                      {...field}
                      type="text"
                      id="queryPaymentTerms"
                      placeholder="Find a payment term..."
                      isTouched={isTouched}
                      isError={error}
                    >
                      <MdSearch className="h-5 w-5 text-neutral-700" />
                    </InputField>
                  )}
                />

                <AddPropertyPaymentTermsDialog
                  mutateDataOrigin={mutatePaymentTerms}
                />
              </>
            }
            renderTableComponent={
              <PaymentTermsTableControl
                control={control}
                isLoading={paymentTermsLoading}
                isError={paymentTermsError}
                pageSizeWatch={pageSizeWatchPaymentTerms}
                pageCount={pagesSize.pageSizePaymentTerms}
                totalDataCount={filteredPaymentTermsData?.length}
                tableData={filteredPaymentTermsData}
                handleToggleToast={handleToggleToast}
                mutateDataOrigin={mutatePaymentTerms}
                handleDeleteDataOrigin={handleDeletePaymentTerm}
              />
            }
          />

          <OtherFormsContainer
            containerTitle="Property Facilities"
            renderHeaderComponent={
              <>
                <Controller
                  control={control}
                  name="queryFacilities"
                  render={({ field, formState: { isTouched, error } }) => (
                    <InputField
                      {...field}
                      type="text"
                      id="queryFacilities"
                      placeholder="Find a facility..."
                      isTouched={isTouched}
                      isError={error}
                    >
                      <MdSearch className="h-5 w-5 text-neutral-700" />
                    </InputField>
                  )}
                />

                <AddPropertyFacilityDialog
                  mutateDataOrigin={mutateFacilities}
                />
              </>
            }
            renderTableComponent={
              <FacilitiesTableControl
                control={control}
                isLoading={facilitiesLoading}
                isError={facilitiesError}
                pageSizeWatch={pageSizeWatchFacilities}
                pageCount={pagesSize.pageSizeFacilities}
                totalDataCount={filteredFacilities?.length}
                tableData={filteredFacilities}
                handleToggleToast={handleToggleToast}
                mutateDataOrigin={mutateFacilities}
                handleDeleteDataOrigin={handleDeleteFacilities}
              />
            }
          />
        </div>

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

OtherFormsManagement.getLayout = getAdminLayout

export default OtherFormsManagement
