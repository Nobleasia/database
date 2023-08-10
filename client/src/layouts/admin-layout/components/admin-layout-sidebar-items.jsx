import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { FaWpforms } from "react-icons/fa";
import { HiBuildingOffice2 } from "react-icons/hi2";
import {
  MdApartment,
  MdDashboard,
  MdHistory,
  MdHome,
  MdLandscape,
  MdPerson,
  MdPowerSettingsNew,
} from "react-icons/md";

import { useAdminLayout, useAuth, useLogout } from "@/hooks";

import { ToggleGroupRoot } from "@/components";

import { AdminSidebarItem } from "./admin-layout-sidebar-item";

const SUPERADMIN_SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    value: "/dashboard",
    icon: <MdDashboard />,
  },
  {
    title: "Apartment Management",
    value: "/apartment-management",
    icon: <MdApartment />,
  },
  {
    title: "Home Management",
    value: "/home-management",
    icon: <MdHome />,
  },
  {
    title: "Office Management",
    value: "/office-management",
    icon: <HiBuildingOffice2 />,
  },
  {
    title: "Land Management",
    value: "/land-management",
    icon: <MdLandscape />,
  },
  {
    title: "User Management",
    value: "/user-management",
    icon: <MdPerson />,
  },
  {
    title: "Other Forms",
    value: "/other-forms",
    icon: <FaWpforms />,
  },
  {
    title: "Logs",
    value: "/logs",
    icon: <MdHistory />,
  },
  {
    title: "Logout",
    value: "/logout",
    icon: <MdPowerSettingsNew />,
  },
];

const ADMIN_SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    value: "/dashboard",
    icon: <MdDashboard />,
  },
  {
    title: "Apartment Management",
    value: "/apartment-management",
    icon: <MdApartment />,
  },
  {
    title: "Home Management",
    value: "/home-management",
    icon: <MdHome />,
  },
  {
    title: "Office Management",
    value: "/office-management",
    icon: <HiBuildingOffice2 />,
  },
  {
    title: "Land Management",
    value: "/land-management",
    icon: <MdLandscape />,
  },
  {
    title: "User Management",
    value: "/user-management",
    icon: <MdPerson />,
  },
  {
    title: "Other Forms",
    value: "/other-forms",
    icon: <FaWpforms />,
  },
  {
    title: "Logout",
    value: "/logout",
    icon: <MdPowerSettingsNew />,
  },
];

const USER_SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    value: "/dashboard",
    icon: <MdDashboard />,
  },
  {
    title: "Apartment Management",
    value: "/apartment-management",
    icon: <MdApartment />,
  },
  {
    title: "Home Management",
    value: "/home-management",
    icon: <MdHome />,
  },
  {
    title: "Office Management",
    value: "/office-management",
    icon: <HiBuildingOffice2 />,
  },
  {
    title: "Land Management",
    value: "/land-management",
    icon: <MdLandscape />,
  },
  {
    title: "Logout",
    value: "/logout",
    icon: <MdPowerSettingsNew />,
  },
];

export const AdminSidebarItems = () => {
  const { auth } = useAuth();
  const router = useRouter();
  const handleLogout = useLogout();
  const [activeItem, setActiveItem] = useState("/dashboard");
  const { sidebarIsOpen, isUnderMDScreen, setSidebarIsOpen } = useAdminLayout();

  const isFullSize = useMemo(() => {
    return !isUnderMDScreen && !sidebarIsOpen ? sidebarIsOpen : true;
  }, [isUnderMDScreen, sidebarIsOpen]);

  const handleValueChange = (value) => {
    if (value) {
      if (value === "/logout") {
        handleLogout();
      } else {
        router.push(value);
      }

      setActiveItem(value);
    }
  };

  return (
    <ToggleGroupRoot
      className="flex w-full flex-col gap-5"
      value={activeItem}
      onValueChange={handleValueChange}
    >
      {auth?.user_role === "superadmin" &&
        SUPERADMIN_SIDEBAR_ITEMS.map(({ title, value, icon }) => {
          const Icon = React.cloneElement(icon, {
            className: "h-8 w-8",
          });

          return (
            <AdminSidebarItem
              value={value}
              key={`admin-sidebar-item-${title}`}
              isFullSize={isFullSize}
              onClick={() => isUnderMDScreen && setSidebarIsOpen(false)}
            >
              {Icon} {isFullSize && title}
            </AdminSidebarItem>
          );
        })}
      {auth?.user_role === "admin" &&
        ADMIN_SIDEBAR_ITEMS.map(({ title, value, icon }) => {
          const Icon = React.cloneElement(icon, {
            className: "h-8 w-8",
          });

          return (
            <AdminSidebarItem
              value={value}
              key={`admin-sidebar-item-${title}`}
              isFullSize={isFullSize}
              onClick={() => isUnderMDScreen && setSidebarIsOpen(false)}
            >
              {Icon} {isFullSize && title}
            </AdminSidebarItem>
          );
        })}
      {auth?.user_role === "user" &&
        USER_SIDEBAR_ITEMS.map(({ title, value, icon }) => {
          const Icon = React.cloneElement(icon, {
            className: "h-8 w-8",
          });

          return (
            <AdminSidebarItem
              value={value}
              key={`admin-sidebar-item-${title}`}
              isFullSize={isFullSize}
              onClick={() => isUnderMDScreen && setSidebarIsOpen(false)}
            >
              {Icon} {isFullSize && title}
            </AdminSidebarItem>
          );
        })}
    </ToggleGroupRoot>
  );
};
