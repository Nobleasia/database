import { GroupInput } from "@/components";

export const ApartmentManagementGroupInput = ({ children }) => {
  return (
    <GroupInput direction="column" className="md:max-w-sm">
      {children}
    </GroupInput>
  );
};
