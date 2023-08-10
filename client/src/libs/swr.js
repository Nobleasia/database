import useSWR from "swr";

import { instance } from "./axios";

export const fetcher = async (endpoint) => {
  const { data } = await instance.get(endpoint);
  return data;
};

export const fetcherWithToken = async (endpoint, token) => {
  const { data } = await instance.get(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export { useSWR };
