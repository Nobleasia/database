import { Placeholder } from "@/components";

export const ApartmentManagementCustomPlaceholder = ({
  children,
  ariaPlaceholder = "",
}) => {
  return (
    <Placeholder
      className="text-npa-neutral-500 md:max-w-sm"
      ariaPlaceholder={ariaPlaceholder || children}
    >
      {children}
    </Placeholder>
  );
};
