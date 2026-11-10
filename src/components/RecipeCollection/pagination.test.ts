import { describe, expect, it } from "vitest";
import { getCollectionPagination } from "./pagination";

describe("collection pagination", () => {
  it.each([undefined, "", "invalid", "1.5", "Infinity", "0", "-2"])(
    "defaults or clamps %s to the first page",
    (value) => {
      expect(getCollectionPagination(42, value)).toMatchObject({
        currentPage: 1,
        pageStart: 0,
        pageCount: 9,
      });
    },
  );

  it("uses the first repeated parameter", () => {
    expect(getCollectionPagination(42, ["2", "3"]).currentPage).toBe(2);
    expect(getCollectionPagination(42, ["invalid", "3"]).currentPage).toBe(1);
  });

  it("clamps to the last incomplete page", () => {
    expect(getCollectionPagination(42, "999")).toEqual({
      currentPage: 9,
      pageCount: 9,
      pageStart: 40,
      paginationItems: [1, "start-ellipsis", 7, 8, 9],
    });
  });

  it.each([0, 1, 5])("handles %s results as one page", (count) => {
    expect(getCollectionPagination(count, "2")).toEqual({
      currentPage: 1,
      pageCount: 1,
      pageStart: 0,
      paginationItems: [1],
    });
  });

  it("shows all pages in small collections", () => {
    expect(getCollectionPagination(21, "3").paginationItems).toEqual([
      1, 2, 3, 4, 5,
    ]);
  });

  it("places ellipses at the start, middle and end of large collections", () => {
    expect(getCollectionPagination(42, "1").paginationItems).toEqual([
      1,
      2,
      3,
      "end-ellipsis",
      9,
    ]);
    expect(getCollectionPagination(42, "5").paginationItems).toEqual([
      1,
      "start-ellipsis",
      5,
      "end-ellipsis",
      9,
    ]);
    expect(getCollectionPagination(42, "9").paginationItems).toEqual([
      1,
      "start-ellipsis",
      7,
      8,
      9,
    ]);
  });
});
