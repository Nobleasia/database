import { useRouter } from "next/router";
import { createContext, useEffect, useMemo, useState } from "react";

import { usePrivateFetcher } from "@/hooks";

import { convertNumberToPriceFormat } from "@/utils";

export const ViewOfficeDataContext = createContext({});

export const ViewOfficeDataProvider = ({ children }) => {
  const { query } = useRouter();

  const [officeAttributes, setOfficeAttributes] = useState({});

  const { data: officeData, isLoading: officeDataIsLoading } =
    usePrivateFetcher(
      [
        `${process.env.NEXT_PUBLIC_ENDPOINT_OFFICE_READ}`,
        {
          params: {
            kode_propar: query.slug,
          },
        },
      ],
      {
        keepPreviousData: true,
        revalidateOnMount: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }
    );

  useEffect(() => {
    if (!officeDataIsLoading) {
      const data = officeData?.data?.attributes?.records[0];

      const priceCurrency = officeAttributes?.price_currency;
      const sellingPrice = officeAttributes?.selling_price;
      const rentalPrice = officeAttributes?.rental_price;
      const overtimePrice = officeAttributes?.overtime_price;
      const serviceChargePrice = officeAttributes?.service_charge_price;

      setOfficeAttributes((prevData) => ({
        ...prevData,
        ...data,
        convertedPrices: {
          sellingPrice:
            convertNumberToPriceFormat(sellingPrice, priceCurrency) || "-",
          rentalPrice:
            convertNumberToPriceFormat(rentalPrice, priceCurrency) || "-",
          serviceCharge:
            convertNumberToPriceFormat(overtimePrice, priceCurrency) || "-",
          overtimePrice:
            convertNumberToPriceFormat(serviceChargePrice, priceCurrency) ||
            "-",
        },
      }));
    }
  }, [
    officeData,
    officeDataIsLoading,
    officeAttributes?.price_currency,
    officeAttributes?.rental_price,
    officeAttributes?.selling_price,
    officeAttributes?.service_charge_price,
    officeAttributes?.overtime_price,
  ]);

  const value = useMemo(() => {
    return {
      officeAttributes,
      officeDataIsLoading,
    };
  });

  return (
    <ViewOfficeDataContext.Provider value={value}>
      {children}
    </ViewOfficeDataContext.Provider>
  );
};
