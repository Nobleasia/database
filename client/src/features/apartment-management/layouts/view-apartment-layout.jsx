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

import { useFetchBlob } from "@/hooks"

import {
  BreadcrumbsContainer,
  BreadcrumbsItem,
  Button,
  HeaderPage,
  Loader,
  TitlePage,
} from "@/components"

import { convertNumberToPriceFormat } from "@/utils"

import { ViewApartmentImageDialogTrigger } from "../components"
import { ViewApartmentDataProvider } from "../context"
import { useViewApartmentData } from "../hooks"

const tabsDetails = [
  {
    title: "Specification and Terms",
    value: "specification-and-terms",
    href: "specification-and-terms",
  },
  {
    title: "Facility",
    value: "facility",
    href: "facility",
  },
  {
    title: "PIC Information",
    value: "pic-information",
    href: "pic-information",
  },
]

export const ViewApartmentLayout = ({ children }) => {
  const { query } = useRouter()
  const { apartmentAttributes, apartmentDataIsLoading } = useViewApartmentData()
  const fetchBlob = useFetchBlob()

  const [currentTabDetail, setCurrentTabDetail] = useState(tabsDetails[0])
  const [imagesBlobUrl, setImagesBlobUrl] = useState([])
  const [imagesAreLoading, setImagesAreLoading] = useState(false)
  const [currentPhotoId, setCurrentPhotoId] = useState(null)
  const [isViewApartmentImageDialogOpen, setIsViewApartmentImageDialogOpen] =
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
          apartmentAttributes?.photos?.map(async (photo) => {
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

    if (apartmentAttributes?.photos?.length >= 1) {
      getImagesBlobUrl()
    }
  }, [apartmentAttributes])

  return (
    <>
      <Head>
        <title>
          {query.slug} - Apartment Property View | Noble Property Asia Database
          Management System
        </title>
      </Head>
      <HeaderPage>
        <div className="flex items-center gap-4">
          <Link href="/apartment-management">
            <MdArrowBack className="h-5 w-5" />
          </Link>
          <TitlePage>View Apartment</TitlePage>
        </div>

        <BreadcrumbsContainer>
          <BreadcrumbsItem href="/apartment-management">
            Apartment Management
          </BreadcrumbsItem>
          <BreadcrumbsItem href="/apartment-management" disabled>
            View
          </BreadcrumbsItem>
          <BreadcrumbsItem href="/apartment-management" disabled>
            {query.slug}
          </BreadcrumbsItem>
        </BreadcrumbsContainer>
      </HeaderPage>

      <div className="flex flex-col gap-5 rounded-md bg-white p-4 md:p-8 xl:px-12">
        {(apartmentDataIsLoading ||
          Object.keys(apartmentAttributes).length < 1) && (
          <div className="flex h-[50vh] w-full items-center justify-center">
            <Loader />
          </div>
        )}

        {!apartmentDataIsLoading &&
          Object.keys(apartmentAttributes).length >= 1 && (
            <>
              <h1 className="text-2xl font-bold">
                {apartmentAttributes.name || "-"}
              </h1>
              <section className="flex h-max items-center justify-center">
                {imagesAreLoading ? (
                  <div className="flex h-[50vh] w-full items-center justify-center">
                    <Loader />
                  </div>
                ) : imagesBlobUrl.length === 0 ? (
                  <div className="flex h-[50vh] w-full items-center justify-center">
                    No Photos for this property
                  </div>
                ) : (
                  <DialogRadix.Root open={isViewApartmentImageDialogOpen}>
                    <div className="grid w-full grid-rows-[max-content_max-content] gap-4 2xl:grid-cols-[4fr_1fr] 2xl:grid-rows-1">
                      {imagesBlobUrl.length > 0 && (
                        <ViewApartmentImageDialogTrigger
                          onClick={() => {
                            setIsViewApartmentImageDialogOpen(true)
                            setCurrentPhotoId(imagesBlobUrl[0].id)
                            setCurrentPhotoIndex(0)
                          }}
                        >
                          <figure className="relative h-[350px] w-full overflow-hidden rounded-md">
                            <Image
                              src={imagesBlobUrl[0].blobUrl || ""}
                              alt="View Apartment Image Preview"
                              className="h-full w-full overflow-hidden bg-cover object-cover"
                              fill
                            />
                          </figure>
                        </ViewApartmentImageDialogTrigger>
                      )}

                      <div className="grid auto-cols-fr grid-flow-col gap-4 2xl:grid-flow-row 2xl:auto-rows-fr">
                        {imagesBlobUrl.slice(1, 4).map(({ id, blobUrl }) => (
                          <ViewApartmentImageDialogTrigger
                            key={`view-apartment-image-dialog-trigger-${id}`}
                            onClick={() => {
                              setIsViewApartmentImageDialogOpen(true)
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
                                alt="View Apartment Image Preview"
                                className="h-full w-full overflow-hidden bg-cover object-cover"
                                fill
                              />
                            </figure>
                          </ViewApartmentImageDialogTrigger>
                        ))}
                      </div>
                    </div>

                    <DialogRadix.Portal>
                      <DialogRadix.Overlay
                        className="fixed inset-0 z-20 bg-black/80 backdrop-blur-[2px]"
                        onClick={() => setIsViewApartmentImageDialogOpen(false)}
                      />
                      <DialogRadix.Content className="fixed top-1/2 left-1/2 z-50 grid min-h-screen w-full max-w-[90%] -translate-y-1/2 -translate-x-1/2 grid-cols-1 grid-rows-[0.5fr_max-content] content-center items-center justify-center gap-2 overflow-y-auto p-2 md:grid-rows-[max-content_max-content] md:gap-8 lg:grid-rows-[max-content_max-content] xl:max-w-[70%] xl:grid-rows-[1fr_max_content] xl:gap-4">
                        <div className="mt-12 grid grid-rows-[max-content_1fr] gap-3 md:mt-0">
                          <Button
                            variant="custom"
                            className="flex w-full justify-center py-2 text-npa-neutral-25 brightness-75 hover:brightness-100"
                            onClick={() =>
                              setIsViewApartmentImageDialogOpen(false)
                            }
                          >
                            <MdClose className="h-8 w-8" />
                          </Button>

                          <figure className="relative h-60 w-full overflow-hidden rounded-md sm:h-72 md:h-80 lg:h-96 xl:h-[364px] 2xl:h-[512px]">
                            <Image
                              src={currentPhotoBlobUrl?.blobUrl}
                              alt="View Apartment Image Preview"
                              className="h-full w-full overflow-hidden rounded-md bg-no-repeat object-contain md:bg-cover"
                              fill
                            />

                            <Button
                              variant="custom"
                              className="absolute top-0 bottom-0 left-0 text-npa-neutral-25 duration-200 hover:bg-npa-neutral-900/40"
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
                              <MdKeyboardArrowLeft className="h-12 w-12" />
                            </Button>
                            <Button
                              variant="custom"
                              className="absolute top-0 bottom-0 right-0 text-npa-neutral-25 duration-200 hover:bg-npa-neutral-900/40"
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
                              <MdKeyboardArrowRight className="h-12 w-12" />
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
                                  alt="View Apartment Image Preview"
                                  className="h-full w-full rounded-md object-cover"
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
                <section className="flex h-max flex-col items-center gap-2 rounded-md border-1 border-npa-neutral-200 p-6 shadow-sm lg:order-last">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <h2 className="text-2xl font-semibold text-npa-info-400">
                      {apartmentAttributes.selling_price !== 0
                        ? convertNumberToPriceFormat(
                            apartmentAttributes.selling_price,
                            apartmentAttributes.price_currency
                          )
                        : `${convertNumberToPriceFormat(
                            apartmentAttributes.rental_price,
                            apartmentAttributes.price_currency
                          )} /mo`}
                    </h2>
                    <p className="font-medium md:w-10/12 md:text-sm lg:text-base">
                      {apartmentAttributes.address || "-"}
                    </p>
                  </div>

                  <section className="border-top-1 my-6 flex w-full items-center justify-center gap-2 border-b-1 border-t-1 border-npa-neutral-300 py-6 md:flex-col xl:flex-row">
                    <span
                      className={`flex items-center justify-center rounded-md  py-1 px-3  ${
                        apartmentAttributes.available === "Yes"
                          ? "bg-npa-success-600/30 text-npa-success-900"
                          : "bg-npa-error-600/30 text-npa-error-900"
                      }`}
                    >
                      {(apartmentAttributes.available === "Yes"
                        ? "Available"
                        : "Not Available") || "-"}
                    </span>
                    <span className="flex items-center justify-center rounded-md bg-npa-info-600/30 py-1 px-3 text-npa-info-800">
                      {apartmentAttributes.furnishing || "-"}
                    </span>
                  </section>

                  <section className="flex w-2/3 flex-col items-center gap-4 lg:items-start ">
                    <h3 className="text-lg font-semibold">
                      Pricing Information
                    </h3>

                    <div className="flex flex-col gap-3 text-center lg:text-start">
                      <div className="flex flex-col gap-1">
                        <h4 className="font-medium text-npa-neutral-500">
                          Sell Price
                        </h4>
                        <p className="font-medium">
                          {apartmentAttributes.convertedPrices.sellingPrice}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 text-center lg:text-start">
                        <h4 className="font-medium text-npa-neutral-500">
                          Rental Price
                        </h4>
                        <p className="font-medium">
                          {apartmentAttributes.convertedPrices.rentalPrice} /mo
                        </p>
                      </div>
                    </div>
                  </section>
                </section>

                <section className="flex flex-col gap-6 overflow-x-hidden">
                  <div className="flex items-center gap-4 overflow-x-auto py-4 scrollbar-thin scrollbar-track-npa-neutral-200 scrollbar-thumb-npa-neutral-400/60 scrollbar-thumb-rounded-lg lg:gap-8 xl:gap-12">
                    {tabsDetails.map(({ value, title, href }) => (
                      <Link
                        href={`/apartment-management/view/${query.slug}/${href}`}
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
    </>
  )
}

export const getViewApartmentLayoutProps = (page) =>
  getAdminLayout(
    <ViewApartmentDataProvider>
      <ViewApartmentLayout>{page}</ViewApartmentLayout>
    </ViewApartmentDataProvider>
  )
