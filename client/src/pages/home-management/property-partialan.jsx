/* eslint-disable camelcase, object-shorthand, no-plusplus, no-await-in-loop, no-restricted-syntax, no-loop-func */
import Head from "next/head"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { MdArrowBack } from "react-icons/md"

import { getAdminLayout } from "@/layouts"

import {
  useAxiosPrivate,
  useDatasFetcher,
  useDebounce,
  useHandleToast,
  usePrivateFetcher,
} from "@/hooks"

import {
  BreadcrumbsContainer,
  BreadcrumbsItem,
  Button,
  HeaderPage,
  ImagePreviewAsync,
  Label,
  Loader,
  SelectMultiple,
  SelectSearchable,
  TitlePage,
  Toast,
  ToastProvider,
  ToastViewport,
} from "@/components"

import {
  PropertyPartialanSelectedColumnItemsMemoize,
  generateExcel,
  generatePDF,
} from "@/features/home-management"
import { PublicLinkDialog } from "@/features/property-partialan/components/public-link-dialog"

const PropertyPartialan = ({ columns }) => {
  const { control } = useForm({
    mode: "onChange",
    defaultValues: {
      kodePropar: "",
      selectedColumns: ["all"],
      photos: [],
    },
  })

  const { toast, handleToggleToast } = useHandleToast()

  const toastState = useMemo(() => {
    return { ...toast }
  }, [toast])

  const instance = useAxiosPrivate()

  const [selectedPhotos, setSelectedPhotos] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isProcessingPublicLink, setIsProcessingPublicLink] = useState(false)
  const [publicLinkId, setPublicLinkId] = useState("")

  const [watchKodePropar, watchSelectedColumns] = useWatch({
    control,
    name: ["kodePropar", "selectedColumns", "photos"],
  })

  const selectedKodeProparDebounce = useDebounce(watchKodePropar, 500)
  // eslint-disable-next-line no-unused-vars
  const selectedColumnsDebounce = useDebounce(watchSelectedColumns, 500)

  const { data } = usePrivateFetcher(
    [process.env.NEXT_PUBLIC_ENDPOINT_HOME_KODE_PROPAR_READ, {}],
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  const kodeProparOptions = useMemo(() => {
    const attributes = data?.data?.attributes ?? []

    if (attributes.length) {
      return attributes.map(({ kode_propar: kodePropar }) => ({
        value: kodePropar,
        label: kodePropar,
      }))
    }

    return attributes
  }, [data?.data?.attributes])

  const selectedColumnsObject = useMemo(() => {
    return columns.reduce((acc, curr) => {
      if (watchSelectedColumns[0] === "all") {
        acc[curr.value] = true
      } else {
        acc[curr.value] = watchSelectedColumns?.includes(curr.value)
      }

      return acc
    }, {})
  }, [watchSelectedColumns])

  const { datas } = useDatasFetcher(selectedKodeProparDebounce, "home")

  const dataGroups = datas.reduce((groups, item) => {
    const {
      kode_propar: kodePropar,
      photos,
      facilities_id: facilitiesIds,
      area_id: areaId,
      payment_term_id: paymentTermId,
    } = item

    if (!groups[kodePropar]) {
      groups[kodePropar] = {
        kodePropar: kodePropar,
        photos: [],
        facilitiesIds: [],
        areaId: null,
        paymentTermId: null,
      }
    }

    if (photos && Array.isArray(photos)) {
      groups[kodePropar].photos.push(
        ...photos.map((photo) => ({
          id: photo.id,
          url: photo.url,
        }))
      )
    }

    if (facilitiesIds && Array.isArray(facilitiesIds)) {
      groups[kodePropar].facilitiesIds.push(...facilitiesIds)
    }

    if (areaId) {
      groups[kodePropar].areaId = areaId
    }

    if (paymentTermId) {
      groups[kodePropar].paymentTermId = paymentTermId
    }

    return groups
  }, {})

  const handlePublicLink = async () => {
    handleToggleToast({
      open: true,
      message: "Wait while the data is being processed",
      variant: "info",
    })
    setIsSubmitted(true)
    const kodePropar = watchKodePropar[0].value
    const selectedGroup = dataGroups[kodePropar]

    let selectedColumns = watchSelectedColumns
    if (selectedColumns[0] === "all") {
      // If "all" is selected, include all columns except the first one ("all")
      selectedColumns = columns.slice(0).map((column) => column.value)
    }

    // Validation rules
    const requiredColumns = [
      "name",
      "available",
      "furnishing",
      "rental_price",
      "selling_price",
    ]

    // Check if all required columns are selected
    const missingColumns = requiredColumns.filter(
      (column) => !selectedColumns.includes(column)
    )

    if (missingColumns.length > 0) {
      handleToggleToast({
        open: true,
        message: `Missing columns: ${missingColumns.join(", ")}`,
        variant: "error",
      })
      return
    }

    const selectedPhotosIds = selectedPhotos.map((photo) => photo.photoId)

    const payload = {
      property_type: "Home",
      kode_propar: kodePropar,
      photos_id: selectedPhotosIds,
      area_id: selectedGroup.areaId,
      payment_term_id: selectedGroup.paymentTermId,
      selected_property_data: [...selectedColumns, "price_currency"],
    }

    if (selectedColumns.includes("facilities")) {
      payload.facilities_id = selectedGroup.facilitiesIds
      payload.selected_property_data = payload.selected_property_data.filter(
        (column) => column !== "facilities"
      )
    }

    const res = []

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_ENDPOINT_PROPERTY_PARTIALAN_PUBLIC_LINK}`
      const response = await instance.post(endpoint, payload)
      const responseData = response.data
      res.push(responseData)
      setPublicLinkId(responseData.attributes?.property_partialan_id)
      setIsProcessingPublicLink(true)
    } catch (error) {
      const errorResponse = error?.response?.data?.errors
      handleToggleToast({
        open: true,
        message: errorResponse
          ? Object.values(errorResponse).join(", ")
          : "Something went wrong!",
        variant: "error",
      })
      setIsSubmitted(false)
    }
    setPublicLinkId(res[0]?.data?.attributes?.property_partialan_id)
  }

  const handleExcel = async () => {
    handleToggleToast({
      open: true,
      message: "Wait while the file is being processed",
      variant: "info",
    })
    setIsSubmitted(true)
    const payload = []

    let hasMissingColumns = false

    watchKodePropar.forEach((option) => {
      const kodePropar = option.value
      const selectedGroup = dataGroups[kodePropar]

      let selectedColumns = watchSelectedColumns
      if (selectedColumns[0] === "all") {
        // If "all" is selected, include all columns except the first one ("all")
        selectedColumns = columns.slice(0).map((column) => column.value)
      }

      // Validation rules
      const requiredColumns = [
        "name",
        "available",
        "furnishing",
        "rental_price",
        "selling_price",
      ]

      // Check if all required columns are selected
      const missingColumns = requiredColumns.filter(
        (column) => !selectedColumns.includes(column)
      )

      if (missingColumns.length > 0) {
        handleToggleToast({
          open: true,
          message: `Missing columns: ${missingColumns.join(", ")}`,
          variant: "error",
        })
        hasMissingColumns = true
        return
      }

      const selectedPhotosIds = selectedPhotos
        .filter((photo) => photo.kodePropar === kodePropar)
        .map((photo) => photo.photoId)

      const payloadItem = {
        property_type: "Home",
        kode_propar: kodePropar,
        photos_id: selectedPhotosIds,
        area_id: selectedGroup.areaId,
        payment_term_id: selectedGroup.paymentTermId,
        selected_property_data: [...selectedColumns, "price_currency"],
      }

      if (selectedColumns.includes("facilities")) {
        payloadItem.facilities_id = selectedGroup.facilitiesIds
        payloadItem.selected_property_data =
          payloadItem.selected_property_data.filter(
            (column) => column !== "facilities"
          )
      }

      payload.push(payloadItem)
    })

    if (hasMissingColumns) {
      setIsSubmitted(false)
      return // Exit the function if there are missing columns
    }

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_ENDPOINT_PROPERTY_PARTIALAN_EXCEL_PDF}`
      const response = await instance.post(endpoint, payload)
      const responseData = response.data
      generateExcel(responseData, columns, instance, watchSelectedColumns)
      handleToggleToast({
        open: true,
        message: "File downloaded succesfully. Check the download folder",
        variant: "success",
      })
      setIsSubmitted(false)
    } catch (error) {
      const errorResponse = error?.response?.data?.errors
      handleToggleToast({
        open: true,
        message: errorResponse
          ? Object.values(errorResponse).join(", ")
          : "Something went wrong!",
        variant: "error",
      })
      setIsSubmitted(false)
    }
  }

  const handlePDF = async () => {
    handleToggleToast({
      open: true,
      message: "Wait while the file is being processed",
      variant: "info",
    })
    setIsSubmitted(true)
    const payload = []

    let hasMissingColumns = false

    watchKodePropar.forEach((option) => {
      const kodePropar = option.value
      const selectedGroup = dataGroups[kodePropar]

      let selectedColumns = watchSelectedColumns
      if (selectedColumns[0] === "all") {
        // If "all" is selected, include all columns except the first one ("all")
        selectedColumns = columns.slice(0).map((column) => column.value)
      }

      // Validation rules
      const requiredColumns = [
        "name",
        "available",
        "furnishing",
        "rental_price",
        "selling_price",
      ]

      // Check if all required columns are selected
      const missingColumns = requiredColumns.filter(
        (column) => !selectedColumns.includes(column)
      )

      if (missingColumns.length > 0) {
        handleToggleToast({
          open: true,
          message: `Missing columns: ${missingColumns.join(", ")}`,
          variant: "error",
        })
        hasMissingColumns = true
        return
      }

      const selectedPhotosIds = selectedPhotos
        .filter((photo) => photo.kodePropar === kodePropar)
        .map((photo) => photo.photoId)

      const payloadItem = {
        property_type: "Home",
        kode_propar: kodePropar,
        photos_id: selectedPhotosIds,
        area_id: selectedGroup.areaId,
        payment_term_id: selectedGroup.paymentTermId,
        selected_property_data: [...selectedColumns, "price_currency"],
      }

      if (selectedColumns.includes("facilities")) {
        payloadItem.facilities_id = selectedGroup.facilitiesIds
        payloadItem.selected_property_data =
          payloadItem.selected_property_data.filter(
            (column) => column !== "facilities"
          )
      }

      payload.push(payloadItem)
    })

    if (hasMissingColumns) {
      setIsSubmitted(false)
      return // Exit the function if there are missing columns
    }

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_ENDPOINT_PROPERTY_PARTIALAN_EXCEL_PDF}`
      const response = await instance.post(endpoint, payload)
      const responseData = response.data
      generatePDF(responseData, instance)
      handleToggleToast({
        open: true,
        message: "File downloaded succesfully. Check the download folder",
        variant: "success",
      })
      setIsSubmitted(false)
    } catch (error) {
      const errorResponse = error?.response?.data?.errors
      handleToggleToast({
        open: true,
        message: errorResponse
          ? Object.values(errorResponse).join(", ")
          : "Something went wrong!",
        variant: "error",
      })
      setIsSubmitted(false)
    }
  }

  return (
    <>
      <Head>
        <title>Home Management | Noble Asia Database Management System</title>
      </Head>
      <ToastProvider swipeDirection="right" duration={2000}>
        <HeaderPage>
          <div className="flex items-center gap-4">
            <Link href="/home-management">
              <MdArrowBack className="h-5 w-5" />
            </Link>
            <TitlePage>Property Particular</TitlePage>
          </div>
          <BreadcrumbsContainer>
            <BreadcrumbsItem href="/home-management" disabled>
              Home Management
            </BreadcrumbsItem>
          </BreadcrumbsContainer>
        </HeaderPage>

        {isProcessingPublicLink && (
          <PublicLinkDialog
            isProcessingPublicLink={isProcessingPublicLink}
            setIsProcessingPublicLink={setIsProcessingPublicLink}
            setPublicLinkId={setPublicLinkId}
            setIsSubmitted={setIsSubmitted}
            propertyPartialanId={publicLinkId}
          />
        )}

        <section className="flex flex-col rounded-md bg-white p-5">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">
              Property Particular Properties
            </h2>
            <h3 className="text-sm text-npa-info-400">
              Please pay attention to this section, before submitting.
            </h3>
          </div>

          <div className="flex flex-col gap-5 p-8">
            <div className="flex flex-col gap-2 lg:max-w-[350px]">
              <Controller
                control={control}
                name="kodePropar"
                render={({ field, formState: { isTouched, error } }) => (
                  <>
                    <Label htmlFor="kode-propar" className="font-medium">
                      Choose a kode propar
                    </Label>
                    <SelectSearchable
                      {...field}
                      isClearable
                      isMulti
                      isTouched={isTouched}
                      isError={error}
                      name="kodePropar"
                      id="kode-propar"
                      options={kodeProparOptions}
                      value={watchKodePropar}
                      placeholder="Choose a kode propar"
                      onValueChange={(value) => {
                        // Get the deselected kodePropar values
                        const deselectedKodePropar = value.map(
                          (option) => option.value
                        )

                        // Filter out the deselected photos from selectedPhotos
                        const updatedPhotos = selectedPhotos.filter((photo) => {
                          // Check if the photo's kodePropar is present in the deselectedKodePropar array
                          return deselectedKodePropar.includes(photo.kodePropar)
                        })

                        // Update the selected photos state
                        setSelectedPhotos(updatedPhotos)

                        // Update field value
                        field.onChange(value)
                      }}
                    />
                  </>
                )}
              />
            </div>

            {watchKodePropar.length > 0 && (
              <>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2 lg:max-w-[350px]">
                    <Controller
                      control={control}
                      name="selectedColumns"
                      render={({ field, formState: { isTouched, error } }) => (
                        <>
                          <Label
                            htmlFor="selected-columns"
                            className="font-medium"
                          >
                            Choose columns
                          </Label>
                          <SelectMultiple
                            {...field}
                            items={columns}
                            value={watchSelectedColumns}
                            id="selected-columns"
                            keyPrefix="home-management-show-column"
                            isTouched={isTouched}
                            isError={error}
                            onValueChange={field.onChange}
                            position="popper"
                            sideOffset={8}
                            defaultValue="all"
                            placeholder={
                              watchSelectedColumns[0] === "all"
                                ? "Currently selecting all columns"
                                : `Selecting ${watchSelectedColumns.length} columns`
                            }
                          />
                        </>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-medium">Selected columns:</h4>
                    <ul className="grid w-full list-inside list-disc grid-cols-2 gap-x-6 gap-y-2 overflow-x-auto sm:grid-cols-4 lg:w-max lg:grid-flow-col lg:grid-cols-5 lg:grid-rows-5 lg:gap-x-8">
                      <PropertyPartialanSelectedColumnItemsMemoize
                        selectedColumnsObject={selectedColumnsObject}
                        columns={columns}
                      />
                    </ul>
                  </div>
                </div>

                {watchKodePropar.map((kodePropar) => {
                  const dataGroup = dataGroups[kodePropar.value]

                  return (
                    <div className="flex flex-col gap-6" key={kodePropar.value}>
                      <h3 className="font-medium">
                        Choose Photos in {kodePropar.label}
                      </h3>

                      {!dataGroup && <Loader />}

                      {dataGroup &&
                      dataGroup.photos &&
                      dataGroup.photos.length === 0 ? (
                        <h3 className="w-max rounded-sm bg-npa-info-600/20 p-3 text-sm text-npa-info-800">
                          There are no available photos for {kodePropar.label}
                        </h3>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
                          {dataGroup?.photos.map((photo) => (
                            <div key={photo.id}>
                              <div className="flex flex-wrap gap-4">
                                <ImagePreviewAsync
                                  key={photo.id}
                                  id={photo.id}
                                  photo_url={photo.url}
                                  onValueChange={(value, image) => {
                                    if (!value) {
                                      setSelectedPhotos((prevPhotos) =>
                                        prevPhotos.filter(
                                          (photo) => photo.photoId !== image.id
                                        )
                                      )
                                    } else {
                                      // Check if the photo already exists in selectedPhotos
                                      const photoExists = selectedPhotos.some(
                                        (photo) => photo.photoId === image.id
                                      )

                                      if (!photoExists) {
                                        setSelectedPhotos((prevPhotos) => [
                                          ...prevPhotos,
                                          {
                                            kodePropar: kodePropar.label,
                                            photoId: image.id,
                                          },
                                        ])
                                      }
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </>
            )}
          </div>

          {watchKodePropar.length > 0 && (
            <div className="flex place-items-end items-center justify-end gap-2">
              <Button
                isFullWidth={false}
                variant="custom"
                className="flex items-center justify-center gap-2 rounded-lg bg-npa-success-400 px-4 py-3 text-sm font-medium text-white transition-all duration-300 focus:ring-[3px] lg:text-base"
                onClick={handleExcel}
              >
                Export as Excel
              </Button>
              <Button
                isFullWidth={false}
                variant="custom"
                className="flex items-center justify-center gap-2 rounded-lg bg-npa-charcoal-400 px-4 py-3 text-sm font-medium text-white transition-all duration-300 focus:ring-[3px] lg:text-base"
                onClick={handlePDF}
              >
                Export as PDF
              </Button>
              <Button
                isFullWidth={false}
                variant="custom"
                className={`flex items-center justify-center gap-2 rounded-lg bg-npa-info-400 px-4 py-3 text-sm font-medium text-white transition-all duration-300 focus:ring-[3px] lg:text-base ${
                  watchKodePropar.length >= 2 &&
                  "cursor-not-allowed bg-npa-info-400/50"
                }`}
                disabled={watchKodePropar.length >= 2}
                onClick={handlePublicLink}
              >
                Create a Public Link
              </Button>
            </div>
          )}
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
      columns: [
        { id: "name", value: "name", label: "Name" },
        { id: "address", value: "address", label: "Address" },
        { id: "landSize", value: "land_size", label: "Land Size" },
        { id: "buildingSize", value: "building_size", label: "Building Size" },
        { id: "stories", value: "stories", label: "Stories" },
        { id: "furnishing", value: "furnishing", label: "Furnishing" },
        { id: "bedroom", value: "bedroom", label: "Bedroom" },
        { id: "bathroom", value: "bathroom", label: "Bathroom" },
        { id: "studyRoom", value: "study_room", label: "Study Room" },
        {
          id: "carportOrGarage",
          value: "carport_or_garage",
          label: "Carport / Garage",
        },
        { id: "backyard", value: "backyard", label: "Backyard" },
        { id: "swimmingPool", value: "swimming_pool", label: "Swimming Pool" },
        { id: "houseType", value: "house_type", label: "House Type" },
        { id: "availability", value: "available", label: "Availability" },
        { id: "rentalPrice", value: "rental_price", label: "Rental Price" },
        { id: "sellingPrice", value: "selling_price", label: "Selling Price" },
        { id: "compoundFee", value: "compound_fee", label: "Compound Fee" },
        {
          id: "compoundFeeCoverage",
          value: "compound_fee_coverage",
          label: "Compound Fee Coverage",
        },
        { id: "leaseTerms", value: "lease_term_details", label: "Lease Terms" },
        { id: "vatDetails", value: "vat_details", label: "VAT Details" },
        { id: "whtDetails", value: "wht_details", label: "WHT Details" },
        { id: "facilities", value: "facilities", label: "Facilities" },
        { id: "remarks1", value: "remarks_1", label: "Remarks 1" },
        { id: "remarks2", value: "remarks_2", label: "Remarks 2" },
        { id: "remarks3", value: "remarks_3", label: "Remarks 3" },
      ],
    },
  }
}

PropertyPartialan.getLayout = getAdminLayout

export default PropertyPartialan
