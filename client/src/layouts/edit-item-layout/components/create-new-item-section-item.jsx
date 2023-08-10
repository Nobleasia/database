import cn from "classnames";
import Link from "next/link";
import { MdCheck } from "react-icons/md";

export const CreateNewItemSectionItem = ({
  to,
  root,
  slug,
  sectionRoot,
  isActive,
  hasPassed,
  sectionTitle,
  numberOfSection,
  onCurrentActiveSection,
}) => {
  return (
    <Link
      className={cn("flex items-center gap-3 font-medium", {
        "pointer-events-none text-inherit": isActive,
      })}
      href={`/${root}/${sectionRoot}/${slug}/${to}`}
      onClick={() => onCurrentActiveSection(numberOfSection)}
    >
      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md border-1 p-2",
          {
            " border-npa-neutral-900 bg-npa-cream-400": isActive,
            "border-npa-neutral-900/20 bg-transparent": !isActive,
            "border-npa-success-200 bg-[#3ccb7f] text-white ring-2 ring-npa-success-200 duration-200":
              !isActive && hasPassed,
          }
        )}
      >
        <span>
          {hasPassed && !isActive ? (
            <MdCheck className="h-5 w-5 text-white" />
          ) : (
            numberOfSection
          )}
        </span>
      </div>
      <h3
        className={cn("whitespace-nowrap lg:text-lg", {
          "text-npa-success-500": !isActive && hasPassed,
          "text-npa-neutral-900": isActive && !hasPassed,
          "text-npa-neutral-900/80": !isActive && !hasPassed,
        })}
      >
        {sectionTitle}
      </h3>
    </Link>
  );
};
