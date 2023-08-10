import { Button } from "@/components";

export const ContinueButton = ({
  root,
  replace,
  sectionRoot,
  isSubmitting,
  nextActiveSectionTo,
  onCurrentActiveSectionNumber,
}) => {
  return (
    <Button
      type="button"
      variant="primary"
      loading={isSubmitting}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        onCurrentActiveSectionNumber((prevValue) => prevValue + 1);
        replace(`/${root}/${sectionRoot}/${nextActiveSectionTo}`);
      }}
    >
      Continue
    </Button>
  );
};
