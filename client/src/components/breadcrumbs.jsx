import cn from "classnames";
import Link from "next/link";
import { MdHome, MdKeyboardArrowRight } from "react-icons/md";

export const BreadcrumbsContainer = ({ children }) => {
  return (
    <nav
      aria-label="breadcrumbs-container"
      className="flex flex-wrap items-center gap-1"
    >
      <MdHome className="h-6 w-6 text-npa-primary-800" />
      {children}
    </nav>
  );
};

export const BreadcrumbsItem = ({ children, href, disabled }) => {
  return (
    <li aria-label="breadcrumbs-item" className="flex items-center gap-1">
      <MdKeyboardArrowRight className="h-6 w-6 text-neutral-800" />
      <Link
        href={href}
        className={cn({
          "pointer-events-none": disabled,
        })}
      >
        <span className="text-sm">{children}</span>
      </Link>
    </li>
  );
};
