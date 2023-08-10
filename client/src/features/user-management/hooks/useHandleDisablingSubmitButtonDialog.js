import { useMemo } from "react";

export const useHandleDisablingSubmitButtonDialog = ({
  dirtyFields,
  errors,
  isEditMode,
  isSubmitting,
}) => {
  const submitButtonIsDisable = useMemo(() => {
    const hasDirtyFields = Object.keys(dirtyFields).length === 0;
    const hasErrors = Object.keys(errors).length > 0;

    if (isEditMode) {
      return hasDirtyFields || isSubmitting || hasErrors;
    }

    return isSubmitting || hasErrors;
  }, [Object.keys(dirtyFields), errors, isEditMode, isSubmitting]);

  return submitButtonIsDisable;
};
