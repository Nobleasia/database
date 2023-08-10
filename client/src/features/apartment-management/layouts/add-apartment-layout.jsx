import { useRouter } from "next/router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { CreateNewItemLayout, getAdminLayout } from "@/layouts";

import { useAuth, useAxiosPrivate, useHandleToast } from "@/hooks";

import { Toast, ToastProvider, ToastViewport } from "@/components";

import { convertToFormData } from "@/utils";

const STEPS_OBJECT = {
  1: "First Step",
  2: "Second Step",
  3: "Third Step",
  4: "Fourth Step",
  5: "Fifth Step",
};

const ADD_APARTMENT_SECTION_ITEMS = [
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
];

const AddApartmentLayout = ({ children }) => {
  const { toast, handleToggleToast } = useHandleToast();
  const instance = useAxiosPrivate();
  const { auth } = useAuth();
  const { replace } = useRouter();
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      // latest
      kode_propar: "",
      name: "",
      address: "",
      property_area: "",
      furnishing: "",
      size: "",
      floor: "",
      tower: "",
      bedroom: "",
      bathroom: "",
      study_room: "",
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
  });

  const toastState = useMemo(() => {
    return { ...toast };
  }, [toast]);

  const onSubmit = async ({ images, ...payload }) => {
    delete payload.taxFees;

    const { facilities, ...othersPayload } = payload;

    const facilitiesPayload =
      facilities.length === 0
        ? null
        : facilities.map((facility) => ({
            property_facility_name: facility,
          }));

    const payloadData = {
      facilities: facilitiesPayload,

      ...othersPayload,
    };

    const formData = convertToFormData(payloadData);
    images.forEach(async (image) => {
      formData.append("images", image.file);
    });

    const { data } = await instance.post(
      process.env.NEXT_PUBLIC_ENDPOINT_APARTMENT_CREATE,
      formData,
      {
        headers: {
          Authorization: `Bearer ${auth.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (data.status === "CREATED" && data.code === 201) {
      handleToggleToast({
        open: true,
        message: "Apartment has been created",
        variant: "success",
      });
      replace("/apartment-management");
    }
  };

  const onError = (error) => {
    const errorResponse = error?.response?.data?.errors;
    handleToggleToast({
      open: true,
      message: errorResponse
        ? Object.values(errorResponse).join(", ")
        : "Something went wrong!",
      variant: "error",
    });
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
    );
  };

  return (
    <ToastProvider swipeDirection="right" duration={5000}>
      <CreateNewItemLayout
        onError={onError}
        onSubmit={onSubmit}
        methods={methods}
        title="Add Apartment"
        root="apartment-management"
        rootPath="/apartment-management"
        sectionRoot="add"
        sectionRootPath="/add"
        stepsObject={STEPS_OBJECT}
        sectionItems={ADD_APARTMENT_SECTION_ITEMS}
      >
        {children}
      </CreateNewItemLayout>
      {toastState.open && (
        <Toast
          {...toastState}
          onOpenChange={() => {
            handleToggleToast({
              message: "",
              variant: "",
              open: false,
            });
          }}
        />
      )}

      <ToastViewport />
    </ToastProvider>
  );
};

export const getAddApartmentLayout = (page) => {
  return getAdminLayout(<AddApartmentLayout>{page}</AddApartmentLayout>);
};

export default AddApartmentLayout;
