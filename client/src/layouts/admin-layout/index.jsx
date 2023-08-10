import {
  PersistUserLoginLayout,
  RequiredAuthLayout,
  getRequiredAuthLayout,
} from "@/layouts"

import {
  AdminLayoutAside,
  AdminLayoutContainer,
  AdminLayoutHeader,
  AdminLayoutMain,
} from "./components"

export const AdminLayout = ({ children }) => {
  return (
    <PersistUserLoginLayout>
      <RequiredAuthLayout>
        <AdminLayoutContainer>
          <AdminLayoutAside />
          <div className="relative flex flex-col overflow-hidden">
            <AdminLayoutHeader />
            <AdminLayoutMain>{children}</AdminLayoutMain>
          </div>
        </AdminLayoutContainer>
      </RequiredAuthLayout>
    </PersistUserLoginLayout>
  )
}

export const getAdminLayout = (page) =>
  getRequiredAuthLayout(<AdminLayout>{page}</AdminLayout>)
