import { useRouter } from "next/router";
import { useMemo } from "react";

import { Button } from "@/components";

export const BackButton = ({
  root,
  replace,
  sectionRoot,
  prevActiveSectionTo,
  onCurrentActiveSectionNumber,
}) => {
  const { query } = useRouter();
  const prevActiveSection = useMemo(() => {
    return `/${root}/${sectionRoot}/${query.slug}/${prevActiveSectionTo}`;
  }, [prevActiveSectionTo]);

  return (
    <Button
      variant="outline"
      disabled={prevActiveSectionTo === undefined}
      onClick={() => {
        onCurrentActiveSectionNumber((prevValue) => prevValue - 1);
        replace(prevActiveSection, undefined, {
          scroll: true,
        });
      }}
    >
      Back
    </Button>
  );
};
