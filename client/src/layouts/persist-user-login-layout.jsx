import { useRouter } from "next/router"
import { useEffect } from "react"

import { useAuth, usePersistUserLogin } from "@/hooks"

import { Loader } from "@/components"

import { instance } from "@/libs"

export const PersistUserLoginLayout = ({ children }) => {
  const router = useRouter()
  const { setAuth, auth } = useAuth()
  const { isPersistUserLogin } = usePersistUserLogin()

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        const { data } = await instance.get(
          process.env.NEXT_PUBLIC_ENDPOINT_USERS_REFRESH_TOKEN
        )
        setAuth({
          ...auth,
          access_token: data?.data?.attributes.new_access_token,
          user_role: data?.data?.attributes.user_role,
        })
      } catch (error) {
        console.error(
          `${error?.response?.data?.code} ${error?.response?.data?.status}`
        )
        setAuth({})
        router.replace("/login")
      }
    }

    if (isPersistUserLogin && !auth?.access_token) {
      verifyRefreshToken()
    }

    if (!isPersistUserLogin && !auth?.access_token) {
      router.replace("/login")
      setAuth({})
    }
  }, [isPersistUserLogin])

  if (isPersistUserLogin && !auth?.access_token) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader />
      </div>
    )
  }

  return children
}

export const getPersistUserLoginLayout = (page) => (
  <PersistUserLoginLayout>{page}</PersistUserLoginLayout>
)
