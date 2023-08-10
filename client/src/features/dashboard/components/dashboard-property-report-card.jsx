import { DashboardPieChart } from "./dashboard-pie-chart";
import { DashboardPropertyReportCategory } from "./dashboard-property-report-category";

export const DashboardPropertyReportCard = ({ data }) => {
  const processedData = [
    { name: "Apartment", value: data?.total_apartments, color: "#fcd34d" },
    { name: "Home", value: data?.total_homes, color: "#f97066" },
    { name: "Office", value: data?.total_offices, color: "#3ccb7f" },
    { name: "Land", value: data?.total_lands, color: "#5480e8" },
  ];

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-5 rounded-md bg-white p-5 shadow-xl">
      <h2 className="text-xl font-semibold">Property Report</h2>

      <div className="flex w-full items-center justify-center">
        <div className="absolute flex-col gap-1 text-center">
          <h3 className="text-2xl font-bold">{data?.total_properties}</h3>
          <h4 className="text-npa-neutral-500">Total Property</h4>
        </div>
        <DashboardPieChart data={processedData} />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {data &&
          processedData.map((item) => (
            <DashboardPropertyReportCategory
              color={item.color}
              key={`category-${item.name}`}
            >
              {item.name}
            </DashboardPropertyReportCategory>
          ))}
      </div>
    </div>
  );
};
