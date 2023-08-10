import cn from "classnames";

export const OtherFormsContainer = ({
  renderHeaderComponent = () => null,
  renderTableComponent = () => null,
  variant = "default",
  containerTitle = "",
}) => {
  return (
    <section
      className={cn("flex w-full rounded-md bg-white p-5", {
        "lg:col-span-2": variant === "full",
      })}
    >
      <div className="flex w-full flex-col gap-5">
        <div className="flex flex-col gap-5">
          <h2 className="text-xl font-medium">{containerTitle}</h2>
          <div className="flex h-max items-center">
            <div className="grid grid-cols-1 items-center gap-3 max-sm:w-full sm:grid-cols-2 md:gap-5">
              {renderHeaderComponent}
            </div>
          </div>
        </div>
        {renderTableComponent}
      </div>
    </section>
  );
};
