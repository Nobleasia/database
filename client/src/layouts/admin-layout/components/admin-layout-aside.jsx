import { Transition } from "@headlessui/react"
import cn from "classnames"
import Image from "next/image"
import { useMemo } from "react"
import { MdMenuOpen } from "react-icons/md"

import { useAdminLayout, useAuth } from "@/hooks"

import { AdminSidebarItems } from "./admin-layout-sidebar-items"
import { AdminLayoutSidebarOverlay } from "./admin-layout-sidebar-overlay"

export const AdminLayoutAside = () => {
  const { auth } = useAuth()
  const { sidebarIsOpen, isUnderMDScreen, setSidebarIsOpen } = useAdminLayout()

  const isFullSize = useMemo(() => {
    return !isUnderMDScreen && !sidebarIsOpen ? sidebarIsOpen : true
  }, [isUnderMDScreen, sidebarIsOpen])

  return (
    <aside
      className={cn(
        "absolute -left-[110%] top-0 bottom-0 z-20 flex h-full min-h-screen w-screen flex-1 overflow-auto md:static md:w-auto",
        {
          "left-0 opacity-100 duration-[400ms]": sidebarIsOpen,
          "-left-[110%] opacity-0 duration-300 md:opacity-100": !sidebarIsOpen,
        }
      )}
    >
      <div className="flex h-full flex-[2] flex-col items-center gap-8 overflow-y-auto bg-white py-10 px-5 pb-36 md:border-r-1 md:border-neutral-300">
        <picture className="relative min-h-[6rem] min-w-full overflow-hidden">
          {isFullSize ? (
            <Image
              src="/images/npa-logo-full.jpg"
              alt="NPA Logo"
              placeholder="blur"
              blurDataURL="/images/npa-logo-full.jpg"
              sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
              className="scale-150 bg-cover object-contain"
              fill
              priority
            />
          ) : (
            <Image
              src="/images/npa-logo.png"
              alt="NPA Logo"
              priority
              fill
              sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
              className="scale-75 bg-cover object-contain"
            />
          )}
        </picture>
        <div className="flex w-full flex-col gap-2">
          <div
            className={cn("flex w-full items-center", {
              "justify-between": isFullSize,
              "justify-center": !isFullSize,
            })}
          >
            <Transition
              className="flex flex-col gap-2"
              show={isFullSize}
              enter="duration-200"
              enterFrom="opacity-0 scale-100"
              enterTo="scale-100 opacity-100"
              leave=""
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-0"
            >
              <h1 className="text-sm font-semibold">Welcome Back</h1>
              <h4 className="text-xs text-neutral-500">
                {auth.user_role.charAt(0).toUpperCase() +
                  auth.user_role.slice(1)}
              </h4>
            </Transition>

            <button
              type="button"
              onClick={() => setSidebarIsOpen((oldCondition) => !oldCondition)}
              className="btn-focus-active-purple rounded-md"
            >
              <MdMenuOpen className="h-7 w-7 cursor-pointer" />
            </button>
          </div>
        </div>

        <AdminSidebarItems />
      </div>

      <AdminLayoutSidebarOverlay
        sidebarIsOpen={sidebarIsOpen}
        setSidebarIsOpen={setSidebarIsOpen}
      />
    </aside>
  )
}
