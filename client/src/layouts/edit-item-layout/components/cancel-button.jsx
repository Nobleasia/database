import { useState } from "react";
import { MdWarning } from "react-icons/md";

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

export const CancelButton = ({ root, replace, isDirtyFields }) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const handleToggleOpenDialog = () => {
    setDialogIsOpen((prevCondition) => !prevCondition);
  };

  return (
    <AlertDialogRoot open={dialogIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() =>
            isDirtyFields ? handleToggleOpenDialog() : replace(`/${root}`)
          }
        >
          Cancel
        </Button>
      </AlertDialogTrigger>

      <AlertDialogOverlay className="fixed inset-0 z-20 h-screen w-screen bg-npa-neutral-600/40" />
      <AlertDialogContent className="fixed top-1/2 left-1/2 z-50 flex h-max w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-8 rounded-xl bg-white p-6">
        <div className="flex flex-col gap-3">
          <AlertDialogTitle className="flex items-center gap-2 text-xl font-bold">
            <MdWarning /> Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="opacity-70">
            This action will cancel you to edit apartment data.
          </AlertDialogDescription>
        </div>
        <div className="flex w-full items-center justify-end gap-5">
          <AlertDialogCancel asChild>
            <Button
              type="button"
              variant="outline"
              isFullWidth={false}
              className="rounded-md border-1 border-npa-neutral-900 bg-npa-neutral-25 p-2 font-medium brightness-[80%] duration-200 hover:brightness-100"
              onClick={handleToggleOpenDialog}
            >
              Return
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="reset"
              variant="custom"
              className="rounded-md bg-npa-error-600/80 px-4 py-3 font-medium text-npa-neutral-25 duration-200 hover:bg-npa-error-600"
              onClick={() => replace(`/${root}`)}
            >
              Cancel
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};
