import { useRouter } from "next/router";
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

export const AddApartmentNavigateButton = ({
  dirtyFields,
  prevActiveSectionTo,
  onCurrentActiveSectionNumber,
  currentSectionTitle,
}) => {
  const { replace } = useRouter();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const handleToggleOpenDialog = () => {
    setDialogIsOpen((prevCondition) => !prevCondition);
  };

  if (currentSectionTitle !== "Photos") {
    return (
      <Button
        variant="outline"
        disabled={prevActiveSectionTo === undefined}
        onClick={() => {
          onCurrentActiveSectionNumber((prevValue) => prevValue - 1);
          replace(
            `/apartment-management/add/${prevActiveSectionTo}`,
            undefined,
            { scroll: true }
          );
        }}
      >
        Back
      </Button>
    );
  }

  return (
    <AlertDialogRoot open={dialogIsOpen}>
      <AlertDialogTrigger>
        <Button
          variant="outline"
          onClick={() =>
            dirtyFields
              ? handleToggleOpenDialog()
              : replace("/apartment-management")
          }
        >
          Cancel
        </Button>
      </AlertDialogTrigger>

      <AlertDialogOverlay className="fixed inset-0 z-20 h-screen w-screen bg-npa-neutral-600/40" />
      <AlertDialogContent className="fixed top-1/2 left-1/2 z-50 flex h-max w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-8 rounded-xl bg-white p-6">
        <div className="flex flex-col gap-3">
          <AlertDialogTitle className="text-xl font-bold">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="opacity-70">
            Changes you made may not be saved.
          </AlertDialogDescription>
        </div>
        <div className="flex w-full items-center justify-end gap-5">
          <AlertDialogCancel onClick={handleToggleOpenDialog}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => replace("/apartment-management")}>
            Leave
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};
