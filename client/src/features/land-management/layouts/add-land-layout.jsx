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
};

const ADD_LAND_SECTION_ITEMS = [
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
    sectionTitle: "Photos",
    to: "photos",
  },
];

const AddLandLayout = ({ children }) => {
  const { toast, handleToggleToast } = useHandleToast();
  const instance = useAxiosPrivate();
  const { auth } = useAuth();
  const { replace } = useRouter();
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      // latest
      kode_propar: "",
      address: "",
      property_area: "",
      land_size: "",
      ownership: "",
      available: "",
      zone: "",
      surroundings: "",
      pic: {
        fullname: "",
        role: "",
        company: "",
        phone_number: "",
      },
      fees: {
        price: "",
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

    const { ...othersPayload } = payload;

    const payloadData = {
      ...othersPayload,
    };

    console.log(payloadData);

    const formData = convertToFormData(payloadData);
    images.forEach(async (image) => {
      formData.append("images", image.file);
    });

    const { data } = await instance.post(
      process.env.NEXT_PUBLIC_ENDPOINT_LAND_CREATE,
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
        message: "Land has been created",
        variant: "success",
      });
      replace("/land-management");
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
        title="Add Land"
        root="land-management"
        rootPath="/land-management"
        sectionRoot="add"
        sectionRootPath="/add"
        stepsObject={STEPS_OBJECT}
        sectionItems={ADD_LAND_SECTION_ITEMS}
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

export const getAddLandLayout = (page) => {
  return getAdminLayout(<AddLandLayout>{page}</AddLandLayout>);
};

export default AddLandLayout;
