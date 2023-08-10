import { rankItem } from "@tanstack/match-sorter-utils";

export const globalFilterFuzzy = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(String(row.getValue(columnId)), value);

  if (columnId === "updatedAt") {
    itemRank.passed = false;
  }

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};
