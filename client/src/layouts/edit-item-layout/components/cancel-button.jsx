import { useRouter } from "next/router"
import { useState } from "react"
import { MdWarning } from "react-icons/md"

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
} from "@/components"

export const CancelButton = ({ root, replace, isDirtyFields }) => {
  const { back } = useRouter()
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const handleToggleOpenDialog = () => {
    setDialogIsOpen((prevCondition) => !prevCondition)
  }

  return (
    <AlertDialogRoot open={dialogIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => (isDirtyFields ? handleToggleOpenDialog() : back())}
        >
          Cancel
        </Button>
      </AlertDialogTrigger>

      <AlertDialogOverlay className="fixed inset-0 z-20 w-screen h-screen bg-npa-neutral-600/40" />
      <AlertDialogContent className="fixed z-50 flex flex-col w-full max-w-md gap-8 p-6 -translate-x-1/2 -translate-y-1/2 bg-white top-1/2 left-1/2 h-max rounded-xl">
        <div className="flex flex-col gap-3">
          <AlertDialogTitle className="flex items-center gap-2 text-xl font-bold">
            <MdWarning /> Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="opacity-70">
            This action will cancel you to edit apartment data.
          </AlertDialogDescription>
        </div>
        <div className="flex items-center justify-end w-full gap-5">
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
              className="px-4 py-3 font-medium duration-200 rounded-md bg-npa-error-600/80 text-npa-neutral-25 hover:bg-npa-error-600"
              onClick={() => back()}
            >
              Cancel
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogRoot>
  )
}
