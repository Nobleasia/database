import { GroupInput } from "@/components";

export const OfficeManagementGroupInput = ({ children }) => {
  return (
    <GroupInput direction="column" className="md:max-w-sm">
      {children}
    </GroupInput>
  );
};
