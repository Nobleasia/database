import Link from "next/link"
import { useRouter } from "next/router"
import { RiPencilFill } from "react-icons/ri"

import { Button } from "@/components"

export const TableActionEditButton = ({ slug }) => {
  const { pathname } = useRouter()

  return (
    <Link href={`${pathname}/edit/${slug}`} tabIndex={-1}>
      <Button
        variant="custom"
        className="rounded-md bg-npa-success-400 px-[6px] py-2 text-white transition-all duration-200 hover:bg-npa-success-500 active:bg-npa-success-600"
      >
        <RiPencilFill className="h-4 w-4" />
      </Button>
    </Link>
  )
}
