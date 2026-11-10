export const recipesPerPage = 5;

const getPaginationItems = (currentPage: number, pageCount: number) => {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, "end-ellipsis", pageCount] as const;
  }
  if (currentPage >= pageCount - 2) {
    return [
      1,
      "start-ellipsis",
      pageCount - 2,
      pageCount - 1,
      pageCount,
    ] as const;
  }
  return [1, "start-ellipsis", currentPage, "end-ellipsis", pageCount] as const;
};

export const getCollectionPagination = (
  recipeCount: number,
  requestedPageValue?: string | string[],
) => {
  const requestedPage = Number(
    Array.isArray(requestedPageValue)
      ? requestedPageValue[0]
      : requestedPageValue,
  );
  const pageCount = Math.max(1, Math.ceil(recipeCount / recipesPerPage));
  const currentPage = Number.isInteger(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), pageCount)
    : 1;

  return {
    currentPage,
    pageCount,
    pageStart: (currentPage - 1) * recipesPerPage,
    paginationItems: getPaginationItems(currentPage, pageCount),
  };
};
