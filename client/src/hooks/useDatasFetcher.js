import { useEffect, useState } from "react";

import { useAxiosPrivate } from "./useAxiosPrivate";

export const useDatasFetcher = (kodeProparArray, propertyType) => {
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const instance = useAxiosPrivate(); // Replace with your usePrivateAxios hook

  useEffect(() => {
    const fetchDatas = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const promises = kodeProparArray.map(async (kodeProparObject) => {
          const { value, label } = kodeProparObject;
          let endpoint;

          if (propertyType === "apartment") {
            endpoint = process.env.NEXT_PUBLIC_ENDPOINT_APARTMENT_READ;
          } else if (propertyType === "home") {
            endpoint = process.env.NEXT_PUBLIC_ENDPOINT_HOME_READ;
          } else if (propertyType === "office") {
            endpoint = process.env.NEXT_PUBLIC_ENDPOINT_OFFICE_READ;
          } else if (propertyType === "land") {
            endpoint = process.env.NEXT_PUBLIC_ENDPOINT_LAND_READ;
          } else {
            // handle other cases or set a default value
            endpoint = undefined; // or any other default value you prefer
          }
          const config = {
            params: {
              kode_propar: value,
            },
          };

          const response = await instance.get(endpoint, config);
          const responseData = response.data.data.attributes.records[0];

          // Assuming responseData is an object containing the image URLs
          const imageUrls =
            responseData.photos.length > 0
              ? responseData.photos.map((item) => item.photo_url)
              : [];

          const imageResponses = await Promise.all(
            imageUrls.map((url) => instance.get(url))
          );

          const fetchedImages = imageResponses.map((response, index) => ({
            id: responseData.photos[index].id,
            url: imageUrls[index],
          }));

          let facilitiesIds;

          if (propertyType !== "land") {
            facilitiesIds =
              responseData.facilities.length > 0
                ? responseData.facilities.map((item) => item.id)
                : [];
          }

          const areaId = responseData.property_area
            ? responseData.property_area.id
            : null;

          let fetchedArea = null;

          if (areaId) {
            const endpoint = `${process.env.NEXT_PUBLIC_ENDPOINT_PROPERTY_AREA_READ}/${areaId}`;
            const response = await instance.get(endpoint);
            const areaData = response.data;

            fetchedArea = areaData.data.attributes.id;
          }

          const paymentTermId = responseData.property_payment_term
            ? responseData.property_payment_term.id
            : null;

          if (areaId) {
            const endpoint = `${process.env.NEXT_PUBLIC_ENDPOINT_PROPERTY_AREA_READ}/${areaId}`;
            const response = await instance.get(endpoint);
            const areaData = response.data;

            fetchedArea = areaData.data.attributes.id;
          }

          if (propertyType === "land") {
            return {
              kode_propar: label,
              photos: fetchedImages,
              area_id: fetchedArea,
              payment_term_id: paymentTermId,
            };
          }

          return {
            kode_propar: label,
            photos: fetchedImages,
            facilities_id: facilitiesIds,
            area_id: fetchedArea,
            payment_term_id: paymentTermId,
          };
        });

        const responses = await Promise.all(promises);

        const fetchedDatas = responses.flat();

        setDatas(fetchedDatas);
      } catch (error) {
        setError(error);
      }

      setIsLoading(false);
    };

    if (kodeProparArray.length > 0) {
      fetchDatas();
    } else {
      setIsLoading(false);
      setDatas([]);
    }
  }, [kodeProparArray, instance]);

  return { datas, isLoading, error };
};
