import Head from "next/head"
import { useEffect, useRef, useState } from "react"

import { getAdminLayout } from "@/layouts"

import { useAxiosPrivate, usePrivateFetcher } from "@/hooks"

import {
  BreadcrumbsContainer,
  BreadcrumbsItem,
  HeaderPage,
  TitlePage,
} from "@/components"

import { dateFormatter } from "@/utils"

const Logs = () => {
  const instance = useAxiosPrivate()
  const scrollableContainerRef = useRef(null)

  const { data } = usePrivateFetcher(
    [process.env.NEXT_PUBLIC_ENDPOINT_LOGS_READ, {}],
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  const [logs, setLogs] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (data) {
      setLogs(data?.data?.attributes?.records || [])
      setCurrentPage(data?.data?.attributes?.current_page || 1)
    }
  }, [data])

  const fetchNextPage = () => {
    const nextPage = currentPage + 1
    try {
      instance
        .get(process.env.NEXT_PUBLIC_ENDPOINT_LOGS_READ, {
          params: {
            page: nextPage,
            size: 25, // or the desired number of logs per page
          },
        })
        .then((response) => {
          const responseData = response?.data
          if (responseData) {
            const newLogs = responseData?.data?.attributes?.records || []
            setLogs((prevLogs) => [...prevLogs, ...newLogs])
            setCurrentPage(nextPage)
          }
        })
        .catch((error) => {
          console.error("Error fetching next page:", error)
        })
    } catch (error) {
      console.error("Error fetching next page:", error)
    }
  }

  useEffect(() => {
    const scrollableContainer = scrollableContainerRef.current

    const handleScroll = () => {
      if (
        scrollableContainer.scrollHeight - scrollableContainer.scrollTop ===
        scrollableContainer.clientHeight
      ) {
        fetchNextPage()
      }
    }

    scrollableContainer.addEventListener("scroll", handleScroll)
    return () => {
      scrollableContainer.removeEventListener("scroll", handleScroll)
    }
  }, [fetchNextPage])

  return (
    <>
      <Head>
        <title>Logs | Noble Property Asia Database Management System</title>
      </Head>
      <HeaderPage>
        <TitlePage>Logs</TitlePage>
        <BreadcrumbsContainer>
          <BreadcrumbsItem disabled href="/logs">
            Logs
          </BreadcrumbsItem>
        </BreadcrumbsContainer>
      </HeaderPage>
      <section
        ref={scrollableContainerRef}
        className="relative h-full overflow-y-auto rounded-md bg-white"
      >
        <section id="scrollableDiv" className="flex flex-col p-5">
          {logs.map((log, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className="flex flex-row border border-npa-neutral-100 py-3 px-4"
            >
              <p className="flex basis-1/4 items-center justify-center">
                {dateFormatter(log.created_at)}
              </p>
              <p className="flex basis-1/4 items-center justify-center">
                | {log.status_code} |
              </p>
              <p className="w-max basis-1/4">{log.message}</p>
              <p className="flex basis-1/4 items-center justify-center">
                {log.username}
              </p>
            </div>
          ))}
        </section>
      </section>
    </>
  )
}

Logs.getLayout = getAdminLayout

export default Logs
