import { useMemo } from "react";

import {
  getViewOfficeLayoutProps,
  useViewOfficeData,
} from "@/features/office-management";

const Facility = () => {
  const { officeAttributes } = useViewOfficeData();

  const facilities = useMemo(() => {
    return officeAttributes?.facilities.map(
      ({ property_facility_name: propertyFacilityName }) => propertyFacilityName
    );
  }, [officeAttributes?.facilities]);

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">
        Facilities available in this Office:
      </h3>

      <div>
        <ul className="grid w-full list-inside list-disc grid-cols-2 items-center gap-4 gap-y-8 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-[max-content_max-content_max-content_max-content] 2xl:gap-x-16">
          {facilities.map(({ id, facility_name: facilityName }) => (
            <li key={id} className="text-base 2xl:text-lg">
              {facilityName}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

Facility.getLayout = getViewOfficeLayoutProps;

export default Facility;
