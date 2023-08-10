import Head from "next/head";
import { useRouter } from "next/router";

import {
  AdminLayoutContextProvider,
  AuthContextProvider,
  HandleToastContextProvider,
  PersistUserLoginContextProvider,
} from "@/context";

import "../styles/globals.css";

const App = ({ Component, pageProps }) => {
  const router = useRouter();
  const isPreviewPage = router.pathname.startsWith("/preview/");

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <title>Noble Asia | Database Management System</title>
        <link rel="shortcut icon" href="/images/npa-logo.png" />
      </Head>

      {!isPreviewPage && (
        <AuthContextProvider>
          <PersistUserLoginContextProvider>
            <AdminLayoutContextProvider>
              <HandleToastContextProvider>
                {getLayout(<Component {...pageProps} />)}
              </HandleToastContextProvider>
            </AdminLayoutContextProvider>
          </PersistUserLoginContextProvider>
        </AuthContextProvider>
      )}
      {isPreviewPage && getLayout(<Component {...pageProps} />)}
    </>
  );
};

export default App;
