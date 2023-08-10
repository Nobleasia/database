import { Button } from "@/components";

export const PricingAndPaymentTermsAddItem = ({ disabled, onClick }) => {
  return (
    <Button
      variant="custom"
      type="button"
      className="my-1 mx-auto w-max rounded-sm p-1 text-sm font-medium text-npa-info-400 outline-none transition-all duration-300 focus:text-npa-info-500 focus:ring-2 focus:ring-npa-info-300/60 disabled:cursor-not-allowed disabled:opacity-50 hover:text-npa-info-500 active:hover:text-npa-info-600"
      disabled={disabled}
      onClick={onClick}
    >
      + Add item
    </Button>
  );
};
