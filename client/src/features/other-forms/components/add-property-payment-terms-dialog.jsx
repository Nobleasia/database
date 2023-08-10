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
} from "@/components";

import { useHandleDisablingSubmitButtonDialog } from "../hooks/useHandleDisablingSubmitButtonDialog";
import { OtherFormsDialogButton } from "./other-forms-dialog-button";

export const AddPropertyPaymentTermsDialog = ({
  id,
  paymentTerm,
  mutateDataOrigin,
  isEditMode,
}) => {
  const instance = useAxiosPrivate();
  const { handleToggleToast } = useHandleToast();

  const {
    control,
    reset,
    trigger,
    handleSubmit,
    formState: { isSubmitted, isSubmitting, errors, dirtyFields },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      payment_term: paymentTerm,
    },
  });

  const [open, setOpen] = useState(false);
  const submitButtonIsDisable = useHandleDisablingSubmitButtonDialog({
    errors,
    dirtyFields,
    isSubmitting,
    isEditMode,
  });

  const watchName = useWatch({
    control,
    name: "payment_term",
  });

  const onSubmit = async (payload) => {
    const successMessage = isEditMode
      ? "Success update property payment terms"
      : "Success add new property payment terms";
    const ENDPOINT = isEditMode
      ? `${process.env.NEXT_PUBLIC_ENDPOINT_PAYMENT_TERMS_UPDATE}/${id}`
      : `${process.env.NEXT_PUBLIC_ENDPOINT_PAYMENT_TERMS_CREATE}`;
    const METHOD = isEditMode ? "PUT" : "POST";

    const payloadData = isEditMode
      ? {
          new_payment_term: payload.payment_term,
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
          payment_term: paymentTerm,
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
          payment_term: "",
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
          Add Property Payment Terms
        </OtherFormsDialogButton>
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay />

        <DialogContent className="flex flex-col gap-5 overflow-y-auto" asChild>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              trigger("payment_term", {
                shouldFocus: true,
              });

              await handleSubmit(onSubmit)(event).catch((error) => {
                onErrors(error);
              });
            }}
          >
            <div className="flex items-center justify-between border-b-1 border-b-npa-neutral-300 pb-2">
              <DialogTitle>Add Property Payment Terms</DialogTitle>
              <DialogClose className="h-max w-max p-1 text-npa-neutral-800">
                <MdClose className="h-5 w-5" />
              </DialogClose>
            </div>

            <div className="flex flex-col gap-4">
              <GroupInput direction="column">
                <Label htmlFor="payment_term" className="font-medium">
                  Payment Term Type
                </Label>

                <Controller
                  name="payment_term"
                  control={control}
                  rules={{
                    required: "Payment terms type is required",
                  }}
                  render={({ field, fieldState: { error, isTouched } }) => (
                    <>
                      <InputField
                        {...field}
                        type="text"
                        id="payment_term"
                        value={watchName}
                        placeholder="Enter payment term type ..."
                        disabled={isSubmitting}
                        isSubmitted={isSubmitted}
                        isTouched={isTouched}
                        isError={error}
                        onChange={field.onChange}
                      />
                      {error ? (
                        <AlertInputError>{error.message}</AlertInputError>
                      ) : (
                        <Placeholder>Example: Full in Advance</Placeholder>
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
