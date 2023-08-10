import { HiBuildingOffice2 } from "react-icons/hi2";
import { MdApartment, MdHome, MdHomeWork, MdLandscape } from "react-icons/md";

export const DashboardReportItemCard = ({
  children,
  propertyType,
  totalProperty,
  statusText,
  color,
}) => {
  const iconClassnames = "text-npa-neutral-25 h-6 w-6";
  const propertyIconTypes = {
    default: <MdHomeWork className={iconClassnames} />,
    apartement: <MdApartment className={iconClassnames} />,
    home: <MdHome className={iconClassnames} />,
    office: <HiBuildingOffice2 className={iconClassnames} />,
    land: <MdLandscape className={iconClassnames} />,
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg bg-white px-[10px] py-5 shadow-lg">
      <div
        className="w-max rounded-full p-3"
        style={{ backgroundColor: color }}
      >
        {propertyIconTypes[propertyType]}
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-semibold">{totalProperty}</h3>
        <h5 className="text-sm font-medium text-npa-info-400">{children}</h5>
      </div>

      <h6 className="text-center text-sm text-npa-neutral-500">{statusText}</h6>
    </div>
  );
};
