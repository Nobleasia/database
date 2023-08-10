import * as AvatarRadix from "@radix-ui/react-avatar";
import * as DropdownMenuRadix from "@radix-ui/react-dropdown-menu";
import cn from "classnames";
import PropTypes from "prop-types";
import { forwardRef, useMemo } from "react";
import { MdOutlineArrowDropDown, MdPowerSettingsNew } from "react-icons/md";

import { useAuth, useLogout } from "@/hooks";

const DropdownMenuItem = forwardRef(function DropdownMenuItem(
  { itemTitle, itemIcon, ...props },
  forwardedRef
) {
  return (
    <DropdownMenuRadix.Item
      className="btn-focus-active-purple flex cursor-pointer items-center gap-2 rounded-md p-[6px] outline-none hover:bg-npa-purple-25 hover:outline-none hover:ring-0 active:bg-npa-purple-25"
      {...props}
      ref={forwardedRef}
    >
      {itemIcon} <h3>{itemTitle}</h3>
    </DropdownMenuRadix.Item>
  );
});

export const AdminLayoutAvatar = () => {
  const { auth } = useAuth();
  const handleLogout = useLogout();

  const fallbackValue = useMemo(() => {
    if (auth?.user_role) {
      return (
        (auth?.user_role === "superadmin" && "SP") ||
        (auth?.user_role === "admin" && "AD") ||
        (auth?.user_role === "user" && "US")
      );
    }

    return "";
  }, [auth]);

  return (
    <DropdownMenuRadix.Root>
      <DropdownMenuRadix.Trigger className="btn-focus-active-purple flex items-center gap-1 rounded-md p-1 data-[state=open]:ring data-[state=open]:ring-npa-purple-400/[80%]">
        <AvatarRadix.Root
          className={cn(
            "flex h-12 w-12 select-none items-center justify-center overflow-hidden rounded-full border-1 border-npa-neutral-300 align-middle"
          )}
        >
          <AvatarRadix.Fallback
            className="flex h-full w-full items-center justify-center"
            delayMs={600}
          >
            {fallbackValue}
          </AvatarRadix.Fallback>
        </AvatarRadix.Root>
        <MdOutlineArrowDropDown className="h-8 w-8 duration-200 group-hover:text-npa-neutral-500" />
      </DropdownMenuRadix.Trigger>

      <DropdownMenuRadix.Portal>
        <DropdownMenuRadix.Content
          sideOffset={32}
          alignOffset={20}
          collisionPadding={32}
          className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-md"
        >
          <DropdownMenuItem
            itemIcon={<MdPowerSettingsNew className="h-6 w-6 text-current" />}
            itemTitle="Log Out"
            onSelect={handleLogout}
          />
        </DropdownMenuRadix.Content>
      </DropdownMenuRadix.Portal>
    </DropdownMenuRadix.Root>
  );
};

DropdownMenuItem.propTypes = {
  itemTitle: PropTypes.elementType.isRequired,
  itemIcon: PropTypes.node.isRequired,
};
