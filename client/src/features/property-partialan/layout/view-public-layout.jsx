// eslint-disable react/no-children-prop
import * as DialogRadix from "@radix-ui/react-dialog"
import axios from "axios"
import cn from "classnames"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import {
  MdClose,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md"

import { Button, HeaderPage, Loader, TitlePage } from "@/components"

import { ViewPublicImageDialogTrigger } from "../components"
import { ViewPublicDataProvider } from "../context"
import { useViewPublicData } from "../hooks"
import { ApartmentDetail } from "./apartment-detail-layout"
import { HomeDetail } from "./home-detail-layout"
import { LandDetail } from "./land-detail-layout"
import { OfficeDetail } from "./office-detail-layout"

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
]

export const ViewPublicLayout = ({ children }) => {
  const { query } = useRouter()
  const { publicAttributes, publicDataIsLoading } = useViewPublicData()
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  })

  const [currentTabDetail, setCurrentTabDetail] = useState(tabsDetails[0])
  const [imagesBlobUrl, setImagesBlobUrl] = useState([])
  const [currentPhotoId, setCurrentPhotoId] = useState(null)
  const [isViewPublicImageDialogOpen, setIsViewPublicImageDialogOpen] =
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
        const imagesBlobUrlData = Promise.all(
          publicAttributes?.photos?.map(async (photo) => {
            const { data } = await instance.get(photo.photo_url, {
              responseType: "blob",
            })
            const blobUrl = URL.createObjectURL(data)
            return { blobUrl, ...photo }
          })
        )
        const response = await imagesBlobUrlData
        setImagesBlobUrl(response)
      } catch (error) {
        console.error(error)
      }
    }

    if (publicAttributes?.photos?.length >= 1) {
      getImagesBlobUrl()
    }
  }, [publicAttributes])

  return (
    <div className="flex h-screen w-full flex-col overflow-y-scroll">
      <Head>
        <title>
          Public View | Noble Property Asia Database Management System
        </title>
      </Head>
      <HeaderPage>
        <div className="flex w-full px-2 lg:px-16">
          <div className="mb-8 flex w-full items-center justify-between gap-4 rounded-b-md bg-white px-6">
            <div className="flex w-full items-center gap-3">
              <picture className="relative min-h-[6rem] min-w-[40%] overflow-hidden md:min-w-[10%]">
                <Image
                  src="/images/npa-logo-full.jpg"
                  alt="NPA Logo"
                  placeholder="blur"
                  blurDataURL="/images/npa-logo-full.jpg"
                  sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                  className="bg-cover object-contain"
                  fill
                  priority
                />
              </picture>
              <h3 className="text-xs lg:text-sm">
                Type of property: {publicAttributes.property_type}
              </h3>
            </div>

            <TitlePage className="text-md">
              {publicAttributes.kode_propar}
            </TitlePage>
          </div>
        </div>
      </HeaderPage>
      <div className="flex px-2 lg:px-16">
        <div className="flex w-full flex-col gap-5 rounded-md bg-white p-4 md:p-8 xl:px-12">
          {(publicDataIsLoading ||
            Object.keys(publicAttributes).length < 1) && (
            <div className="flex h-[50vh] w-full items-center justify-center">
              <Loader />
            </div>
          )}

          {!publicDataIsLoading &&
            Object.keys(publicAttributes).length >= 1 && (
              <>
                <h1 className="text-2xl font-bold">{publicAttributes.name}</h1>
                <section className="flex h-max items-center justify-center">
                  {imagesBlobUrl.length === 0 && (
                    <div className="flex h-36 w-full items-center justify-center">
                      <Loader />
                    </div>
                  )}

                  <DialogRadix.Root open={isViewPublicImageDialogOpen}>
                    <div className="grid w-full grid-rows-[max-content_max-content] gap-4 2xl:grid-cols-[4fr_1fr] 2xl:grid-rows-1">
                      {imagesBlobUrl.length > 0 && (
                        <ViewPublicImageDialogTrigger
                          onClick={() => {
                            setIsViewPublicImageDialogOpen(true)
                            setCurrentPhotoId(imagesBlobUrl[0].id)
                            setCurrentPhotoIndex(0)
                          }}
                        >
                          <figure className="relative h-[350px] w-full overflow-hidden rounded-md">
                            <Image
                              src={imagesBlobUrl[0].blobUrl || ""}
                              alt="View Public Image Preview"
                              className="h-full w-full overflow-hidden bg-cover object-cover"
                              fill
                            />
                          </figure>
                        </ViewPublicImageDialogTrigger>
                      )}

                      <div className="grid auto-cols-fr grid-flow-col gap-4 2xl:grid-flow-row 2xl:auto-rows-fr">
                        {imagesBlobUrl.slice(1, 4).map(({ id, blobUrl }) => (
                          <ViewPublicImageDialogTrigger
                            key={`view-public-image-dialog-trigger-${id}`}
                            onClick={() => {
                              setIsViewPublicImageDialogOpen(true)
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
                                alt="View Public Image Preview"
                                className="h-full w-full overflow-hidden bg-cover object-cover"
                                fill
                              />
                            </figure>
                          </ViewPublicImageDialogTrigger>
                        ))}
                      </div>
                    </div>

                    <DialogRadix.Portal>
                      <DialogRadix.Overlay
                        className="fixed inset-0 z-20 bg-black/80 backdrop-blur-[2px]"
                        onClick={() => setIsViewPublicImageDialogOpen(false)}
                      />
                      <DialogRadix.Content className="fixed top-1/2 left-1/2 z-50 grid min-h-screen w-full max-w-[90%] -translate-y-1/2 -translate-x-1/2 grid-cols-1 grid-rows-[0.5fr_max-content] content-center items-center justify-center gap-2 overflow-y-auto p-2 md:grid-rows-[max-content_max-content] md:gap-8 lg:grid-rows-[max-content_max-content] xl:max-w-[70%] xl:grid-rows-[1fr_max_content] xl:gap-4">
                        <div className="mt-12 grid grid-rows-[max-content_1fr] gap-3 md:mt-0">
                          <Button
                            variant="custom"
                            className="flex w-full justify-center py-2 text-npa-neutral-25 brightness-75 hover:brightness-100"
                            onClick={() =>
                              setIsViewPublicImageDialogOpen(false)
                            }
                          >
                            <MdClose className="h-8 w-8" />
                          </Button>

                          <figure className="relative h-60 w-full overflow-hidden rounded-md sm:h-72 md:h-80 lg:h-96 xl:h-[364px] 2xl:h-[512px]">
                            <Image
                              src={currentPhotoBlobUrl?.blobUrl}
                              alt="View Public Image Preview"
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
                                  alt="View Public Image Preview"
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
                </section>

                {publicAttributes.property_type === "Apartment" && (
                  <ApartmentDetail
                    publicAttributes={publicAttributes}
                    activeTab={activeTab}
                    tabsDetails={tabsDetails}
                    setCurrentTabDetail={setCurrentTabDetail}
                    query={query}
                  >
                    {children}
                  </ApartmentDetail>
                )}
                {publicAttributes.property_type === "Home" && (
                  <HomeDetail
                    publicAttributes={publicAttributes}
                    activeTab={activeTab}
                    tabsDetails={tabsDetails}
                    setCurrentTabDetail={setCurrentTabDetail}
                    query={query}
                  >
                    {children}
                  </HomeDetail>
                )}
                {publicAttributes.property_type === "Office" && (
                  <OfficeDetail
                    publicAttributes={publicAttributes}
                    activeTab={activeTab}
                    tabsDetails={tabsDetails}
                    setCurrentTabDetail={setCurrentTabDetail}
                    query={query}
                  >
                    {children}
                  </OfficeDetail>
                )}
                {publicAttributes.property_type === "Land" && (
                  <LandDetail
                    publicAttributes={publicAttributes}
                    activeTab={activeTab}
                    tabsDetails={[
                      {
                        title: "Specification and Terms",
                        value: "specification-and-terms",
                        href: "specification-and-terms",
                      },
                    ]}
                    setCurrentTabDetail={setCurrentTabDetail}
                    query={query}
                  >
                    {children}
                  </LandDetail>
                )}
              </>
            )}
        </div>
      </div>
    </div>
  )
}

export const getViewPublicLayoutProps = (page) => (
  <ViewPublicDataProvider>
    <ViewPublicLayout>{page}</ViewPublicLayout>
  </ViewPublicDataProvider>
)
