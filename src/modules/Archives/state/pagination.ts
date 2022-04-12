import { chunk } from "lodash";
import { atom, selector } from "recoil";
import { Archives } from "./data";

export const PageSize = atom({
  key: "archive-table-page-size",
  default: 10,
});

export const Page = atom({
  key: "archive-table-page",
  default: 1,
});

export const PaginationState = selector({
  key: "paginator-setter",
  get: ({ get }) => {
    const archives = get(Archives);
    const pageSize = get(PageSize);
    const page = get(Page);
    const pageCount = Math.ceil(archives.length / pageSize);
    return {
      page,
      pageCount,
      pageSize,
      total: archives.length,
    };
  },
});

export const PaginatedArchives = selector({
  key: "paginated-archives",
  get: ({ get }) => {
    const pagination = get(PaginationState);
    const archives = get(Archives);
    const chunks = chunk(archives, pagination.pageSize);
    return chunks[pagination.page - 1];
  },
});
