import { useRouter } from "next/router";
import { createContext, useEffect, useMemo, useState } from "react";

import { usePrivateFetcher } from "@/hooks";

import { convertNumberToPriceFormat } from "@/utils";

export const ViewApartmentDataContext = createContext({});

export const ViewApartmentDataProvider = ({ children }) => {
  const { query } = useRouter();

  const [apartmentAttributes, setApartmentAttributes] = useState({});

  const { data: apartmentData, isLoading: apartmentDataIsLoading } =
    usePrivateFetcher(
      [
        `${process.env.NEXT_PUBLIC_ENDPOINT_APARTMENT_READ}`,
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
    if (!apartmentDataIsLoading) {
      const data = apartmentData?.data?.attributes?.records[0];

      const priceCurrency = apartmentAttributes?.price_currency;
      const sellingPrice = apartmentAttributes?.selling_price;
      const rentalPrice = apartmentAttributes?.rental_price;

      setApartmentAttributes((prevData) => ({
        ...prevData,
        ...data,
        convertedPrices: {
          sellingPrice:
            convertNumberToPriceFormat(sellingPrice, priceCurrency) || "-",
          rentalPrice:
            convertNumberToPriceFormat(rentalPrice, priceCurrency) || "-",
        },
      }));
    }
  }, [
    apartmentData,
    apartmentDataIsLoading,
    apartmentAttributes?.price_currency,
    apartmentAttributes?.rental_price,
    apartmentAttributes?.selling_price,
  ]);

  const value = useMemo(() => {
    return {
      apartmentAttributes,
      apartmentDataIsLoading,
    };
  });

  return (
    <ViewApartmentDataContext.Provider value={value}>
      {children}
    </ViewApartmentDataContext.Provider>
  );
};
