export const stringToNumber = (strValue) => {
  if (strValue === "") return "";

  const parsingValue = Number(strValue);
  return !Number.isNaN(parsingValue) ? parsingValue : "";
};
