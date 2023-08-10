import { useRouter } from "next/router";
import { createContext, useEffect, useMemo, useState } from "react";

import { usePrivateFetcher } from "@/hooks";

import { convertNumberToPriceFormat } from "@/utils";

export const ViewHomeDataContext = createContext({});

export const ViewHomeDataProvider = ({ children }) => {
  const { query } = useRouter();

  const [homeAttributes, setHomeAttributes] = useState({});

  const { data: homeData, isLoading: homeDataIsLoading } = usePrivateFetcher(
    [
      `${process.env.NEXT_PUBLIC_ENDPOINT_HOME_READ}`,
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
    if (!homeDataIsLoading) {
      const data = homeData?.data?.attributes?.records[0];

      const priceCurrency = homeAttributes?.price_currency;
      const sellingPrice = homeAttributes?.selling_price;
      const rentalPrice = homeAttributes?.rental_price;
      const compoundFee = homeAttributes?.compound_fee;

      setHomeAttributes((prevData) => ({
        ...prevData,
        ...data,
        convertedPrices: {
          sellingPrice:
            convertNumberToPriceFormat(sellingPrice, priceCurrency) || "-",
          rentalPrice:
            convertNumberToPriceFormat(rentalPrice, priceCurrency) || "-",
          compoundFee:
            convertNumberToPriceFormat(compoundFee, priceCurrency) || "-",
        },
      }));
    }
  }, [
    homeData,
    homeDataIsLoading,
    homeAttributes?.price_currency,
    homeAttributes?.rental_price,
    homeAttributes?.selling_price,
  ]);

  const value = useMemo(() => {
    return {
      homeAttributes,
      homeDataIsLoading,
    };
  });

  return (
    <ViewHomeDataContext.Provider value={value}>
      {children}
    </ViewHomeDataContext.Provider>
  );
};
