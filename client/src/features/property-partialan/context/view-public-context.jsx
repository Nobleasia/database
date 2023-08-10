import axios from "axios"
import { useRouter } from "next/router"
import { createContext, useEffect, useMemo, useState } from "react"

export const ViewPublicDataContext = createContext({})

export const ViewPublicDataProvider = ({ children }) => {
  const { query } = useRouter()

  const [publicAttributes, setPublicAttributes] = useState({})
  const [publicDataIsLoading, setPublicDataIsLoading] = useState(true)

  useEffect(() => {
    const fetchPublicData = async () => {
      const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
      })
      try {
        const cacheBuster = new Date().getTime() // Add a cache-busting query parameter
        const { data } = await instance.get(
          `${process.env.NEXT_PUBLIC_ENDPOINT_PROPERTY_PARTIALAN_PUBLIC_VIEW}/${query.slug}?_cb=${cacheBuster}`
        )
        const publicData = data
        const content = publicData?.data?.attributes?.content
        const propertyType = {
          property_type: publicData?.data?.attributes?.property_type,
        }

        setPublicAttributes((prevData) => ({
          ...prevData,
          ...content,
          ...propertyType,
        }))

        setPublicDataIsLoading(false)
      } catch (error) {
        console.error(error)
        setPublicAttributes({})
        setPublicDataIsLoading(false)
      }
    }

    fetchPublicData()
  }, [query.slug])

  const value = useMemo(() => {
    return {
      publicAttributes,
      publicDataIsLoading,
      setPublicAttributes,
    }
  }, [publicAttributes, publicDataIsLoading])

  return (
    <ViewPublicDataContext.Provider value={value}>
      {children}
    </ViewPublicDataContext.Provider>
  )
}
