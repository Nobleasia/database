import PropTypes from "prop-types";

import { Label } from "@/components";

export const AddHomeLabel = ({ children, htmlFor, isRequired }) => {
  return (
    <Label
      htmlFor={htmlFor}
      className="text-sm font-medium opacity-80 lg:text-base"
    >
      {children}&nbsp;
      {isRequired && (
        <span role="tooltip" className="text-npa-error-600">
          *
        </span>
      )}
    </Label>
  );
};

AddHomeLabel.propTypes = {
  children: PropTypes.string.isRequired,
  htmlFor: PropTypes.string.isRequired,
};
