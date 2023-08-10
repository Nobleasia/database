import { memo } from "react";

export const PropertyPartialanSelectedColumnItemsMemoize = memo(
  ({ selectedColumnsObject = {}, columns = [] }) => {
    return Object.entries(selectedColumnsObject)
      .filter((selectedColumn) => selectedColumn[1])
      .map(([key]) => (
        <li key={key} className="lg:whitespace-nowrap">
          {columns.find((column) => column?.value === key)?.label}
        </li>
      ));
  }
);

PropertyPartialanSelectedColumnItemsMemoize.displayName =
  "PropertyPartialanSelectedColumnItemMemoize";
