import { Card, DataTable, DataTableCell, DataTableRow, Pagination, TableFoot } from "@dhis2/ui";
import React, { Suspense } from "react";
import ArchivesListHeader from "./components/ArchiveListHeaderComponent";
import "./index.css";
import ArchiveListTableBodyComponent from "./components/ArchiveListTableBodyComponent/ArchiveListTableBodyComponent";
import ArchiveListHeaderComponent from "./components/ArchiveListTableHeaderComponent/ArchiveListTableHeaderComponent";
import FullPageLoader from "../../shared/components/loaders/FullPageLoader";

export default function Archive(): React.ReactElement {
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
                        align={"end"}
                        hidePageSelect
                        hidePageSizeSelect
                        onPageChange={() => {}}
                        onPageSizeChange={() => {}}
                        page={3}
                        pageCount={4}
                        pageSize={4}
                        total={8}
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
