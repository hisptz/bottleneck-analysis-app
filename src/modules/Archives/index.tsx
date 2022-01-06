import { Button, Card, colors, DataTable, IconArchive24, Pagination } from "@dhis2/ui";
import { Steps } from "intro.js-react";
import { isEmpty } from "lodash";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useHistory } from "react-router-dom";
import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ARCHIVE_INTERVENTION_CONFIGURATION_HELP } from "../../constants/help/Intervention";
import { STEP_OPTIONS } from "../../constants/help/options";
import FullPageLoader from "../../shared/components/loaders/FullPageLoader";
import HelpState from "../Intervention/state/help";
import ArchivesListHeader from "./components/ArchiveListHeader";
import "./index.css";
import ArchiveListTableBodyComponent from "./components/ArchiveListTableBody/ArchiveListTableBodyComponent";
import ArchiveListHeaderComponent from "./components/ArchiveListTableHeader/ArchiveListTableHeaderComponent";
import NoArchivesFound from "./components/NoArchivesFound";
import { Archives } from "./state/data";
import { Page, PageSize, PaginationState } from "./state/pagination";
import i18n from "@dhis2/d2-i18n";

export default function Archive(): React.ReactElement {
  return (
    <ErrorBoundary FallbackComponent={NoArchivesFound}>
      <ArchiveComponent />
    </ErrorBoundary>
  );
}

function ArchiveComponent(): React.ReactElement {
  const history = useHistory();
  const archives = useRecoilValue(Archives);
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

  const emptyList = isEmpty(archives);

  if (emptyList) {
    return (
      <div className="column w-100 h-100 center align-center gap archive-main-container">
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
    <div className="column archive-main-container h-100">
      <Steps options={STEP_OPTIONS} enabled={helpEnabled} steps={ARCHIVE_INTERVENTION_CONFIGURATION_HELP} onExit={onHelpExit} initialStep={0} />
      <ArchivesListHeader />
      <Suspense fallback={<FullPageLoader />}>
        <div className="archiveList-table">
          <Card>
            <div className="column gap p-16">
              <div className="flex-1 h-100">
                <DataTable>
                  <ArchiveListHeaderComponent />
                  <ArchiveListTableBodyComponent />
                </DataTable>
              </div>
              <Pagination
                onPageChange={setPage}
                onPageSizeChange={onPageSizeChange}
                page={pagination.page}
                pageCount={pagination.pageCount}
                pageSize={pagination.pageSize}
                total={pagination.total}
              />
            </div>
          </Card>
        </div>
      </Suspense>
    </div>
  );
}
