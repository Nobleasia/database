import {
  getViewApartmentLayoutProps,
  useViewApartmentData,
} from "@/features/apartment-management"

const PicInformation = () => {
  const { apartmentAttributes } = useViewApartmentData()

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">PIC in this Apartment:</h3>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 font-medium text-neutral-900">
          <h4 className="text-npa-neutral-500">Name</h4>
          <p>
            {apartmentAttributes?.property_person_in_charge?.fullname || ""}
          </p>
        </div>

        <div className="flex flex-col gap-2 font-medium text-neutral-900">
          <h4 className="text-npa-neutral-500">Role</h4>
          <p>
            {apartmentAttributes?.property_person_in_charge
              ?.property_person_in_charge_role?.name || ""}
          </p>
        </div>
        <div className="flex flex-col gap-2 font-medium text-neutral-900">
          <h4 className="text-npa-neutral-500">Company</h4>
          <p>
            {apartmentAttributes?.property_person_in_charge
              ?.property_person_in_charge_company?.name || ""}
          </p>
        </div>
        <div className="flex flex-col gap-2 font-medium text-neutral-900">
          <h4 className="text-npa-neutral-500">Phone Number</h4>
          <p>
            {apartmentAttributes?.property_person_in_charge?.phone_number || ""}
          </p>
        </div>
      </div>
    </section>
  )
}

PicInformation.getLayout = getViewApartmentLayoutProps

export default PicInformation
