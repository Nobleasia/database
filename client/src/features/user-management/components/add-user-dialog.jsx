import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { MdClose } from "react-icons/md";

import { useAxiosPrivate, useHandleToast } from "@/hooks";

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
import { UserManagementDialogButton } from "./user-management-dialog-button";

export const AddUserDialog = ({
  id = "",
  isEditMode = false,
  username = "",
  fullname = "",
  role = "",
  password = "",
  mutateDataOrigin,
}) => {
  const instance = useAxiosPrivate();
  const { handleToggleToast } = useHandleToast();

  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
  ];

  const {
    control,
    reset,
    trigger,
    handleSubmit,
    formState: { isSubmitted, isSubmitting, errors, dirtyFields },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      username,
      fullname,
      role,
      password,
    },
  });

  const [open, setOpen] = useState(false);
  const submitButtonIsDisable = useHandleDisablingSubmitButtonDialog({
    dirtyFields,
    errors,
    isEditMode,
    isSubmitting,
  });

  const [watchUsername, watchFullname, watchRole, watchPassword] = useWatch({
    control,
    name: ["username", "fullname", "role", "password"],
  });

  const onSubmit = async (payload) => {
    const successMessage = isEditMode
      ? "Successfully updated an user"
      : "Successfully created an user";
    const ENDPOINT = isEditMode
      ? `${process.env.NEXT_PUBLIC_ENDPOINT_USER_UPDATE}/${id}`
      : `${process.env.NEXT_PUBLIC_ENDPOINT_USER_CREATE}`;
    const METHOD = isEditMode ? "PUT" : "POST";

    const payloadData = isEditMode
      ? {
          username: payload.username,
          fullname: payload.fullname,
          role: payload.role,
          password: payload.password,
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
          username,
          fullname,
          role,
          password,
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
          username: "",
          fullname: "",
          role: "",
          password: "",
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
        <UserManagementDialogButton isEditMode={isEditMode}>
          Add User
        </UserManagementDialogButton>
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
              <DialogTitle>{isEditMode ? "Edit User" : "Add User"}</DialogTitle>
              <DialogClose className="h-max w-max p-1 text-npa-neutral-800">
                <MdClose className="h-5 w-5" />
              </DialogClose>
            </div>

            <div className="flex h-full flex-col gap-4">
              <GroupInput direction="column">
                <Label htmlFor="fullname" className="font-medium">
                  Fullname
                </Label>

                <Controller
                  name="fullname"
                  control={control}
                  rules={{
                    required: "Name is required",
                  }}
                  render={({ field, fieldState: { error, isTouched } }) => (
                    <>
                      <InputField
                        {...field}
                        type="text"
                        id="fullname"
                        value={watchFullname}
                        placeholder="Enter a name ..."
                        disabled={isSubmitting}
                        isSubmitted={isSubmitted}
                        isTouched={isTouched}
                        isError={error}
                        onChange={field.onChange}
                      />
                      {error ? (
                        <AlertInputError>{error.message}</AlertInputError>
                      ) : (
                        <Placeholder>Example: User</Placeholder>
                      )}
                    </>
                  )}
                />
              </GroupInput>

              <GroupInput direction="column">
                <Label htmlFor="username" className="font-medium">
                  Username
                </Label>

                <Controller
                  name="username"
                  control={control}
                  rules={{
                    required: "Username is required",
                  }}
                  render={({ field, fieldState: { error, isTouched } }) => (
                    <>
                      <InputField
                        {...field}
                        type="text"
                        id="username"
                        value={watchUsername}
                        placeholder="Enter an username ..."
                        disabled={isSubmitting}
                        isSubmitted={isSubmitted}
                        isTouched={isTouched}
                        isError={error}
                        onChange={field.onChange}
                      />
                      {error ? (
                        <AlertInputError>{error.message}</AlertInputError>
                      ) : (
                        <Placeholder>Example: user123</Placeholder>
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
                    required: "Role is required",
                  }}
                  render={({ field, fieldState: { error, isTouched } }) => (
                    <>
                      <SelectSearchable
                        {...field}
                        isSearchable
                        isClearable
                        id="role"
                        placeholder="Select a role ..."
                        isError={error}
                        isTouched={isTouched}
                        isSubmitted={isSubmitted}
                        disabled={role === "superadmin" ? true : isSubmitting}
                        defaultValue={
                          roleOptions?.find(
                            (option) => option.value === role
                          ) || ""
                        }
                        options={roleOptions}
                        value={
                          roleOptions?.find(
                            (option) => option.value === watchRole
                          ) || ""
                        }
                        onValueChange={(value) => {
                          field.onChange(value?.value || "");
                        }}
                      />
                      {error ? (
                        <AlertInputError>{error.message}</AlertInputError>
                      ) : (
                        <Placeholder>Example: Admin</Placeholder>
                      )}
                    </>
                  )}
                />
              </GroupInput>

              <GroupInput direction="column">
                <Label htmlFor="password" className="font-medium">
                  Password
                </Label>

                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                  }}
                  render={({ field, fieldState: { error, isTouched } }) => (
                    <>
                      <InputField
                        {...field}
                        type="password"
                        id="password"
                        value={watchPassword}
                        placeholder="Enter a password ..."
                        disabled={isSubmitting}
                        isSubmitted={isSubmitted}
                        isTouched={isTouched}
                        isError={error}
                        onChange={field.onChange}
                      />
                      {error && (
                        <AlertInputError>{error.message}</AlertInputError>
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
