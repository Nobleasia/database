import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";



import { EditItemLayout, getAdminLayout } from "@/layouts";



import { useAuth, useAxiosPrivate, useHandleToast } from "@/hooks";



import { Toast, ToastProvider, ToastViewport } from "@/components";



import { convertToFormData, numberValidationObject } from "@/utils";



import { handleFacilitiesValues } from "../utils";


const STEPS_OBJECT = {
  1: "First Step",
  2: "Second Step",
  3: "Third Step",
  4: "Fourth Step",
  5: "Fifth Step",
}

const EDIT_HOME_SECTION_ITEMS = [
  {
    numberOfSection: 1,
    sectionTitle: "Information",
    to: "information",
  },
  {
    numberOfSection: 2,
    sectionTitle: "Specification",
    to: "specification",
  },
  {
    numberOfSection: 3,
    sectionTitle: "Pricing and Payment Terms",
    to: "pricing-and-payment-terms",
  },
  {
    numberOfSection: 4,
    sectionTitle: "Facility",
    to: "facility",
  },
  {
    numberOfSection: 5,
    sectionTitle: "Photos",
    to: "photos",
  },
]

export const EditHomeLayout = ({ children }) => {
  const { toast, handleToggleToast } = useHandleToast()
  const { replace, query } = useRouter()

  const instance = useAxiosPrivate()
  const { auth } = useAuth()

  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      // latest
      kode_propar: "",
      name: "",
      address: "",
      property_area: "",
      land_size: "",
      building_size: "",
      stories: "",
      furnishing: "",
      tower: "",
      bedroom: "",
      bathroom: "",
      study_room: "",
      carport_or_garage: "",
      backyard: "",
      swimming_pool: "",
      house_type: "",
      available: "",
      pic: {
        fullname: "",
        role: "",
        company: "",
        phone_number: "",
      },
      fees: {
        rental_price: "",
        selling_price: "",
        price_currency: "",
        property_payment_terms_name: "",
        compound_fee: "",
        compound_fee_coverage: "",
        lease_term_time: "",
        lease_term_type: "",
        vat_percentage: 0,
        vat_is_included: false,
        wht_percentage: 0,
        wht_is_included: false,
      },
      remarks_1: "",
      remarks_2: "",
      remarks_3: "",
      images: [],
      facilities: [],
      taxFees: [
        {
          taxType: "",
          percentage: "",
          includedWithinPrice: "",
        },
      ],
    },
  })

  const toastState = useMemo(() => {
    return { ...toast }
  }, [toast])

  const onSubmit = async ({ images, ...payload }) => {
    delete payload.photosIds
    delete payload.kode_propar

    const {
      taxFees,
      land_size,
      building_size,
      bedroom,
      bathroom,
      study_room,
      carport_or_garage,
      fees: {
        rental_price,
        selling_price,
        compound_fee,
        compound_fee_coverage,
        lease_term_time,
        vat_percentage,
        wht_percentage,
        ...otherFeesPayload
      },
      ...othersPayload
    } = payload

    console.log("payloadData before processing:", payload)

    const {
      rental_price: rentalPriceNumber,
      selling_price: sellingPriceNumber,
      compound_fee: compoundFee,
      compound_fee_coverage: compoundFeeCoverage,
      lease_term_time: leaseTermTimeNumber,
      vat_percentage: vatPercentageNumber,
      wht_percentage: whtPercentageNumber,
      ...othersNumberPayload
    } = numberValidationObject({
      land_size,
      building_size,
      bedroom,
      bathroom,
      study_room,
      carport_or_garage,
      rental_price,
      selling_price,
      compound_fee,
      compound_fee_coverage,
      lease_term_time,
      vat_percentage,
      wht_percentage,
    })

    const payloadData = {
      ...othersPayload,
      ...othersNumberPayload,
      fees: {
        ...otherFeesPayload,
        rental_price: rentalPriceNumber,
        selling_price: sellingPriceNumber,
        compound_fee: compoundFee,
        compound_fee_coverage: compoundFeeCoverage,
        lease_term_time: leaseTermTimeNumber,
        vat_percentage: vatPercentageNumber,
        wht_percentage: whtPercentageNumber,
      },
    }

    console.log("payloadData after processing:", payloadData)

    const facilitiesValues = handleFacilitiesValues(
      payload.old_facilities,
      payload.facilities
    )

    payloadData.facilities = facilitiesValues
    delete payloadData.old_facilities

    if (payload.deleted_photo_ids.length === 0) {
      payloadData.deleted_photo_ids = null
    }

    const formData = convertToFormData(payloadData)

    images.forEach((image) => {
      formData.append("images", image.file)
    })

    // send request
    const { access_token: accessToken } = auth
    const endpoint = `${process.env.NEXT_PUBLIC_ENDPOINT_HOME_UPDATE}/${query.slug}`

    const { status } = await instance.put(endpoint, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    })

    if (status === 204) {
      replace("/home-management")
      handleToggleToast({
        open: true,
        variant: "success",
        message: "Home has been updated successfully",
      })
    }
  }

  const onError = (error) => {
    const errorResponse = error?.response?.data?.errors
    handleToggleToast({
      open: true,
      message: errorResponse
        ? Object.values(errorResponse).join(", ")
        : "Something went wrong!",
      variant: "error",
    })

    methods.reset(
      (formValues) => ({
        ...formValues,
      }),
      {
        keepValues: true,
        keepDirtyValues: true,
        keepErrors: true,
        keepTouched: false,
        keepIsValid: true,
        keepDefaultValues: false,
      }
    )
  }

  useEffect(() => {
    const getHomeData = async () => {
      try {
        const response = await instance.get(
          `${process.env.NEXT_PUBLIC_ENDPOINT_HOME_READ}`,
          {
            params: {
              kode_propar: query.slug,
            },
          }
        )

        const homeData = response.data.data.attributes.records[0]

        if (Object.keys(homeData).length > 0) {
          const {
            available,
            swimming_pool: swimmingPool,
            backyard,
            property_person_in_charge: PIC,
            property_area: propertyArea,
            vat_details: vatDetails,
            vat_is_included: vatIsIncluded,
            vat_percentage: vatPercentage,
            wht_details: whtDetails,
            wht_is_included: whtIsIncluded,
            wht_percentage: whtPercentage,
            rental_price,
            selling_price,
            compound_fee,
            compound_fee_coverage,
            price_currency,
            property_payment_term: propertyPaymentTerm,
            lease_term_time,
            lease_term_type,
            facilities,
            photos,
            ...othersHomeData
          } = homeData

          // vat and wht
          const taxData = [
            {
              detail: vatDetails,
              taxType: "Value Added Tax",
              percentage: vatPercentage,
              includedWithinPrice: vatIsIncluded ? "Included" : "Excluded",
            },
            {
              detail: whtDetails,
              taxType: "Withholding Tax",
              percentage: whtPercentage,
              includedWithinPrice: whtIsIncluded ? "Included" : "Excluded",
            },
          ].filter(({ detail }) => detail !== null)

          const otherFeesData = taxData.reduce(
            (
              { fees, taxFees },
              { detail, taxType, percentage, includedWithinPrice }
            ) => {
              if (detail !== null) {
                taxFees.push({
                  taxType,
                  percentage,
                  includedWithinPrice,
                })

                if (taxType === "Value Added Tax") {
                  fees.vat_percentage = percentage
                  fees.vat_is_included = includedWithinPrice === "Included"
                } else {
                  fees.wht_percentage = percentage
                  fees.wht_is_included = includedWithinPrice === "Included"
                }
              }

              return {
                fees,
                taxFees,
              }
            },
            {
              fees: {
                vat_percentage: 0,
                vat_is_included: false,
                wht_percentage: 0,
                wht_is_included: false,
              },
              taxFees: [
                {
                  taxType: "",
                  percentage: "",
                  includedWithinPrice: "",
                },
              ],
            }
          )

          const facilitiesDefaultValues = facilities.map(
            ({ property_facility_name: { facility_name: facilityName } }) => ({
              property_facility_name: facilityName,
            })
          )

          const taxFeesData =
            otherFeesData.taxFees.length > 1
              ? otherFeesData.taxFees.filter(({ taxType }) => taxType !== "")
              : otherFeesData.taxFees

          methods.reset(
            {
              pic: {
                fullname: PIC?.fullname,
                phone_number: PIC?.phone_number,
                company: PIC?.property_person_in_charge_company?.name,
                role: PIC?.property_person_in_charge_role?.name,
              },
              available: available === "Yes",
              swimming_pool: swimmingPool === "Yes",
              backyard: backyard === "Yes",
              property_area: propertyArea.region_name,
              fees: {
                rental_price,
                selling_price,
                price_currency,
                compound_fee,
                compound_fee_coverage,
                lease_term_time,
                lease_term_type,
                property_payment_terms_name: propertyPaymentTerm?.payment_term,
                ...otherFeesData.fees,
              },
              taxFees: taxFeesData,
              facilities: facilitiesDefaultValues,
              old_facilities: facilitiesDefaultValues,
              photosIds: [...photos],
              images: [],
              ...othersHomeData,
            },
            {
              keepDirty: false,
              keepTouched: false,
              keepIsValid: false,
              keepErrors: false,
              keepValues: false,
              keepDefaultValues: false,
            }
          )
        }
      } catch (error) {
        console.error(error)
      }
    }

    getHomeData()
  }, [])

  return (
    <ToastProvider swipeDirection="right" duration={5000}>
      <EditItemLayout
        onError={onError}
        onSubmit={onSubmit}
        methods={methods}
        title="Edit Home"
        root="home-management"
        rootPath="/home-management"
        sectionRoot="edit"
        sectionRootPath="/edit"
        stepsObject={STEPS_OBJECT}
        sectionItems={EDIT_HOME_SECTION_ITEMS}
      >
        {children}
      </EditItemLayout>

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
  )
}

export const getEditHomeLayout = (page) => {
  return getAdminLayout(<EditHomeLayout>{page}</EditHomeLayout>)
}