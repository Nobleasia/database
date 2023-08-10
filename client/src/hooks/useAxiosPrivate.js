import { useEffect } from "react";

import { instance } from "@/libs";

import { useAuth } from "./useAuth";
import { useRefreshToken } from "./useRefreshToken";

export const useAxiosPrivate = () => {
  const { mutate } = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const controller = new AbortController();
    const requestIntercept = instance.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${auth?.access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (
          error.response.data.code === 401 &&
          error.response.data.errors?.access_token &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;
          try {
            const newRefreshToken = await mutate();
            prevRequest.headers.Authorization = `Bearer ${newRefreshToken.data.attributes.new_access_token}`;
            return instance(prevRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      instance.interceptors.request.eject(requestIntercept);
      instance.interceptors.request.eject(responseIntercept);
      controller.abort();
    };
  }, [auth, mutate]);

  return instance;
};
