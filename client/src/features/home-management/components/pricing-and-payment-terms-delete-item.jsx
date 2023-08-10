import { MdDelete } from "react-icons/md";

import { Button } from "@/components";

export const PricingAndPaymentTermsDeleteItem = ({ onClick }) => {
  return (
    <Button
      variant="custom"
      className="flex items-center gap-1 rounded-md p-[2px] text-sm text-npa-neutral-400 outline-none transition-all duration-300 ease-in focus:ring-2 focus:ring-npa-error-500/50 hover:text-npa-error-500 active:text-npa-error-800"
      onClick={onClick}
    >
      <MdDelete />
      Delete
    </Button>
  );
};
