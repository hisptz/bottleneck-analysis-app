import { Card, DataTable, DataTableCell, DataTableRow, Pagination, TableFoot } from "@dhis2/ui";
import React, { Suspense } from "react";
import ArchivesListHeader from "./components/ArchiveListHeaderComponent";
import "./index.css";
import ArchiveListTableBodyComponent from "./components/ArchiveListTableBodyComponent/ArchiveListTableBodyComponent";
import ArchiveListHeaderComponent from "./components/ArchiveListTableHeaderComponent/ArchiveListTableHeaderComponent";
import FullPageLoader from "../../shared/components/loaders/FullPageLoader";
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import { Page, PageSize, PaginationState } from "./state/pagination";

export default function Archive(): React.ReactElement {
  const pagination = useRecoilValue(PaginationState);
  const setPage = useSetRecoilState(Page);

  const onPageSizeChange = useRecoilCallback(({ set, reset }) => (pageSize: number) => {
    set(PageSize, pageSize);
    reset(Page);
  });

  return (
    <div className="column">
      <ArchivesListHeader />
      <Suspense fallback={<FullPageLoader />}>
        <div className="archiveList-table">
          <Card>
            <DataTable>
              <ArchiveListHeaderComponent />
              <ArchiveListTableBodyComponent />
              <TableFoot>
                <DataTableRow>
                  <DataTableCell colSpan="6">
                    <div className="paginationCell">
                      <Pagination
                        onPageChange={setPage}
                        onPageSizeChange={onPageSizeChange}
                        page={pagination.page}
                        pageCount={pagination.pageCount}
                        pageSize={pagination.pageSize}
                        total={pagination.total}
                      />
                    </div>
                  </DataTableCell>
                </DataTableRow>
              </TableFoot>
            </DataTable>
          </Card>
        </div>
      </Suspense>
    </div>
  );
}
