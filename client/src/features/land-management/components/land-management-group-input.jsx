import { GroupInput } from "@/components";

export const LandManagementGroupInput = ({ children }) => {
  return (
    <GroupInput direction="column" className="md:max-w-sm">
      {children}
    </GroupInput>
  );
};
