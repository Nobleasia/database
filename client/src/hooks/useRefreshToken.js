import { useRouter } from "next/router";
import { useEffect } from "react";

import { fetcher, useSWR } from "@/libs";

import { useAuth } from "./useAuth";

export const useRefreshToken = () => {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR(
    process.env.NEXT_PUBLIC_ENDPOINT_USERS_REFRESH_TOKEN,
    fetcher,
    { keepPreviousData: false, refreshInterval: 0, revalidateOnFocus: false }
  );
  const { setAuth } = useAuth();

  useEffect(() => {
    if (error) {
      setAuth({});
      router.replace("/login");
      return;
    }

    if (data && data?.data?.attributes) {
      setAuth((prev) => ({
        ...prev,
        access_token: data.data.attributes.new_access_token,
        user_role: data.data.attributes.user_role,
      }));
    }
  }, [data, error, setAuth, router]);

  return { data, error, isLoading, mutate };
};
