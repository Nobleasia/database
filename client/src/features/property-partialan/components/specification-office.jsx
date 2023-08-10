import { useMemo } from "react"

import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from "@/components"

export const OfficeSpecification = ({ publicAttributes }) => {
  const remarksItems = useMemo(() => {
    return [
      {
        id: "remarks_1",
        title: "Remarks 1",
        value: publicAttributes?.remarks_1,
      },
      {
        id: "remarks_2",
        title: "Remarks 2",
        value: publicAttributes?.remarks_2,
      },
      {
        id: "remarks_3",
        title: "Remarks 3",
        value: publicAttributes?.remarks_3,
      },
    ]
  }, [
    publicAttributes?.remarks_1,
    publicAttributes?.remarks_2,
    publicAttributes?.remarks_3,
  ])

  return (
    <div className="flex flex-col gap-8">
      {(publicAttributes?.grade ||
        publicAttributes?.building_completion ||
        publicAttributes?.certificates) && (
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Information</h3>

          <div className="grid grid-cols-3 gap-6 sm:grid-cols-[max-content_max-content_max-content] sm:gap-12 md:grid-cols-2 md:grid-rows-2 md:gap-8 lg:grid-cols-3 xl:auto-cols-max xl:grid-flow-row xl:grid-cols-6 xl:grid-rows-1 2xl:grid-cols-[max-content_max-content_max-content_max-content_max-content_max-content] 2xl:gap-16">
            {publicAttributes?.grade && (
              <div className="flex flex-col gap-2 font-medium text-neutral-900">
                <h4 className="text-npa-neutral-500">Grade</h4>
                <p>{publicAttributes?.grade}</p>
              </div>
            )}

            {publicAttributes?.building_completion !== undefined && (
              <div className="flex flex-col gap-2 font-medium text-neutral-900">
                <h4 className="text-npa-neutral-500">Building Completion</h4>
                <p className="flex items-center gap-1">
                  {publicAttributes?.building_completion}
                </p>
              </div>
            )}

            {publicAttributes?.certificates && (
              <div className="flex flex-col gap-2 font-medium text-neutral-900">
                <h4 className="text-npa-neutral-500">Certificates</h4>
                <p>{publicAttributes?.certificates}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {(publicAttributes?.floor ||
        publicAttributes?.semi_gross_area ||
        publicAttributes?.parking_ratio) && (
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Specification</h3>

          <div className="grid grid-cols-3 gap-6 sm:grid-cols-[max-content_max-content_max-content] sm:gap-12 md:grid-cols-2 md:grid-rows-2 md:gap-8 lg:grid-cols-3 xl:auto-cols-max xl:grid-flow-row xl:grid-cols-6 xl:grid-rows-1 2xl:grid-cols-[max-content_max-content_max-content_max-content_max-content_max-content] 2xl:gap-16">
            {publicAttributes?.floor !== undefined && (
              <div className="flex flex-col gap-2 font-medium text-neutral-900">
                <h4 className="text-npa-neutral-500">Floor</h4>
                <p>{publicAttributes?.floor}</p>
              </div>
            )}

            {publicAttributes?.semi_gross_area !== undefined && (
              <div className="flex flex-col gap-2 font-medium text-neutral-900">
                <h4 className="text-npa-neutral-500">Semi Gross Area</h4>
                <p className="flex items-center gap-1">
                  {publicAttributes?.semi_gross_area} sqm
                </p>
              </div>
            )}

            {publicAttributes?.parking_ratio !== undefined && (
              <div className="flex flex-col gap-2 font-medium text-neutral-900">
                <h4 className="text-npa-neutral-500">Parking Ratio</h4>
                <p>{publicAttributes?.parking_ratio} sqm</p>
              </div>
            )}
          </div>
        </section>
      )}

      {(publicAttributes?.lease_term_time ||
        publicAttributes?.lease_term_type ||
        publicAttributes?.vat_details ||
        publicAttributes?.wht_details) && (
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Terms</h3>

          <div className="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-[max-content_max-content_1fr] xl:grid-cols-[0.5fr_0.5fr_1fr] xl:gap-16 2xl:grid-cols-[max-content_max-content_max-content]">
            {(publicAttributes?.lease_term_time ||
              publicAttributes?.lease_term_type) && (
              <>
                <div className="flex flex-col gap-2 font-medium text-neutral-900">
                  <h4 className="text-npa-neutral-500">Lease Terms</h4>
                  <p className="flex items-center gap-1">
                    <span>{`${publicAttributes?.lease_term_time} ${
                      publicAttributes?.lease_term_time > 1
                        ? `${publicAttributes.lease_term_type}(s)`
                        : publicAttributes?.lease_term_type
                    }`}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 font-medium text-neutral-900">
                  <h4 className="text-npa-neutral-500">Payment Terms</h4>
                  <p>{publicAttributes?.property_payment_term?.payment_term}</p>
                </div>
              </>
            )}
            {(publicAttributes?.vat_details ||
              publicAttributes?.wht_details) && (
              <div className="flex flex-col gap-2 whitespace-nowrap font-medium text-neutral-900 lg:whitespace-pre-wrap">
                <h4 className="text-npa-neutral-500">Tax Fees</h4>
                <ul className="flex list-inside list-disc flex-col gap-2">
                  {publicAttributes?.vat_details ? (
                    <li>{publicAttributes?.vat_details}</li>
                  ) : (
                    <li>No VAT Fees</li>
                  )}
                  {publicAttributes?.wht_details ? (
                    <li>{publicAttributes?.wht_details}</li>
                  ) : (
                    <li>No WHT Fees</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

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
                  <AccordionContent>
                    {value === null ? value : "No Remarks"}
                  </AccordionContent>
                </AccordionItem>
              )
          )}
        </AccordionRoot>
      </section>
    </div>
  )
}
