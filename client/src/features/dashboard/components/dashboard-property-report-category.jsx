export const DashboardPropertyReportCategory = ({ children, color }) => {
  return (
    <div className="flex w-max flex-wrap items-center gap-1">
      <span className="h-4 w-4" style={{ backgroundColor: color }} />
      <h5>{children}</h5>
    </div>
  );
};
