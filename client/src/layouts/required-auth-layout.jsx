import { useAuth } from "@/hooks";

import { Loader } from "@/components";

import { getPersistUserLoginLayout } from "./persist-user-login-layout";

export const RequiredAuthLayout = ({ children }) => {
  const { auth } = useAuth();

  if (!auth?.access_token) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader />;
      </div>
    );
  }

  return children;
};

export const getRequiredAuthLayout = (page) =>
  getPersistUserLoginLayout(<RequiredAuthLayout>{page}</RequiredAuthLayout>);
