import { useMemo } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import { Button } from "./button";
import { ToggleGroupItem, ToggleGroupRoot } from "./toggle-group";

const NEXT_PREV_BUTTON_CLASSNAMES =
  "rounded-md border-1 bg-npa-charcoal-400 p-2 text-npa-neutral-25 transition-all duration-200 disabled:cursor-not-allowed disabled:bg-npa-neutral-50 disabled:text-npa-neutral-300";

export const Pagination = ({
  name,
  id,
  totalData,
  totalPages = 1,
  currentPage = 1,
  setValue,
}) => {
  return (
    <div className="flex items-center gap-4">
      <span className="text-neutral-500">
        Showing of 1-{totalPages} of {totalData}
      </span>
      <div className="flex items-center gap-5">
        <Button
          variant="custom"
          className={NEXT_PREV_BUTTON_CLASSNAMES}
          onClick={() => currentPage > 1 && setValue(name, currentPage - 1)}
          disabled={currentPage === 1}
        >
          <MdKeyboardArrowLeft />
        </Button>

        <ToggleGroupRoot
          onValueChange={(value) => setValue(name, value)}
          defaultValue={1}
          id={id}
        >
          <div className="flex-items flex gap-2">
            <PaginationController
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </ToggleGroupRoot>

        <Button
          variant="custom"
          className={NEXT_PREV_BUTTON_CLASSNAMES}
          onClick={() => setValue(name, currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <MdKeyboardArrowRight />
        </Button>
      </div>
    </div>
  );
};

const PaginationController = ({ currentPage, totalPages }) => {
  const showingItems = useMemo(() => {
    const items = Array.from({ length: totalPages }, (_, index) => index + 1);

    const mappingItems = items
      .map((_, index) => {
        if (index % 5 === 0) {
          return [...items].slice(index, index + 5);
        }
        return null;
      })
      .filter(Boolean);

    const showingItems = mappingItems.find((item) => {
      return item.includes(currentPage);
    });

    return showingItems;
  }, [currentPage, totalPages]);

  return (
    <>
      <ToggleGroupItem
        key={`pagination-${1}`}
        value={1}
        asChild
        data-state={currentPage === 1 ? "on" : "off"}
        aria-checked={currentPage === 1}
      >
        <Button
          value={1}
          variant="custom"
          className="max-w-12 w-12 rounded-md border-1 border-npa-charcoal-500/20 p-2 text-npa-charcoal-700 shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-npa-charcoal-400/50 data-[state='on']:border-npa-charcoal-500/100 data-[state='on']:bg-npa-charcoal-400/30"
          tabIndex={0}
        >
          {1}
        </Button>
      </ToggleGroupItem>

      {currentPage > 10 && (
        <ToggleGroupItem value="" asChild disabled>
          <Button
            value=""
            variant="custom"
            className="min-w-12 max-w-12 w-12 p-2 text-npa-charcoal-700 shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-npa-charcoal-400/50 disabled:opacity-80 data-[state='on']:border-npa-charcoal-500/100 data-[state='on']:bg-npa-charcoal-400/30"
            tabIndex={0}
          >
            ...
          </Button>
        </ToggleGroupItem>
      )}

      {showingItems?.map(
        (item) =>
          item !== totalPages &&
          item !== 1 && (
            <ToggleGroupItem
              key={`pagination-${item}`}
              value={item}
              asChild
              data-state={item === currentPage ? "on" : "off"}
              aria-checked={item === currentPage}
            >
              <Button
                value={item}
                variant="custom"
                className="max-w-12 w-12 rounded-md border-1 border-npa-charcoal-500/20 p-2 text-npa-charcoal-700 shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-npa-charcoal-400/50 data-[state='on']:border-npa-charcoal-500/100 data-[state='on']:bg-npa-charcoal-400/30"
                tabIndex={0}
              >
                {item}
              </Button>
            </ToggleGroupItem>
          )
      )}

      {currentPage <= 10 && totalPages >= 10 && (
        <ToggleGroupItem value="" asChild disabled>
          <Button
            value=""
            variant="custom"
            className="min-w-12 max-w-12 w-12 p-2 text-npa-charcoal-700 shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-npa-charcoal-400/50 disabled:opacity-80 data-[state='on']:border-npa-charcoal-500/100 data-[state='on']:bg-npa-charcoal-400/30"
            tabIndex={0}
          >
            ...
          </Button>
        </ToggleGroupItem>
      )}

      <ToggleGroupItem
        key={`pagination-${totalPages}`}
        value={totalPages}
        asChild
        data-state={totalPages === currentPage ? "on" : "off"}
        aria-checked={totalPages === currentPage}
      >
        <Button
          value={totalPages}
          variant="custom"
          disabled={totalPages === 1 || totalPages === 0}
          className="max-w-12 w-12 rounded-md border-1 border-npa-charcoal-500/20 p-2 text-npa-charcoal-700 shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-npa-charcoal-400/50 data-[state='on']:border-npa-charcoal-500/100 data-[state='on']:bg-npa-charcoal-400/30"
          tabIndex={0}
        >
          {totalPages || "..."}
        </Button>
      </ToggleGroupItem>
    </>
  );
};
