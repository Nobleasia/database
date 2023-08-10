export const convertNumberToPriceFormat = (value, currency) => {
  const currencyType = currency === "Rupiah" ? "IDR" : "USD";

  return new Intl.NumberFormat("id-ID", {
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    style: "currency",
    currency: currencyType,
  }).format(value);
};
