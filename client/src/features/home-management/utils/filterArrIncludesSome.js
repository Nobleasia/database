export const filterArrIncludesSome = (row, columnId, filterValue) => {
  if (!filterValue || filterValue.length === 0) return true

  const rowValue = row.getValue(columnId)

  if (rowValue === null || rowValue === undefined) {
    // Handle cases where rowValue is null or undefined
    return false
  }

  if (Array.isArray(rowValue)) {
    const nonNullRowValue = rowValue.filter((item) => item !== null)
    return nonNullRowValue.some((rowItem) => filterValue.includes(rowItem))
  }

  return rowValue !== null && filterValue.includes(rowValue)
}
