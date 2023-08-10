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

const ADD_OFFICE_SECTION_ITEMS = [
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

const AddOfficeLayout = ({ children }) => {
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
      building_completion: "",
      grade: "",
      condition: "",
      semi_gross_area: "",
      available: "",
      parking_ratio: "",
      pic: {
        fullname: "",
        role: "",
        company: "",
        phone_number: "",
      },
      fees: {
        rental_price: "",
        selling_price: "",
        service_charge_price: "",
        service_charge_time: "Month",
        overtime_price: "",
        overtime_time: "",
        price_currency: "",
        property_payment_terms_name: "",
        vat_percentage: "",
        vat_is_included: "",
        wht_percentage: "",
        wht_is_included: "",
        lease_term_time: "",
        lease_term_type: "",
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
      process.env.NEXT_PUBLIC_ENDPOINT_OFFICE_CREATE,
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
        message: "Office has been created",
        variant: "success",
      });
      replace("/office-management");
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
        title="Add Office"
        root="office-management"
        rootPath="/office-management"
        sectionRoot="add"
        sectionRootPath="/add"
        stepsObject={STEPS_OBJECT}
        sectionItems={ADD_OFFICE_SECTION_ITEMS}
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

export const getAddOfficeLayout = (page) => {
  return getAdminLayout(<AddOfficeLayout>{page}</AddOfficeLayout>);
};

export default AddOfficeLayout;
