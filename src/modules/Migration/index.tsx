import { useAlert } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { CircularLoader, LinearLoader } from "@dhis2/ui";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilRefresher_UNSTABLE } from "recoil";
import { InterventionSummary } from "../../core/state/intervention";
import useMigrate from "./hooks/useMigrate";

export default function Migration(): React.ReactElement {
  const history = useHistory();
  const resetSummary = useRecoilRefresher_UNSTABLE(InterventionSummary);

  const onComplete = () => {
    resetSummary();
    history.replace("/");
  };

  const { error, progress, totalMigration } = useMigrate(onComplete);

  const { show } = useAlert(
    ({ message }) => message,
    ({ type }) => ({ ...type, duration: 3000 })
  );

  useEffect(() => {
    if (error) {
      show({
        message: error.message ?? i18n.t("Something went wrong with the migration"),
        type: { info: true },
      });
    }
  }, [error]);

  return (
    <div className="column w-100 h-100 center align-center">
      {totalMigration ? (
        <>
          <LinearLoader amount={(progress / totalMigration) * 100} width={"300px"} />
          <p style={{ margin: 4 }}>{i18n.t("Migrating configurations...")}</p>
        </>
      ) : (
        <>
          <CircularLoader small />
          <p style={{ margin: 4 }}>{i18n.t("Performing some housekeeping. Please wait...")}</p>
        </>
      )}
    </div>
  );
}
