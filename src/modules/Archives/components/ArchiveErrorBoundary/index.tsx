import i18n from "@dhis2/d2-i18n";
import { Button, Card, colors, DataTable, DataTableCell, DataTableRow, IconArchive24, Pagination, TableFoot } from "@dhis2/ui";
import { Steps } from "intro.js-react";
import { isEmpty } from "lodash";
import React, { Suspense } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ARCHIVE_INTERVENTION_CONFIGURATION_HELP } from "../../../../constants/help/Intervention";
import { STEP_OPTIONS } from "../../../../constants/help/options";
import FullPageLoader from "../../../../shared/components/loaders/FullPageLoader";
import HelpState from "../../../Intervention/state/help";
import { Archives } from "../../state/data";
import { Page, PageSize, PaginationState } from "../../state/pagination";
import ArchivesListHeader from "../ArchiveListHeader";
import ArchiveListTableBodyComponent from "../ArchiveListTableBody/ArchiveListTableBodyComponent";
import ArchiveListHeaderComponent from "../ArchiveListTableHeader/ArchiveListTableHeaderComponent";

export default function ArchiveErrorBoundary(): React.ReactElement {
  const archives = useRecoilValue(Archives);
  const pagination = useRecoilValue(PaginationState);
  const setPage = useSetRecoilState(Page);
  const [helpEnabled, setHelpEnabled] = useRecoilState(HelpState);
  const history = useHistory();
  const onHelpExit = () => {
    setHelpEnabled(false);
  };

  const onPageSizeChange = useRecoilCallback(({ set, reset }) => (pageSize: number) => {
    set(PageSize, pageSize);
    reset(Page);
  });

  const emptyList = isEmpty(archives);

  if (emptyList) {
    return (
      <div className="column w-100 h-100 center align-center gap">
        <span className="icon-72">
          <IconArchive24 color={colors.grey700} />
        </span>
        <h2 style={{ color: colors.grey800, margin: 0 }}>{i18n.t("There are currently no archived interventions")}</h2>
        <Button primary onClick={() => history.replace("/")}>
          {i18n.t("Back To Interventions")}
        </Button>
      </div>
    );
  }

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
