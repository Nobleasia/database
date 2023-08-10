import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { MdClose } from "react-icons/md";

import { useAxiosPrivate, useHandleToast, usePrivateFetcher } from "@/hooks";

import {
  AlertInputError,
  Button,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  GroupInput,
  InputField,
  Label,
  Placeholder,
  SelectSearchable,
} from "@/components";

import { useHandleDisablingSubmitButtonDialog } from "../hooks/useHandleDisablingSubmitButtonDialog";
import { OtherFormsDialogButton } from "./other-forms-dialog-button";

export const AddPicDialog = ({
  id = "",
  isEditMode = false,
  fullname = "",
  phoneNumber = "",
  roleName = "",
  companyName = "",
  mutateDataOrigin,
}) => {
  const instance = useAxiosPrivate();
  const { handleToggleToast } = useHandleToast();

  const {
    data: picRoleData,
    isLoading: picRoleIsLoading,
    mutate: mutatePicRole,
  } = usePrivateFetcher(
    [`${process.env.NEXT_PUBLIC_ENDPOINT_PIC_ROLES_READ}`, {}],
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const {
    data: picCompanyData,
    isLoading: picCompanyIsLoading,
    mutate: mutatePicCompany,
  } = usePrivateFetcher(
    [`${process.env.NEXT_PUBLIC_ENDPOINT_PIC_COMPANIES_READ}`, {}],
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const {
    control,
    reset,
    setError,
    trigger,
    clearErrors,
    handleSubmit,
    formState: { isSubmitted, isSubmitting, errors, dirtyFields },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      fullname,
      phone_number: phoneNumber,
      role: roleName,
      company: companyName,
    },
  });

  const [open, setOpen] = useState(false);
  const submitButtonIsDisable = useHandleDisablingSubmitButtonDialog({
    dirtyFields,
    errors,
    isEditMode,
    isSubmitting,
  });

  const [watchPicName, watchPhoneNumber, watchRoleName, watchCompanyName] =
    useWatch({
      control,
      name: ["fullname", "phone_number", "role", "company"],
    });

  const roleOptions = useMemo(() => {
    if (!picRoleData?.data?.attributes.length === 0) return [];

    return picRoleData?.data?.attributes.map((role) => ({
      value: role.name,
      label: role.name,
      id: role.id,
    }));
  }, [picRoleData, picRoleIsLoading]);

  const companyOptions = useMemo(() => {
    if (!picCompanyData?.data?.attributes.length === 0) return [];

    return picCompanyData?.data?.attributes.map((company) => ({
      value: company.name,
      label: company.name,
      id: company.id,
    }));
  }, [picCompanyData, picCompanyIsLoading]);

  const onSubmit = async (payload) => {
    const successMessage = isEditMode
      ? "Successfully updated PIC"
      : "Successfully created PIC";
    const ENDPOINT = isEditMode
      ? `${process.env.NEXT_PUBLIC_ENDPOINT_PIC_UPDATE}/${id}`
      : `${process.env.NEXT_PUBLIC_ENDPOINT_PIC_CREATE}`;
    const METHOD = isEditMode ? "PUT" : "POST";

    const payloadData = isEditMode
      ? {
          new_fullname: payload.fullname,
          new_phone_number: payload.phone_number,
          new_role: payload.role,
          new_company: payload.company,
        }
      : payload;

    await instance({
      url: ENDPOINT,
      method: METHOD,
      data: payloadData,
      headers: {
        "Content-Type": "application/json",
      },
    });

    await mutateDataOrigin();
    await mutatePicRole();
    await mutatePicCompany();

    handleToggleToast({
      open: true,
      variant: "success",
      message: successMessage,
    });

    setOpen(false);
  };

  const onErrors = (errors) => {
    console.error(errors);
    handleToggleToast({
      open: true,
      variant: "error",
      message: errors.message,
    });

    reset(
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

  useEffect(() => {
    if (open && isEditMode) {
      reset(
        {
          fullname,
          phone_number: phoneNumber,
          role: roleName,
          company: companyName,
        },
        {
          keepDirty: false,
          keepTouched: false,
          keepIsValid: false,
          keepErrors: false,
          keepValues: false,
          keepDefaultValues: false,
        }
      );
    }

    if (!open) {
      reset(
        {
          fullname: "",
          phone_number: "",
          role: "",
          company: "",
        },
        {
          keepDefaultValues: true,
        }
      );
    }
  }, [open]);

  return (
    <DialogRoot open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <OtherFormsDialogButton isEditMode={isEditMode}>
          Add PIC
        </OtherFormsDialogButton>
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay />

        <DialogContent
          className="flex w-10/12 flex-col gap-5 overflow-y-auto lg:w-1/2 2xl:w-1/3"
          asChild
        >
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              trigger(["fullname", "phone_number", "role_id", "company_id"], {
                shouldFocus: true,
              });

              await handleSubmit(onSubmit)(event).catch((error) => {
                onErrors(error);
              });
            }}
          >
            <div className="flex items-center justify-between border-b-1 border-b-npa-neutral-300 pb-2">
              <DialogTitle>{isEditMode ? "Edit PIC" : "Add PIC"}</DialogTitle>
              <DialogClose className="h-max w-max p-1 text-npa-neutral-800">
                <MdClose className="h-5 w-5" />
              </DialogClose>
            </div>

            <div className="flex flex-col gap-4">
              <GroupInput direction="column">
                <Label htmlFor="fullname" className="font-medium">
                  Name
                </Label>

                <Controller
                  name="fullname"
                  control={control}
                  rules={{
                    required: "PIC name is required",
                  }}
                  render={({ field, fieldState: { error, isTouched } }) => (
                    <>
                      <InputField
                        {...field}
                        type="text"
                        id="fullname"
                        value={watchPicName}
                        placeholder="Enter PIC name ..."
                        disabled={isSubmitting}
                        isSubmitted={isSubmitted}
                        isTouched={isTouched}
                        isError={error}
                        onChange={field.onChange}
                      />
                      {error ? (
                        <AlertInputError>{error.message}</AlertInputError>
                      ) : (
                        <Placeholder>Example: Ansar Fadillah</Placeholder>
                      )}
                    </>
                  )}
                />
              </GroupInput>

              <GroupInput direction="column">
                <Label htmlFor="phone_number" className="font-medium">
                  Phone Number
                </Label>

                <Controller
                  name="phone_number"
                  control={control}
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^08\d{8,11}$/gi,
                      message: "Phone number is not valid",
                    },
                  }}
                  render={({ field, fieldState: { error, isTouched } }) => (
                    <>
                      <InputField
                        {...field}
                        type="text"
                        id="phone_number"
                        value={watchPhoneNumber}
                        placeholder="Enter PIC phone number ..."
                        disabled={isSubmitting}
                        isSubmitted={isSubmitted}
                        isTouched={isTouched}
                        isError={error}
                        onChange={(event) => {
                          const { value } = event.target;
                          const isCustomInvalid =
                            value.match(/^08\d{8,11}$/gi) === null;

                          if (value.length > 0 && isCustomInvalid) {
                            setError("phone_number", {
                              type: "custom",
                              message: "Phone number is not valid",
                            });
                          } else {
                            clearErrors("phone_number");
                          }

                          field.onChange(value);
                        }}
                      />

                      {error ? (
                        <AlertInputError>{error.message}</AlertInputError>
                      ) : (
                        <Placeholder>Example : 081234567890</Placeholder>
                      )}
                    </>
                  )}
                />
              </GroupInput>

              <GroupInput direction="column">
                <Label htmlFor="role" className="font-medium">
                  Role
                </Label>

                <Controller
                  name="role"
                  control={control}
                  rules={{
                    required: "PIC name is required",
                  }}
                  render={({ field, fieldState: { error, isTouched } }) => (
                    <>
                      <SelectSearchable
                        {...field}
                        isSearchable
                        isClearable
                        id="role"
                        placeholder="Select a PIC role ..."
                        isError={error}
                        isTouched={isTouched}
                        isSubmitted={isSubmitted}
                        disabled={isSubmitting}
                        defaultValue={
                          roleOptions?.find(
                            (option) => option.value === roleName
                          ) || ""
                        }
                        options={roleOptions}
                        value={
                          roleOptions?.find(
                            (option) => option.value === watchRoleName
                          ) || ""
                        }
                        onValueChange={(value) => {
                          field.onChange(value?.value || "");
                        }}
                      />
                      {error ? (
                        <AlertInputError>{error.message}</AlertInputError>
                      ) : (
                        <Placeholder>Example: Owner</Placeholder>
                      )}
                    </>
                  )}
                />
              </GroupInput>

              <GroupInput direction="column">
                <Label htmlFor="company" className="font-medium">
                  Company
                </Label>

                <Controller
                  name="company"
                  control={control}
                  rules={{
                    required: "PIC company is required",
                  }}
                  render={({ field, fieldState: { error, isTouched } }) => (
                    <>
                      <SelectSearchable
                        {...field}
                        isSearchable
                        isClearable
                        id="company"
                        placeholder="Select a company ..."
                        isError={error}
                        isTouched={isTouched}
                        isSubmitted={isSubmitted}
                        disabled={isSubmitting}
                        options={companyOptions}
                        defaultValue={
                          companyOptions?.find(
                            (option) => option.value === companyName
                          ) || ""
                        }
                        value={
                          companyOptions?.find(
                            (option) => option.value === watchCompanyName
                          ) || ""
                        }
                        onValueChange={(value) => {
                          field.onChange(value?.value || "");
                        }}
                      />
                      {error ? (
                        <AlertInputError>{error.message}</AlertInputError>
                      ) : (
                        <Placeholder>Example: Company A</Placeholder>
                      )}
                    </>
                  )}
                />
              </GroupInput>

              <div className="flex items-center justify-end">
                <div className="flex w-max items-center gap-4">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitButtonIsDisable}
                    loading={isSubmitting}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
};
