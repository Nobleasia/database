import Head from "next/head"
import { useMemo } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { MdSearch } from "react-icons/md"

import { getAdminLayout } from "@/layouts"

import {
  useAxiosPrivate,
  useDebounce,
  useHandleToast,
  usePrivateFetcher,
} from "@/hooks"

import {
  BreadcrumbsContainer,
  BreadcrumbsItem,
  HeaderPage,
  InputField,
  TitlePage,
  Toast,
  ToastProvider,
  ToastViewport,
} from "@/components"

import {
  AddUserDialog,
  UserManagementContainer,
  UserTableControl,
} from "@/features/user-management"

const UserManagement = () => {
  const fetcherConfig = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: true,
  }

  const instance = useAxiosPrivate()
  const { toast, handleToggleToast } = useHandleToast()

  const { control } = useForm({
    mode: "onChange",
    defaultValues: {
      // User
      queryUser: "",
      pageSizeUser: 25,
      pageIndexUser: 0,
    },
  })

  const [
    queryWatchUser,
    pageSizeWatchUser,
    // eslint-disable-next-line no-unused-vars
    pageIndexWatchUser,
  ] = useWatch({
    control,
    name: ["queryUser", "pageSizeUser", "pageIndexUser"],
  })

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
    mutate: mutateUser,
  } = usePrivateFetcher(
    [`${process.env.NEXT_PUBLIC_ENDPOINT_USER_READ}`, {}],
    fetcherConfig
  )
  const toastState = useMemo(() => {
    return { ...toast }
  }, [toast])

  const pagesSize = useMemo(() => {
    const pageSizeUser = Math.ceil(
      userData?.data?.attributes?.total_data_count === 0
        ? 1
        : userData?.data?.attributes?.total_data_count ?? 0 / pageSizeWatchUser
    )

    return {
      pageSizeUser,
    }
  }, [pageSizeWatchUser])

  const queryWatchUserDebounce = useDebounce(queryWatchUser, 500)

  const filteredUserData = useMemo(() => {
    if (!userData?.data?.attributes) return []

    return userData?.data?.attributes?.records?.filter(
      (item) =>
        item.fullname
          .toLowerCase()
          .includes(queryWatchUserDebounce.toLowerCase()) ||
        item.username
          .toLowerCase()
          .includes(queryWatchUserDebounce.toLowerCase())
    )
  }, [userData, queryWatchUserDebounce])

  const handleDeleteUser = async (username) => {
    await instance.delete(
      `${process.env.NEXT_PUBLIC_ENDPOINT_USER_DELETE}/${username}?force=true`
    )

    await mutateUser()
  }

  return (
    <>
      <Head>
        <title>User Management | Noble Asia Database Management System</title>
      </Head>
      <HeaderPage>
        <TitlePage>User Management</TitlePage>
        <BreadcrumbsContainer>
          <BreadcrumbsItem href="/other-forms" disabled>
            User Management
          </BreadcrumbsItem>
        </BreadcrumbsContainer>
      </HeaderPage>

      <ToastProvider swipeDirection="right" duration={1500}>
        <div className="grid auto-rows-max grid-cols-1 gap-8">
          <UserManagementContainer
            renderHeaderComponent={
              <>
                <Controller
                  control={control}
                  name="queryUser"
                  render={({ field, formState: { isTouched, error } }) => (
                    <InputField
                      {...field}
                      type="text"
                      id="queryUser"
                      placeholder="Find an user ..."
                      isTouched={isTouched}
                      isError={error}
                    >
                      <MdSearch className="h-5 w-5 text-neutral-700" />
                    </InputField>
                  )}
                />

                <AddUserDialog mutateDataOrigin={mutateUser} />
              </>
            }
            renderTableComponent={
              <UserTableControl
                control={control}
                isLoading={userLoading}
                isError={userError}
                pageSizeWatch={pageSizeWatchUser}
                pageCount={pagesSize.pageSizeUser}
                totalDataCount={filteredUserData?.length}
                tableData={filteredUserData}
                handleToggleToast={handleToggleToast}
                handleDeleteDataOrigin={handleDeleteUser}
                mutateDataOrigin={mutateUser}
              />
            }
          />
        </div>

        {toastState.open && (
          <Toast
            {...toastState}
            onOpenChange={() => {
              handleToggleToast({
                message: "",
                variant: "",
                open: false,
              })
            }}
          />
        )}

        <ToastViewport />
      </ToastProvider>
    </>
  )
}

UserManagement.getLayout = getAdminLayout

export default UserManagement
