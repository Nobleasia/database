import { useRouter } from "next/router";

import { useAuth } from "./useAuth";
import { useAxiosPrivate } from "./useAxiosPrivate";

export const useLogout = () => {
  const router = useRouter();
  const instance = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  const handleLogout = async () => {
    try {
      const { data } = await instance.get(
        process.env.NEXT_PUBLIC_ENDPOINT_USERS_LOGOUT,
        {
          headers: {
            Authorization: `Bearer ${auth.access_token}`,
          },
        }
      );

      if (data.code === 200 && data?.data.type === "logout") {
        setAuth({});
        router.replace("/login");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return handleLogout;
};
