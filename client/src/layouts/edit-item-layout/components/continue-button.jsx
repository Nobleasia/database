import { useRouter } from "next/router";
import { useMemo } from "react";

import { Button } from "@/components";

export const ContinueButton = ({
  root,
  replace,
  sectionRoot,
  isSubmitting,
  nextActiveSectionTo,
  onCurrentActiveSectionNumber,
}) => {
  const { query } = useRouter();
  const nextActiveSection = useMemo(() => {
    return `/${root}/${sectionRoot}/${query.slug}/${nextActiveSectionTo}`;
  }, [nextActiveSectionTo]);

  return (
    <Button
      type="button"
      variant="primary"
      loading={isSubmitting}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        onCurrentActiveSectionNumber((prevValue) => prevValue + 1);
        replace(nextActiveSection, undefined, {
          scroll: true,
        });
      }}
    >
      Continue
    </Button>
  );
};
