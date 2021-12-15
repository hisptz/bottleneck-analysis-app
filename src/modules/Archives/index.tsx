import { Card, DataTable, DataTableCell, DataTableRow, Pagination, TableFoot } from "@dhis2/ui";
import { Steps } from "intro.js-react";
import React, { Suspense } from "react";
import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ARCHIVE_INTERVENTION_CONFIGURATION_HELP } from "../../constants/help/Intervention";
import { STEP_OPTIONS } from "../../constants/help/options";
import FullPageLoader from "../../shared/components/loaders/FullPageLoader";
import HelpState from "../Intervention/state/help";
import ArchivesListHeader from "./components/ArchiveListHeader";
import "./index.css";
import ArchiveListTableBodyComponent from "./components/ArchiveListTableBody/ArchiveListTableBodyComponent";
import ArchiveListHeaderComponent from "./components/ArchiveListTableHeader/ArchiveListTableHeaderComponent";
import { Page, PageSize, PaginationState } from "./state/pagination";

export default function Archive(): React.ReactElement {
  const pagination = useRecoilValue(PaginationState);
  const setPage = useSetRecoilState(Page);
  const [helpEnabled, setHelpEnabled] = useRecoilState(HelpState);

  const onHelpExit = () => {
    setHelpEnabled(false);
  };

  const onPageSizeChange = useRecoilCallback(({ set, reset }) => (pageSize: number) => {
    set(PageSize, pageSize);
    reset(Page);
  });

  return (
    <div className="column archive-interventions">
      <Steps options={STEP_OPTIONS} enabled={helpEnabled} steps={ARCHIVE_INTERVENTION_CONFIGURATION_HELP} onExit={onHelpExit} initialStep={0} />
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
