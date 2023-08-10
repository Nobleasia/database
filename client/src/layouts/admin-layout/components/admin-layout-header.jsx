import { MdMenuOpen, MdNotifications } from "react-icons/md";

import { useAdminLayout } from "@/hooks";

import { AdminLayoutAvatar } from "./admin-layout-avatar";

export const AdminLayoutHeader = () => {
  const { setSidebarIsOpen } = useAdminLayout();

  return (
    <header>
      <nav className="sticky top-0 left-0 flex items-center justify-between border-b-1 bg-white p-3 px-5 text-npa-neutral-400 md:justify-end md:px-10">
        <button
          type="button"
          onClick={() => setSidebarIsOpen(true)}
          className="btn-focus-active-purple md:hidden"
        >
          <MdMenuOpen className="h-8 w-8 rotate-180 duration-200 hover:text-npa-neutral-500" />
        </button>

        <div className="flex items-center gap-5">
          <button
            type="button"
            className="btn-focus-primary btn-focus-active-purple rounded-md p-1"
          >
            <MdNotifications className="h-8 w-8 duration-200 hover:text-npa-neutral-500" />
          </button>
          <AdminLayoutAvatar />
        </div>
      </nav>
    </header>
  );
};
