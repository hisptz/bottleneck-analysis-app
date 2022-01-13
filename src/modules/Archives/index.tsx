import { Button, Card, colors, DataTable, IconArchive24, Pagination } from "@dhis2/ui";
import { Steps } from "intro.js-react";
import { isEmpty } from "lodash";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useHistory } from "react-router-dom";
import { useRecoilCallback, useRecoilState, useRecoilValueLoadable, useSetRecoilState } from "recoil";
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
      <Suspense fallback={<FullPageLoader />}>
        <ArchiveComponent />
      </Suspense>
    </ErrorBoundary>
  );
}

function ArchiveComponent(): React.ReactElement {
  const history = useHistory();
  const archives = useRecoilValueLoadable(Archives);
  const pagination = useRecoilValueLoadable(PaginationState);
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
    <div className="column archive-main-container h-100">
      <Steps options={STEP_OPTIONS} enabled={helpEnabled} steps={ARCHIVE_INTERVENTION_CONFIGURATION_HELP} onExit={onHelpExit} initialStep={0} />
      <ArchivesListHeader />
      <Suspense fallback={<FullPageLoader />}>
        <div className="archiveList-table">
          {archives.state === "loading" || pagination.state === "loading" ? <FullPageLoader /> : null}
          {archives.state === "hasError" && archives.contents.toString().includes("404") && (
            <div className="column w-100 h-100 center align-center gap">
              <span className="icon-72">
                <IconArchive24 color={colors.grey700} />
              </span>
              <h2 style={{ color: colors.grey800, margin: 0 }}>{i18n.t("There are currently no archived interventions")}</h2>
              <Button primary onClick={() => history.replace("/")}>
                {i18n.t("Back to Interventions")}
              </Button>
            </div>
          )}
          {archives.state === "hasValue" && isEmpty(archives.contents) && (
            <div className="column w-100 h-100 center align-center gap">
              <span className="icon-72">
                <IconArchive24 color={colors.grey700} />
              </span>
              <h2 style={{ color: colors.grey800, margin: 0 }}>{i18n.t("There are currently no archived interventions")}</h2>
              <Button primary onClick={() => history.replace("/")}>
                {i18n.t("Back to Interventions")}
              </Button>
            </div>
          )}
          {archives.state === "hasValue" && !isEmpty(archives.contents) && (
            <Card>
              <div className="column gap p-16">
                <div className="flex-1 h-100 archive-interventions">
                  <DataTable>
                    <ArchiveListHeaderComponent />
                    <ArchiveListTableBodyComponent />
                  </DataTable>
                </div>
                <div className="paginationCell">
                  <Pagination
                    onPageChange={setPage}
                    onPageSizeChange={onPageSizeChange}
                    page={pagination.contents.page}
                    pageCount={pagination.contents.pageCount}
                    pageSize={pagination.contents.pageSize}
                    total={pagination.contents.total}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </Suspense>
    </div>
  );
}
