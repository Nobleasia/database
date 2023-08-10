import { useRouter } from "next/router";
import { createContext, useEffect, useMemo, useState } from "react";

import { usePrivateFetcher } from "@/hooks";

import { convertNumberToPriceFormat } from "@/utils";

export const ViewLandDataContext = createContext({});

export const ViewLandDataProvider = ({ children }) => {
  const { query } = useRouter();

  const [landAttributes, setLandAttributes] = useState({});

  const { data: landData, isLoading: landDataIsLoading } = usePrivateFetcher(
    [
      `${process.env.NEXT_PUBLIC_ENDPOINT_LAND_READ}`,
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
    if (!landDataIsLoading) {
      const data = landData?.data?.attributes?.records[0];

      const priceCurrency = landAttributes?.price_currency;
      const price = landAttributes?.price;

      setLandAttributes((prevData) => ({
        ...prevData,
        ...data,
        convertedPrices: {
          price: convertNumberToPriceFormat(price, priceCurrency) || "-",
        },
      }));
    }
  }, [
    landData,
    landDataIsLoading,
    landAttributes?.price_currency,
    landAttributes?.price,
  ]);

  const value = useMemo(() => {
    return {
      landAttributes,
      landDataIsLoading,
    };
  });

  return (
    <ViewLandDataContext.Provider value={value}>
      {children}
    </ViewLandDataContext.Provider>
  );
};
