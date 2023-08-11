import cn from "classnames"
import Link from "next/link"

import { convertNumberToPriceFormat } from "@/utils"

export const OfficeDetail = ({
  publicAttributes,
  activeTab,
  query,
  tabsDetails,
  setCurrentTabDetail,
  children,
}) => {
  return (
    <div className="grid grid-rows-[max-content_max-content] gap-5 lg:grid-cols-2 lg:grid-rows-none lg:gap-8 xl:grid-cols-[1.5fr_1fr] 2xl:grid-cols-[2fr_1fr]">
      <section className="flex h-max flex-col items-center gap-2 rounded-md border-1 border-npa-neutral-200 p-6 shadow-sm lg:order-last">
        {(publicAttributes.selling_price || publicAttributes.address) && (
          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-2xl font-semibold text-npa-info-400">
              {publicAttributes.selling_price !== 0
                ? `${convertNumberToPriceFormat(
                    publicAttributes.selling_price,
                    publicAttributes.price_currency
                  )} /sqm`
                : `${convertNumberToPriceFormat(
                    publicAttributes.rental_price,
                    publicAttributes.price_currency
                  )} /sqm/mo`}
            </h2>
            <p className="font-medium md:w-10/12 md:text-sm lg:text-base">
              {publicAttributes.address}
            </p>
          </div>
        )}

        {(publicAttributes.available || publicAttributes.condition) && (
          <section className="border-top-1 my-6 flex w-full items-center justify-center gap-2 border-b-1 border-t-1 border-npa-neutral-300 py-6 md:flex-col xl:flex-row">
            <span
              className={`flex items-center justify-center rounded-md  py-1 px-3  ${
                publicAttributes.available === "Yes"
                  ? "bg-npa-success-600/30 text-npa-success-900"
                  : "bg-npa-error-600/30 text-npa-error-900"
              }`}
            >
              {publicAttributes.available === "Yes"
                ? "Available"
                : "Not Available"}
            </span>
            <span className="flex items-center justify-center rounded-md bg-npa-info-600/30 py-1 px-3 text-npa-info-800">
              {publicAttributes.condition}
            </span>
          </section>
        )}

        <section className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold">Pricing Information</h3>
          <div className="flex flex-col gap-3 text-center">
            {publicAttributes.selling_price > 0 && (
              <div className="flex flex-col gap-1">
                <h4 className="font-medium text-npa-neutral-500">Sell Price</h4>
                <p className="font-medium">
                  {convertNumberToPriceFormat(
                    publicAttributes.selling_price,
                    publicAttributes.price_currency
                  )}{" "}
                  /sqm
                </p>
              </div>
            )}

            {publicAttributes.rental_price > 0 && (
              <div className="flex flex-col gap-1 text-center">
                <h4 className="font-medium text-npa-neutral-500">
                  Rental Price
                </h4>
                <p className="font-medium">
                  {convertNumberToPriceFormat(
                    publicAttributes.rental_price,
                    publicAttributes.price_currency
                  )}{" "}
                  /sqm/mo
                </p>
              </div>
            )}

            {(publicAttributes.service_charge_price ||
              publicAttributes?.service_charge_time) && (
              <div className="flex flex-col gap-1">
                <h4 className="font-medium text-npa-neutral-500">
                  Service Charge
                </h4>
                <p className="font-medium">
                  {convertNumberToPriceFormat(
                    publicAttributes.service_charge_price,
                    publicAttributes.price_currency
                  )}{" "}
                  /sqm/mo
                </p>
              </div>
            )}

            {(publicAttributes?.overtime_price ||
              publicAttributes?.overtime_time) && (
              <div className="flex flex-col gap-1">
                <h4 className="font-medium text-npa-neutral-500">
                  Overtime Price
                </h4>
                <p className="font-medium">
                  {convertNumberToPriceFormat(
                    publicAttributes.overtime_price,
                    publicAttributes.price_currency
                  )}
                  /{publicAttributes?.overtime_time === "Hour" ? "hour" : "day"}
                </p>
              </div>
            )}

            {publicAttributes?.security_deposit && (
              <div className="flex flex-col gap-1">
                <h4 className="font-medium text-npa-neutral-500">
                  Security Deposit
                </h4>
                <p className="font-medium">
                  {publicAttributes?.security_deposit}
                </p>
              </div>
            )}
          </div>
        </section>
      </section>

      <section className="flex flex-col gap-6 overflow-x-hidden">
        <div className="flex items-center gap-4 overflow-x-auto py-4 scrollbar-thin scrollbar-track-npa-neutral-200 scrollbar-thumb-npa-neutral-400/60 scrollbar-thumb-rounded-lg lg:gap-8 xl:gap-12">
          {tabsDetails.map(({ value, title, href }) => (
            <Link
              href={`/preview/${query.slug}/${href}`}
              key={`tab-detail-${value}`}
              className={cn("whitespace-nowrap font-medium", {
                "text-npa-neutral-400": value !== activeTab.value,
                "text-npa-primary-900": value === activeTab.value,
              })}
              onClick={() => {
                setCurrentTabDetail((prevValue) => ({
                  ...prevValue,
                  value,
                  title,
                  href,
                }))
              }}
            >
              <span className="p-2">{title}</span>
              <hr
                className={cn("h-1 rounded-md bg-npa-info-500", {
                  visible: value === activeTab.value,
                  invisible: value !== activeTab.value,
                })}
              />
            </Link>
          ))}
        </div>

        <div className="pb-20">{children}</div>
      </section>
    </div>
  )
}
