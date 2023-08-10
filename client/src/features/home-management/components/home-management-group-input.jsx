import { GroupInput } from "@/components";

export const HomeManagementGroupInput = ({ children }) => {
  return (
    <GroupInput direction="column" className="md:max-w-sm">
      {children}
    </GroupInput>
  );
};
