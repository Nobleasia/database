import Link from "next/link"
import { useRouter } from "next/router"
import { MdRemoveRedEye } from "react-icons/md"

import { Button } from "../button"

export const TableActionViewButton = ({ slug }) => {
  const { pathname } = useRouter()
  return (
    <Link href={`${pathname}/view/${slug}`}>
      <Button
        variant="custom"
        className="rounded-md bg-npa-info-400 px-[6px] py-2 text-white transition-all duration-200 hover:bg-npa-info-500 active:bg-npa-info-600"
      >
        <MdRemoveRedEye className="h-4 w-4" />
      </Button>
    </Link>
  )
}
