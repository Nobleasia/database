import { useState } from "react";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@/components";

export const SubmitButton = ({
  sectionRoot,
  methods,
  onSubmit,
  onError,
  isSubmitting,
  showAndCloseOnly,
}) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const handleToggleOpenDialog = () => {
    setDialogIsOpen((prevCondition) => !prevCondition);
  };

  return (
    <AlertDialogRoot open={dialogIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          disabled={isSubmitting || showAndCloseOnly}
          onClick={() => {
            handleToggleOpenDialog();
          }}
        >
          Submit
        </Button>
      </AlertDialogTrigger>

      <AlertDialogOverlay className="fixed inset-0 z-20 h-screen w-screen bg-npa-neutral-600/40" />
      <AlertDialogContent className="fixed top-1/2 left-1/2 z-50 flex h-max w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-8 rounded-xl bg-white p-6">
        <div className="flex flex-col gap-3">
          <AlertDialogTitle className="flex items-center gap-2 text-xl font-bold">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="opacity-70">
            This action will add {sectionRoot.toLowerCase()} property
            automatically to the database. Please check again if there is
            missing data.
          </AlertDialogDescription>
        </div>
        <div className="flex w-full items-center justify-end gap-5">
          <AlertDialogCancel
            onClick={handleToggleOpenDialog}
            className="rounded-md border-1 border-npa-neutral-900 bg-npa-neutral-25 p-2 font-medium brightness-[80%] duration-200 hover:brightness-100"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              variant="custom"
              onClick={async (event) => {
                await methods
                  .handleSubmit(onSubmit)(event)
                  .catch((error) => {
                    onError(error);
                  });

                handleToggleOpenDialog();
              }}
              className="flex items-center gap-2 rounded-md bg-npa-info-400/80 p-2 font-medium text-npa-neutral-25 duration-200 disabled:cursor-not-allowed disabled:opacity-80 hover:bg-npa-info-400 hover:disabled:bg-npa-info-400/80"
            >
              Confirm
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};
