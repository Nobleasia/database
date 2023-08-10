export const useUpdateTaxFeesValue = (setValue, getValues) => {
  return () => {
    setValue("fees.vat_percentage", 0);
    setValue("fees.vat_is_included", false);
    setValue("fees.wht_percentage", 0);
    setValue("fees.wht_is_included", false);

    getValues("taxFees").forEach((taxFee) => {
      const { taxType, percentage, includedWithinPrice } = taxFee;
      const isIncludedWithinPrice = includedWithinPrice === "Included";
      const taxValuePercentage = percentage || 0;

      if (taxType === "Value Added Tax") {
        setValue("fees.vat_percentage", taxValuePercentage);
        setValue("fees.vat_is_included", isIncludedWithinPrice);
        return;
      }

      if (taxType === "Withholding Tax") {
        setValue("fees.wht_percentage", taxValuePercentage);
        setValue("fees.wht_is_included", isIncludedWithinPrice);
      }
    });
  };
};
