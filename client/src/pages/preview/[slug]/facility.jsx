import { useMemo } from "react"

import {
  getViewPublicLayoutProps,
  useViewPublicData,
} from "@/features/property-partialan"

const Facility = () => {
  const { publicAttributes } = useViewPublicData()

  const facilities = useMemo(() => {
    if (!publicAttributes?.facilities) {
      return null
    }

    return publicAttributes.facilities.map(
      ({ property_facility_name: propertyFacilityName }) => propertyFacilityName
    )
  }, [publicAttributes?.facilities])

  return facilities ? (
    <section className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Facilities in this property:</h3>

      <div>
        <ul className="grid w-full list-inside list-disc grid-cols-2 items-center gap-4 gap-y-8 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-[max-content_max-content_max-content_max-content] 2xl:gap-x-16">
          {facilities.map(({ id, facility_name: facilityName }) => (
            <li key={id} className="text-base 2xl:text-lg">
              {facilityName}
            </li>
          ))}
          {!facilities && <p>No available facilities in this property</p>}
        </ul>
      </div>
    </section>
  ) : (
    <h1>Facilities are not shown</h1>
  )
}

Facility.getLayout = getViewPublicLayoutProps

export default Facility
