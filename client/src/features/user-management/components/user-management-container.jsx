import cn from "classnames";

export const UserManagementContainer = ({
  renderHeaderComponent = () => null,
  renderTableComponent = () => null,
  variant = "default",
}) => {
  return (
    <section
      className={cn("flex w-full  rounded-md bg-white p-5", {
        "lg:col-span-2": variant === "full",
      })}
    >
      <div className="flex w-full flex-col gap-5">
        <div className="flex h-max flex-col gap-5">
          <div className="flex h-full items-center">
            <div className="grid h-full grid-cols-1 items-center gap-5 max-sm:w-full sm:grid-cols-2">
              {renderHeaderComponent}
            </div>
          </div>
        </div>
        {renderTableComponent}
      </div>
    </section>
  );
};
