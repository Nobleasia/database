import { useState } from "react";
import { MdDelete, MdWarning } from "react-icons/md";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@/components";

export const TableActionRemoveButton = ({
  onToggleToast,
  handleDeletingData,
  slug,
}) => {
  const [alertDialogIsOpen, setAlertialogIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleOpenAlertDialog = () => {
    setAlertialogIsOpen((prevCondition) => !prevCondition);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await handleDeletingData(slug);

      onToggleToast({
        open: true,
        variant: "success",
        message: "Data has been deleted successfully",
      });
    } catch (error) {
      console.error(
        `${error.name}: ${error.message} at ${error.stack.split("\n")[1]}}`
      );
      onToggleToast({
        open: true,
        variant: "error",
        message: "Something went wrong, please try again later",
      });
    } finally {
      setIsLoading(false);
      setAlertialogIsOpen(false);
    }
  };

  return (
    <AlertDialogRoot open={alertDialogIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="custom"
          className="rounded-md bg-npa-error-400 px-[6px] py-2 text-white transition-all duration-200 hover:bg-npa-error-500 active:bg-npa-error-600"
          onClick={handleToggleOpenAlertDialog}
        >
          <MdDelete className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogPortal>
        <AlertDialogOverlay className="fixed inset-0 z-20 h-screen w-screen bg-black/40" />
        <AlertDialogContent className="fixed top-1/2 left-1/2 z-50 flex h-max w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-8 rounded-xl bg-white p-6">
          <div className="flex flex-col gap-3">
            <AlertDialogTitle className="flex items-center gap-2 text-xl font-bold">
              <MdWarning /> Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className=" flex flex-col gap-0.5 opacity-70">
              <span>Do you really want to delete this records?</span>
              <span>This process cannot be undone</span>
            </AlertDialogDescription>
          </div>
          <div className="flex w-full items-center justify-end gap-5">
            <AlertDialogCancel asChild>
              <Button
                variant="custom"
                disabled={isLoading}
                onClick={handleToggleOpenAlertDialog}
                className="rounded-md border-1 border-npa-neutral-900 bg-npa-neutral-25 p-2 font-medium brightness-[80%] duration-200 disabled:cursor-not-allowed hover:brightness-100"
              >
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                variant="custom"
                onClick={handleDelete}
                className="flex items-center gap-2 rounded-md bg-npa-error-600/80 p-2 font-medium text-npa-neutral-25 duration-200 
                disabled:cursor-not-allowed disabled:opacity-80 
                hover:[&:not(:disabled)]:bg-npa-error-600"
              >
                Delete
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialogRoot>
  );
};
