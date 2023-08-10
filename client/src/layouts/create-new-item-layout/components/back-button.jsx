import { Button } from "@/components";

export const BackButton = ({
  root,
  replace,
  sectionRoot,
  prevActiveSectionTo,
  onCurrentActiveSectionNumber,
}) => {
  return (
    <Button
      variant="outline"
      disabled={prevActiveSectionTo === undefined}
      onClick={() => {
        onCurrentActiveSectionNumber((prevValue) => prevValue - 1);
        replace(`/${root}/${sectionRoot}/${prevActiveSectionTo}`, undefined, {
          scroll: true,
        });
      }}
    >
      Back
    </Button>
  );
};
