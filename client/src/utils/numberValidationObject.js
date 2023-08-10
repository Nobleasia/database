export const numberValidationObject = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];

    if (value === "" || Number.isNaN(value)) {
      acc[key] = 0;
    } else {
      acc[key] = value;
    }

    return acc;
  }, {});
};
