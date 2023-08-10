export const filterArrIncludesSome = (row, columnId, filterValue) => {
  // if filterValue is empty array, return true
  if (filterValue.length === 0) return true;

  const rowValue = row.getValue(columnId);

  return filterValue.some((filterItem) => rowValue.includes(filterItem));
};
