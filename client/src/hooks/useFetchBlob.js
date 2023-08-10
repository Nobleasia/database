import { useAxiosPrivate } from "./useAxiosPrivate";

export const useFetchBlob = () => {
  const instance = useAxiosPrivate();

  // eslint-disable-next-line consistent-return
  const fetchBlob = async (url = "", options = {}) => {
    try {
      const { data } = await instance.get(url, {
        responseType: "blob",
        ...options,
      });

      return data;
    } catch (error) {
      console.error(
        `Error when fetching blob image from ${url} with error: ${error}`
      );
    }
  };

  return fetchBlob;
};
