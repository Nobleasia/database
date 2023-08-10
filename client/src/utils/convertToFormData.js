export const convertToFormData = (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  return formData;
};
