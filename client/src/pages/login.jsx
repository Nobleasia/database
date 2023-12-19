import cn from "classnames"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { ImSpinner8 } from "react-icons/im"
import { MdClose } from "react-icons/md"

import { useAuth, usePersistUserLogin } from "@/hooks"

import {
  Button,
  Checkbox,
  GroupInput,
  InputField,
  Label,
  Loader,
} from "@/components"

import { instance } from "@/libs"

const Login = () => {
  const { isPersistUserLogin, setIsPersistUserLogin } = usePersistUserLogin()
  const { auth, setAuth } = useAuth()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { isSubmitting, isSubmitted },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const [isAlertIsShow, setIsAlertIsShow] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const onSubmit = async (payload) => {
    if (isAlertIsShow) setIsAlertIsShow(false)

    const { data } = await instance.post(
      process.env.NEXT_PUBLIC_ENDPOINT_USERS_LOGIN,
      payload
    )

    if (data?.code !== 200) {
      throw new Error(data)
    }

    setAuth({
      access_token: data?.data.attributes.access_token,
      user_role: data?.data.attributes.user_role,
    })

    reset({}, { keepDefaultValues: true })
  }

  const onError = (error) => {
    const invalidUsernameOrPassword =
      error?.response?.data?.errors?.username ||
      error?.response?.data?.errors?.password

    const errorMessages =
      (invalidUsernameOrPassword && "Invalid username or password") ||
      error?.message

    setAlertMessage(errorMessages)
    setIsAlertIsShow(true)
    reset(
      {},
      {
        keepValues: true,
        keepDirtyValues: true,
        keepErrors: true,
        keepTouched: false,
        keepIsValid: true,
        keepDefaultValues: false,
      }
    )

    console.error(errorMessages)
  }

  useEffect(() => {
    if (auth?.access_token) {
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    }
  }, [auth, router])

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
      }
    }

    if (isPersistUserLogin) {
      verifyRefreshToken()
    }
  }, [isPersistUserLogin])

  if (auth?.access_token) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Login | Noble Property Asia Database Management System</title>
      </Head>
      <section className="grid h-screen min-h-screen w-screen max-w-[100vw] items-center justify-center overflow-auto bg-npa-login-background bg-cover bg-no-repeat object-cover px-6 py-12 sm:p-0 md:grid md:grid-cols-[1fr_1.15fr] md:bg-white md:bg-none xl:grid-cols-[1.6fr_1fr]">
        <picture className="relative hidden h-full w-full overflow-hidden md:block">
          <Image
            src="/images/npa-login-background.jpg"
            alt="NPA Login Background"
            className="bg-cover object-cover"
            placeholder="blur"
            blurDataURL="/images/npa-login-background.jpg"
            sizes="100%"
            priority
            fill
          />
        </picture>

        <div className="flex h-max max-w-xl flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl xs:gap-8 sm:p-10 md:h-full md:max-w-none md:justify-center md:rounded-none xl:gap-10">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <picture className="relative h-24 w-32 overflow-hidden md:h-48 md:w-72">
              <Image
                src="/images/npa-logo-full.png"
                placeholder="blur"
                blurDataURL="/images/npa-logo-full.png"
                alt="Noble Asia Logo"
                className="h-full w-full bg-cover object-contain"
                sizes="100%"
                fill
                priority
              />
            </picture>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-lg font-semibold xs:text-xl xl:text-2xl">
                Welcome to NA Database
              </h1>
              <p className="text-sm xs:text-base xl:text-sm">
                Sign in under using an account to access the dashboard
              </p>
            </div>
          </div>
          {isAlertIsShow && (
            <div
              className="flex items-center justify-between gap-3 rounded-lg border-1 border-npa-error-500/25 bg-npa-error-500/[15%] py-4 px-6 duration-200"
              role="alert"
            >
              <h3 className="text-sm text-npa-error-500">{alertMessage}</h3>
              <MdClose
                className="cursor-pointer text-npa-error-500"
                onClick={() => setIsAlertIsShow(false)}
              />
            </div>
          )}
          <form
            className="flex flex-col gap-10"
            onSubmit={(event) => {
              handleSubmit(onSubmit)(event)

                // you will have to catch those error and handle them
                .catch((error) => {
                  onError(error)
                })
            }}
          >
            <div className="flex flex-col gap-5">
              <GroupInput direction="column">
                <Label className="text-md w-max" htmlFor="username">
                  Username
                </Label>

                <Controller
                  control={control}
                  name="username"
                  rules={{
                    required: "Username is required",
                  }}
                  render={({ field, fieldState: { isTouched, error } }) => (
                    <>
                      <InputField
                        {...field}
                        type="text"
                        id="username"
                        disabled={isSubmitting}
                        placeholder="Enter username"
                        isSubmitted={isSubmitted}
                        isTouched={isTouched}
                        isError={error}
                      />
                      {error && (
                        <p className="text-sm text-red-500" role="alert">
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </GroupInput>

              <GroupInput direction="column">
                <Label className="text-md w-max" htmlFor="password">
                  Password
                </Label>

                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: "Password is required",
                  }}
                  render={({ field, fieldState: { isTouched, error } }) => (
                    <>
                      <InputField
                        {...field}
                        type="password"
                        id="password"
                        disabled={isSubmitting}
                        placeholder="Enter password"
                        isSubmitted={isSubmitted}
                        isTouched={isTouched}
                        isError={error}
                      />
                      {error && (
                        <p className="text-sm text-red-500" role="alert">
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </GroupInput>

              <div className="my-3 flex items-center gap-3">
                <Checkbox
                  id="remember-user"
                  checked={isPersistUserLogin}
                  onCheckedChange={(state) => {
                    localStorage.setItem("persist_user_login", state)
                    setIsPersistUserLogin(state)
                  }}
                />
                <Label htmlFor="remember-user" className="text-npa-neutral-900">
                  Remember Me
                </Label>
              </div>
            </div>

            <Button
              variant="primary"
              type="submit"
              className="btn-focus-active-purple flex w-full items-center justify-center gap-3 rounded-xl bg-npa-charcoal-400 p-3 font-semibold text-white duration-200 disabled:cursor-not-allowed disabled:bg-npa-purple-500 hover:brightness-90 xl:p-4"
              disabled={isSubmitting}
              onClick={() => {
                trigger()
              }}
            >
              <ImSpinner8
                className={cn("animate-spin", {
                  block: isSubmitting,
                  hidden: !isSubmitting,
                })}
              />
              Sign in
            </Button>
          </form>
        </div>
      </section>
    </>
  )
}

export default Login
