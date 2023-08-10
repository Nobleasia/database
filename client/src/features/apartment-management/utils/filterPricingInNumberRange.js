export const filterPricingInNumberRange = (row, columnId, filterValue) => {
  const [min, max] = filterValue;

  const rentalPriceValue = row.getValue(columnId)[0];
  return rentalPriceValue >= min && rentalPriceValue <= max;
};
