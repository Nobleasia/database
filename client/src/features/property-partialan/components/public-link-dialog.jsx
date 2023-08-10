import Link from "next/link"
import { useEffect, useState } from "react"

import {
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  Button,
  InputField,
} from "@/components"

export const PublicLinkDialog = ({
  isProcessingPublicLink,
  setIsProcessingPublicLink,
  setPublicLinkId,
  setIsSubmitted,
  propertyPartialanId,
}) => {
  const [seconds, setSeconds] = useState(10)
  const [isOpen, setIsOpen] = useState(isProcessingPublicLink)
  const [isPropertyIdReady, setIsPropertyIdReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSeconds((prevSeconds) => prevSeconds - 1)
    }, 1000)

    if (seconds === 0) {
      clearTimeout(timer)
    }

    return () => clearTimeout(timer)
  }, [seconds])

  useEffect(() => {
    setIsOpen(isProcessingPublicLink)
    setIsPropertyIdReady(false)

    // Simulate an asynchronous operation to wait for property_partialan_id
    const timer = setTimeout(() => {
      setIsPropertyIdReady(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [isProcessingPublicLink])

  const handleClose = () => {
    setIsProcessingPublicLink(false)
    setIsSubmitted(false)
    setPublicLinkId("")
    setIsOpen(false)
  }

  const rootUrl = window.location.origin
  const previewUrl = `${rootUrl}/preview/${propertyPartialanId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(previewUrl)
  }

  return (
    <AlertDialogRoot open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent
          className="flex w-10/12 flex-col gap-5 lg:w-1/2 2xl:w-1/3"
          asChild
        >
          <div className="flex items-center justify-between border-b-1 border-b-npa-neutral-300 pb-2">
            <AlertDialogTitle>
              Successfully creating a public link!
            </AlertDialogTitle>
            {isPropertyIdReady ? (
              <div className="mt-4 flex flex-row gap-3">
                <InputField
                  value={previewUrl}
                  variant="custom"
                  className="w-2/3"
                  readOnly
                />
                <Button
                  isFullWidth={false}
                  variant="custom"
                  className="flex items-center justify-center gap-2 rounded-lg bg-npa-info-400 px-4 py-3 text-sm font-medium text-white transition-all duration-300 focus:ring-[3px] disabled:bg-npa-error-600/50 lg:text-base"
                  onClick={handleCopy}
                >
                  Copy
                </Button>
              </div>
            ) : (
              <div>Loading property ID...</div>
            )}

            <div className="flex w-full justify-end gap-3">
              <Link href={previewUrl}>
                <Button
                  isFullWidth={false}
                  variant="custom"
                  className="flex items-center justify-center gap-2 rounded-lg bg-npa-neutral-900 px-4 py-3 text-sm font-medium text-white outline transition-all duration-300 focus:ring-[3px] lg:text-base"
                  onClick={handleClose}
                >
                  Go to the link
                </Button>
              </Link>
              <Button
                isFullWidth={false}
                variant="custom"
                className="flex items-center justify-center gap-2 rounded-lg bg-npa-error-600 px-4 py-3 text-sm font-medium text-white transition-all duration-300 focus:ring-[3px] disabled:bg-npa-error-600/50 lg:text-base"
                disabled={seconds !== 0}
                onClick={handleClose}
              >
                {seconds !== 0 ? `Close (${seconds})` : "Close"}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialogRoot>
  )
}
