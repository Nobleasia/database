import { MdKeyboardArrowDown } from "react-icons/md";
import { components } from "react-select";

export const CustomSelectDropdownIndicator = ({ ...props }) => {
  return (
    <components.DropdownIndicator {...props}>
      <MdKeyboardArrowDown className="h-5 w-5" />
    </components.DropdownIndicator>
  );
};
