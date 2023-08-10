import { Label, SelectSearchable } from "@/components";

export const PropertyPartialanInputField = ({
  id = "",
  label = "",
  name = "",
  placeholder = "",
  value = "",
  options = [],
  isMulti = false,
  onValueChange = () => {},
}) => {
  return (
    <div className="flex flex-col gap-2 lg:max-w-[350px]">
      <Label htmlFor={id} className="font-medium">
        {label}
      </Label>
      <SelectSearchable
        name={name}
        options={options}
        value={value}
        isMulti={isMulti}
        placeholder={placeholder}
        onValueChange={onValueChange}
      />
    </div>
  );
};
