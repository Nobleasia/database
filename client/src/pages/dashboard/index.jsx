import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"
import { HiBuildingOffice2 } from "react-icons/hi2"
import { MdApartment, MdHome, MdLandscape } from "react-icons/md"

import { getAdminLayout } from "@/layouts"

import { usePrivateFetcher } from "@/hooks"

import {
  BreadcrumbsContainer,
  BreadcrumbsItem,
  HeaderPage,
  Loader,
  TitlePage,
} from "@/components"

import {
  DashboardPropertyReportCard,
  DashboardReportItemCard,
} from "@/features/dashboard"

const Dashboard = () => {
  const [analyticData, setAnalyticData] = useState()
  const iconClassnames = "text-npa-neutral-25 h-6 w-6"
  const fetcherConfig = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: true,
  }

  const { data, isLoading } = usePrivateFetcher(
    [`${process.env.NEXT_PUBLIC_ENDPOINT_ANALYTICS_READ}`, {}],
    fetcherConfig
  )

  useEffect(() => {
    setAnalyticData(data)
  }, [data])

  return (
    <>
      <Head>
        <title>Dashboard | Noble Asia Database Management System</title>
      </Head>

      <HeaderPage>
        <TitlePage>Dashboard</TitlePage>
        <BreadcrumbsContainer>
          <BreadcrumbsItem disabled href="/dashboard">
            Dashboard
          </BreadcrumbsItem>
        </BreadcrumbsContainer>
      </HeaderPage>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <section className="grid h-fit w-full grid-flow-col grid-rows-[max-content_1fr] content-center justify-items-center gap-6 lg:grid-flow-row lg:grid-cols-[0.5fr_1fr] lg:gap-5 xl:grid-cols-[0.4fr_1fr] 2xl:grid-cols-[0.3fr_1fr]">
            <DashboardPropertyReportCard
              data={analyticData?.data?.attributes}
            />

            <div className="grid h-full w-full grid-cols-2 content-center items-center justify-items-center gap-3 xs:gap-5 lg:grid-flow-col lg:grid-cols-1 lg:grid-rows-2">
              <div className="grid h-full w-full grid-rows-3 items-center gap-5 lg:grid-cols-3 lg:grid-rows-1">
                <DashboardReportItemCard
                  color="#214597"
                  propertyType="default"
                  statusText="Last week analystics"
                  totalProperty={
                    analyticData?.data?.attributes?.total_properties
                  }
                >
                  Total Property
                </DashboardReportItemCard>
                <DashboardReportItemCard
                  color="#099250"
                  propertyType="default"
                  statusText="Last week analystics"
                  totalProperty={
                    analyticData?.data?.attributes?.total_available_properties
                  }
                >
                  Available Property
                </DashboardReportItemCard>
                <DashboardReportItemCard
                  color="#D92D20"
                  propertyType="default"
                  statusText="Last week analystics"
                  totalProperty={
                    analyticData?.data?.attributes?.total_unavailable_properties
                  }
                >
                  Not Available Property
                </DashboardReportItemCard>
              </div>

              <div className="grid w-full grid-rows-4 content-center items-center gap-5 lg:grid-cols-4 lg:grid-rows-1">
                <DashboardReportItemCard
                  color="#f59e0b"
                  propertyType="apartement"
                  statusText="Last week analystics"
                  totalProperty={
                    analyticData?.data?.attributes?.total_apartments
                  }
                >
                  Apartment
                </DashboardReportItemCard>
                <DashboardReportItemCard
                  color="#F97066"
                  propertyType="home"
                  statusText="Last week analystics"
                  totalProperty={analyticData?.data?.attributes?.total_homes}
                >
                  Home
                </DashboardReportItemCard>
                <DashboardReportItemCard
                  color="#3CCB7F"
                  propertyType="office"
                  statusText="Not Available Property"
                  totalProperty={analyticData?.data?.attributes?.total_offices}
                >
                  Office
                </DashboardReportItemCard>

                <DashboardReportItemCard
                  color="#5480E8"
                  propertyType="land"
                  statusText="Last week analystics"
                  totalProperty={analyticData?.data?.attributes?.total_lands}
                >
                  Land
                </DashboardReportItemCard>
              </div>
            </div>
          </section>

          <TitlePage>Quick Action</TitlePage>
          <section>
            <div className="grid w-full grid-rows-4 content-center items-center gap-5 text-white lg:grid-cols-4 lg:grid-rows-1">
              <Link
                href="/apartment-management"
                className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg bg-[#fcd34d]/90 py-10 shadow-lg transition-colors ease-in hover:bg-[#fcd34d]"
              >
                <MdApartment className={iconClassnames} />
                <h3 className="text-1xl font-semibold">Apartment</h3>
              </Link>
              <Link
                href="/home-management"
                className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg bg-[#f97066]/90 py-10 shadow-lg transition-colors ease-in hover:bg-[#f97066]/90"
              >
                <MdHome className={iconClassnames} />
                <h3 className="text-1xl font-semibold">Home</h3>
              </Link>
              <Link
                href="/office-management"
                className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg bg-[#3ccb7f]/90 py-10 shadow-lg transition-colors ease-in hover:bg-[#3ccb7f]/90"
              >
                <HiBuildingOffice2 className={iconClassnames} />
                <h3 className="text-1xl font-semibold">Office</h3>
              </Link>
              <Link
                href="/land-management"
                className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg bg-[#5480e8]/90 py-10 shadow-lg transition-colors ease-in hover:bg-[#5480e8]"
              >
                <MdLandscape className={iconClassnames} />
                <h3 className="text-1xl font-semibold">Land</h3>
              </Link>
            </div>
          </section>
        </>
      )}
    </>
  )
}

Dashboard.getLayout = getAdminLayout

export default Dashboard
