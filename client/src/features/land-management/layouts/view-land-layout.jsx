/* eslint-disable no-nested-ternary */
import * as DialogRadix from "@radix-ui/react-dialog"
import cn from "classnames"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import {
  MdArrowBack,
  MdClose,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md"

import { getAdminLayout } from "@/layouts"

import { useAxiosPrivate, useFetchBlob, useHandleToast } from "@/hooks"

import {
  BreadcrumbsContainer,
  BreadcrumbsItem,
  Button,
  HeaderPage,
  Loader,
  TitlePage,
  Toast,
  ToastProvider,
  ToastViewport,
} from "@/components"

import { ViewLandImageDialogTrigger } from "../components"
import { ViewLandDataProvider } from "../context"
import { useViewLandData } from "../hooks"
import { generatePDF } from "../libs"

const tabsDetails = [
  {
    title: "Specification and Terms",
    value: "specification-and-terms",
    href: "specification-and-terms",
  },
  {
    title: "PIC Information",
    value: "pic-information",
    href: "pic-information",
  },
]

export const ViewLandLayout = ({ children }) => {
  const { query, back } = useRouter()
  const [isSubmitted, setIsSubmitted] = useState()
  const { landAttributes, landDataIsLoading } = useViewLandData()
  const fetchBlob = useFetchBlob()
  const { toast, handleToggleToast } = useHandleToast()

  const toastState = useMemo(() => {
    return { ...toast }
  }, [toast])

  const instance = useAxiosPrivate()

  const [currentTabDetail, setCurrentTabDetail] = useState(tabsDetails[0])
  const [imagesBlobUrl, setImagesBlobUrl] = useState([])
  const [imagesAreLoading, setImagesAreLoading] = useState(false)
  const [currentPhotoId, setCurrentPhotoId] = useState(null)
  const [isViewLandImageDialogOpen, setIsViewLandImageDialogOpen] =
    useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const activeTab = useMemo(() => {
    return tabsDetails.find((tab) => tab.value === currentTabDetail.value)
  }, [currentTabDetail])

  const currentPhotoBlobUrl = useMemo(() => {
    return imagesBlobUrl.find((imageBlobUrl) => {
      return imageBlobUrl.id === currentPhotoId
    })
  }, [currentPhotoId, currentPhotoIndex])

  useEffect(() => {
    const getImagesBlobUrl = async () => {
      try {
        setImagesAreLoading(true)
        const imagesBlobUrlData = Promise.all(
          landAttributes?.photos?.map(async (photo) => {
            const response = await fetchBlob(photo.photo_url)
            const blobUrl = URL.createObjectURL(response)
            return { blobUrl, ...photo }
          })
        )
        const response = await imagesBlobUrlData
        setImagesBlobUrl(response)
        setImagesAreLoading(false)
      } catch (error) {
        console.error(error)
        setImagesAreLoading(false)
      }
    }

    if (landAttributes?.photos?.length >= 1) {
      getImagesBlobUrl()
    }
  }, [landAttributes])

  const handlePDF = async () => {
    setIsSubmitted(true)
    handleToggleToast({
      open: true,
      message: "Preparing PDF...",
      variant: "info",
    })

    const payload = []

    const payloadItem = {
      property_type: "Land",
      kode_propar: landAttributes.kode_propar,
      photos_id: landAttributes.photos.map((photo) => photo.id) || [],
      area_id: landAttributes.property_area.id,
      payment_term_id: landAttributes.property_payment_term.id,
      selected_property_data: [
        "address",
        "land_size",
        "ownership",
        "available",
        "zone",
        "surroundings",
        "price",
        "lease_term_details",
        "vat_details",
        "wht_details",
        "remarks_1",
        "remarks_2",
        "remarks_3",
        "price_currency",
      ],
    }

    payload.push(payloadItem)
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_ENDPOINT_PROPERTY_PARTIALAN_EXCEL_PDF}`
      const response = await instance.post(endpoint, payload)
      const responseData = response.data
      generatePDF(responseData, instance)
      handleToggleToast({
        open: true,
        message: "PDF generated successfully.",
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
        <title>
          {query.slug} - Land Property View | Noble Property Asia Database
          Management System
        </title>
      </Head>
      <ToastProvider>
        <HeaderPage>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                back()
              }}
            >
              <MdArrowBack className="w-5 h-5" />
            </button>
            <TitlePage>View Land</TitlePage>
          </div>

          <BreadcrumbsContainer>
            <BreadcrumbsItem href="/land-management" disabled>
              Land Management
            </BreadcrumbsItem>
            <BreadcrumbsItem href="/land-management" disabled>
              View
            </BreadcrumbsItem>
            <BreadcrumbsItem href="/land-management" disabled>
              {query.slug}
            </BreadcrumbsItem>
          </BreadcrumbsContainer>
        </HeaderPage>
        <div className="flex flex-col gap-5 p-4 bg-white rounded-md md:p-8 xl:px-12">
          {(landDataIsLoading || Object.keys(landAttributes).length < 1) && (
            <div className="flex h-[50vh] w-full items-center justify-center">
              <Loader />
            </div>
          )}

          {!landDataIsLoading && Object.keys(landAttributes).length >= 1 && (
            <>
              <div className="flex flex-row items-center justify-end w-full">
                <Button
                  isFullWidth={false}
                  variant="custom"
                  className="flex items-center justify-center gap-2 rounded-lg bg-npa-charcoal-400 px-4 py-3 text-sm font-medium text-white transition-all duration-300 focus:ring-[3px] lg:text-base"
                  onClick={handlePDF}
                >
                  Export as PDF
                </Button>
              </div>
              <section className="flex items-center justify-center h-max">
                {imagesAreLoading ? (
                  <div className="flex h-[50vh] w-full items-center justify-center">
                    <Loader />
                  </div>
                ) : imagesBlobUrl.length === 0 ? (
                  <div className="flex h-[50vh] w-full items-center justify-center">
                    No Photos for this property
                  </div>
                ) : (
                  <DialogRadix.Root open={isViewLandImageDialogOpen}>
                    <div className="grid w-full grid-rows-[max-content_max-content] gap-4 2xl:grid-cols-[4fr_1fr] 2xl:grid-rows-1">
                      {imagesBlobUrl.length > 0 && (
                        <ViewLandImageDialogTrigger
                          onClick={() => {
                            setIsViewLandImageDialogOpen(true)
                            setCurrentPhotoId(imagesBlobUrl[0].id)
                            setCurrentPhotoIndex(0)
                          }}
                        >
                          <figure className="relative h-[350px] w-full overflow-hidden rounded-md">
                            <Image
                              src={imagesBlobUrl[0].blobUrl || ""}
                              alt="View Land Image Preview"
                              className="object-cover w-full h-full overflow-hidden bg-cover"
                              fill
                            />
                          </figure>
                        </ViewLandImageDialogTrigger>
                      )}

                      <div className="grid grid-flow-col gap-4 auto-cols-fr 2xl:grid-flow-row 2xl:auto-rows-fr">
                        {imagesBlobUrl.slice(1, 4).map(({ id, blobUrl }) => (
                          <ViewLandImageDialogTrigger
                            key={`view-apartment-image-dialog-trigger-${id}`}
                            onClick={() => {
                              setIsViewLandImageDialogOpen(true)
                              setCurrentPhotoId(id)
                              setCurrentPhotoIndex(
                                imagesBlobUrl.findIndex(
                                  (imageBlobUrl) => imageBlobUrl.id === id
                                )
                              )
                            }}
                          >
                            <figure className="relative h-[106px] w-full overflow-hidden rounded-md">
                              <Image
                                src={blobUrl}
                                alt="View Land Image Preview"
                                className="object-cover w-full h-full overflow-hidden bg-cover"
                                fill
                              />
                            </figure>
                          </ViewLandImageDialogTrigger>
                        ))}
                      </div>
                    </div>

                    <DialogRadix.Portal>
                      <DialogRadix.Overlay
                        className="fixed inset-0 z-20 bg-black/80 backdrop-blur-[2px]"
                        onClick={() => setIsViewLandImageDialogOpen(false)}
                      />
                      <DialogRadix.Content className="fixed top-1/2 left-1/2 z-50 grid min-h-screen w-full max-w-[90%] -translate-y-1/2 -translate-x-1/2 grid-cols-1 grid-rows-[0.5fr_max-content] content-center items-center justify-center gap-2 overflow-y-auto p-2 md:grid-rows-[max-content_max-content] md:gap-8 lg:grid-rows-[max-content_max-content] xl:max-w-[70%] xl:grid-rows-[1fr_max_content] xl:gap-4">
                        <div className="mt-12 grid grid-rows-[max-content_1fr] gap-3 md:mt-0">
                          <Button
                            variant="custom"
                            className="flex justify-center w-full py-2 text-npa-neutral-25 brightness-75 hover:brightness-100"
                            onClick={() => setIsViewLandImageDialogOpen(false)}
                          >
                            <MdClose className="w-8 h-8" />
                          </Button>

                          <figure className="relative h-60 w-full overflow-hidden rounded-md sm:h-72 md:h-80 lg:h-96 xl:h-[364px] 2xl:h-[512px]">
                            <Image
                              src={currentPhotoBlobUrl?.blobUrl}
                              alt="View Land Image Preview"
                              className="object-contain w-full h-full overflow-hidden bg-no-repeat rounded-md md:bg-cover"
                              fill
                            />

                            <Button
                              variant="custom"
                              className="absolute top-0 bottom-0 left-0 duration-200 text-npa-neutral-25 hover:bg-npa-neutral-900/40"
                              onClick={() => {
                                if (currentPhotoIndex > 0) {
                                  setCurrentPhotoId(
                                    imagesBlobUrl[currentPhotoIndex - 1]?.id
                                  )
                                  setCurrentPhotoIndex(
                                    (prevValue) => prevValue - 1
                                  )
                                } else {
                                  setCurrentPhotoId(
                                    imagesBlobUrl[imagesBlobUrl.length - 1].id
                                  )
                                  setCurrentPhotoIndex(imagesBlobUrl.length - 1)
                                }
                              }}
                            >
                              <MdKeyboardArrowLeft className="w-12 h-12" />
                            </Button>
                            <Button
                              variant="custom"
                              className="absolute top-0 bottom-0 right-0 duration-200 text-npa-neutral-25 hover:bg-npa-neutral-900/40"
                              onClick={() => {
                                if (
                                  currentPhotoIndex <
                                  imagesBlobUrl.length - 1
                                ) {
                                  setCurrentPhotoId(
                                    imagesBlobUrl[currentPhotoIndex + 1]?.id
                                  )
                                  setCurrentPhotoIndex(
                                    (prevValue) => prevValue + 1
                                  )
                                } else {
                                  setCurrentPhotoId(imagesBlobUrl[0].id)
                                  setCurrentPhotoIndex(0)
                                }
                              }}
                            >
                              <MdKeyboardArrowRight className="w-12 h-12" />
                            </Button>
                          </figure>
                        </div>
                        <div className="mx-auto flex h-5/6 flex-wrap justify-center gap-4 overflow-y-auto py-4 md:gap-8 lg:h-max lg:max-w-[80%] lg:gap-5">
                          {imagesBlobUrl.length > 0 &&
                            imagesBlobUrl.map(({ id, blobUrl }) => (
                              <div
                                key={`image-preview-control-${id}`}
                                className={cn(
                                  "relative flex h-14 w-32 cursor-pointer overflow-hidden md:h-16 md:w-36",
                                  {
                                    "brightness-50": id !== currentPhotoId,
                                  }
                                )}
                              >
                                <Image
                                  src={blobUrl}
                                  alt="View Land Image Preview"
                                  className="object-cover w-full h-full rounded-md"
                                  onClick={() => setCurrentPhotoId(id)}
                                  fill
                                />
                              </div>
                            ))}
                        </div>
                      </DialogRadix.Content>
                    </DialogRadix.Portal>
                  </DialogRadix.Root>
                )}
              </section>

              <div className="grid grid-rows-[max-content_max-content] gap-5 lg:grid-cols-2 lg:grid-rows-none lg:gap-8 xl:grid-cols-[1.5fr_1fr] 2xl:grid-cols-[2fr_1fr]">
                <section className="flex flex-col items-center gap-2 p-6 rounded-md shadow-sm h-max border-1 border-npa-neutral-200 lg:order-last">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <h2 className="text-2xl font-semibold text-npa-info-400">
                      {landAttributes.convertedPrices.price} /sqm
                    </h2>
                    <p className="font-medium md:w-10/12 md:text-sm lg:text-base">
                      {landAttributes.address || "-"}
                    </p>
                  </div>

                  <section className="flex items-center justify-center w-full gap-2 py-6 my-6 border-top-1 border-b-1 border-t-1 border-npa-neutral-300 md:flex-col xl:flex-row">
                    <span
                      className={`flex items-center justify-center rounded-md  py-1 px-3  ${
                        landAttributes.available === "Yes"
                          ? "bg-npa-success-600/30 text-npa-success-900"
                          : "bg-npa-error-600/30 text-npa-error-900"
                      }`}
                    >
                      {(landAttributes.available === "Yes"
                        ? "Available"
                        : "Not Available") || "-"}
                    </span>
                  </section>
                </section>

                <section className="flex flex-col gap-6 overflow-x-hidden">
                  <div className="flex items-center gap-4 py-4 overflow-x-auto scrollbar-thin scrollbar-track-npa-neutral-200 scrollbar-thumb-npa-neutral-400/60 scrollbar-thumb-rounded-lg lg:gap-8 xl:gap-12">
                    {tabsDetails.map(({ value, title, href }) => (
                      <Link
                        href={`/land-management/view/${query.slug}/${href}`}
                        key={`tab-detail-${value}`}
                        className={cn("whitespace-nowrap font-medium", {
                          "text-npa-neutral-400": value !== activeTab.value,
                          "text-npa-primary-900": value === activeTab.value,
                        })}
                        onClick={() => {
                          setCurrentTabDetail((prevValue) => ({
                            ...prevValue,
                            value,
                            title,
                            href,
                          }))
                        }}
                      >
                        <span className="p-2">{title}</span>
                        <hr
                          className={cn("h-1 rounded-md bg-npa-info-500", {
                            visible: value === activeTab.value,
                            invisible: value !== activeTab.value,
                          })}
                        />
                      </Link>
                    ))}
                  </div>

                  <div className="pb-20">{children}</div>
                </section>
              </div>
            </>
          )}
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

export const getViewLandLayoutProps = (page) =>
  getAdminLayout(
    <ViewLandDataProvider>
      <ViewLandLayout>{page}</ViewLandLayout>
    </ViewLandDataProvider>
  )
