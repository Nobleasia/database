import cn from "classnames";
import { memo } from "react";

import { ToggleGroupItem } from "@/components";

export const AdminSidebarItem = memo(
  ({ children, value, isFullSize, onClick }) => {
    return (
      <ToggleGroupItem
        value={value}
        onClick={onClick}
        tabIndex={0}
        className={cn(
          "grid grid-cols-[max-content_1fr] items-center gap-4 rounded-md border-1 border-transparent px-2 py-1 text-left outline-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-npa-purple-400/50 data-[state='on']:border-npa-purple-400 data-[state='on']:bg-npa-purple-25 data-[state='on']:font-medium hover:bg-npa-purple-25/80",
          {
            "justify-items-center gap-0": !isFullSize,
          }
        )}
      >
        {children}
      </ToggleGroupItem>
    );
  }
);

AdminSidebarItem.displayName = "AdminSidebarItem";
