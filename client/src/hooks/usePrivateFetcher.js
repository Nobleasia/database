import { useSWR } from "@/libs";

import { useAxiosPrivate } from "./useAxiosPrivate";

export const usePrivateFetcher = (
  [endpoint, config = {}],
  fetcherOptions = {}
) => {
  const instance = useAxiosPrivate();

  // eslint-disable-next-line consistent-return
  const privateFetcher = async (endpoint, config) => {
    try {
      const { data } = await instance.get(endpoint, config);

      return data;
    } catch (error) {
      console.error(error.messages);
    }
  };

  const { data, error, isValidating, mutate } = useSWR(
    [endpoint, config],
    ([endpoint, config]) => privateFetcher(endpoint, config),
    fetcherOptions
  );

  return { data, error, isLoading: isValidating, mutate };
};
