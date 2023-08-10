import { useMemo } from "react"

import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from "@/components"

import {
  getViewOfficeLayoutProps,
  useViewOfficeData,
} from "@/features/office-management"

const SpecificationAndTerms = () => {
  const { officeAttributes } = useViewOfficeData()

  const remarksItems = useMemo(() => {
    return [
      {
        id: "remarks_1",
        title: "Remarks 1",
        value: officeAttributes?.remarks_1,
      },
      {
        id: "remarks_2",
        title: "Remarks 2",
        value: officeAttributes?.remarks_2,
      },
      {
        id: "remarks_3",
        title: "Remarks 3",
        value: officeAttributes?.remarks_3,
      },
    ]
  }, [
    officeAttributes?.remarks_1,
    officeAttributes?.remarks_2,
    officeAttributes?.remarks_3,
  ])

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Information</h3>

        <div className="grid grid-cols-3 gap-6 sm:grid-cols-[max-content_max-content_max-content] sm:gap-12 md:grid-cols-2 md:grid-rows-2 md:gap-8 lg:grid-cols-3 xl:auto-cols-max xl:grid-flow-row xl:grid-cols-6 xl:grid-rows-1 2xl:grid-cols-[max-content_max-content_max-content_max-content_max-content_max-content] 2xl:gap-16">
          <div className="flex flex-col gap-2 font-medium text-neutral-900">
            <h4 className="text-npa-neutral-500">Grade</h4>
            <p>{officeAttributes?.grade}</p>
          </div>
          <div className="flex flex-col gap-2 font-medium text-neutral-900">
            <h4 className="text-npa-neutral-500">Building Completion</h4>
            <p className="flex items-center gap-1">
              {officeAttributes?.building_completion}
            </p>
          </div>
          <div className="flex flex-col gap-2 font-medium text-neutral-900">
            <h4 className="text-npa-neutral-500">Certificates</h4>
            <p>{officeAttributes?.certificates}</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Specification</h3>

        <div className="grid grid-cols-3 gap-6 sm:grid-cols-[max-content_max-content_max-content] sm:gap-12 md:grid-cols-2 md:grid-rows-2 md:gap-8 lg:grid-cols-3 xl:auto-cols-max xl:grid-flow-row xl:grid-cols-6 xl:grid-rows-1 2xl:grid-cols-[max-content_max-content_max-content_max-content_max-content_max-content] 2xl:gap-16">
          <div className="flex flex-col gap-2 font-medium text-neutral-900">
            <h4 className="text-npa-neutral-500">Floor</h4>
            <p>{officeAttributes?.floor}</p>
          </div>
          <div className="flex flex-col gap-2 font-medium text-neutral-900">
            <h4 className="text-npa-neutral-500">Semi Gross Area</h4>
            <p className="flex items-center gap-1">
              {officeAttributes?.semi_gross_area} sqm
            </p>
          </div>
          <div className="flex flex-col gap-2 font-medium text-neutral-900">
            <h4 className="text-npa-neutral-500">Parking Ratio</h4>
            <p>{officeAttributes?.parking_ratio} sqm</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Terms</h3>

        <div className="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-[max-content_max-content_1fr] xl:grid-cols-[0.5fr_0.5fr_1fr] xl:gap-16 2xl:grid-cols-[max-content_max-content_max-content]">
          <div className="flex flex-col gap-2 font-medium text-neutral-900">
            <h4 className="text-npa-neutral-500">Lease Terms</h4>
            <p className="flex items-center gap-1">
              <span>{officeAttributes?.lease_term_time}</span>
              <span>{`${officeAttributes?.lease_term_type} ${
                officeAttributes?.lease_term_time > 1
                  ? `${officeAttributes?.lease_term_type}(s)`
                  : officeAttributes?.lease_term_type
              }`}</span>
            </p>
          </div>
          <div className="flex flex-col gap-2 font-medium text-neutral-900">
            <h4 className="text-npa-neutral-500">Payment Terms</h4>
            <p>{officeAttributes?.property_payment_term?.payment_term}</p>
          </div>
          <div className="flex flex-col gap-2 whitespace-nowrap font-medium text-neutral-900 lg:whitespace-pre-wrap">
            <h4 className="text-npa-neutral-500">Tax Fees</h4>
            <ul className="flex list-inside list-disc flex-col gap-2">
              {officeAttributes?.vat_details ? (
                <li>{officeAttributes?.vat_details}</li>
              ) : (
                <li>No VAT Fees</li>
              )}
              {officeAttributes?.wht_details ? (
                <li>{officeAttributes?.wht_details}</li>
              ) : (
                <li>No WHT Fees</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <AccordionRoot
          type="multiple"
          collapsible="true"
          className="flex flex-col gap-4"
        >
          {remarksItems.map(
            ({ id, title, value }) =>
              value !== "" && (
                <AccordionItem
                  value={id}
                  className="flex flex-col gap-2 2xl:w-3/5"
                  key={id}
                >
                  <AccordionHeader>
                    <AccordionTrigger className="w-max gap-12 py-2 font-medium text-npa-neutral-500">
                      {title}
                    </AccordionTrigger>
                  </AccordionHeader>
                  <AccordionContent>{value}</AccordionContent>
                </AccordionItem>
              )
          )}
        </AccordionRoot>
      </section>
    </div>
  )
}

SpecificationAndTerms.getLayout = getViewOfficeLayoutProps

export default SpecificationAndTerms
