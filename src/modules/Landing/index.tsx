import { head } from "lodash";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { OldInterventionConfig } from "../../shared/interfaces/oldInterventionConfig";
import { DashboardsState } from "../Intervention/state/dashboard";

export default function Landing() {
  const history = useHistory();
  const dashboard = useRecoilValue(DashboardsState);

  useEffect(() => {
    function navigate() {
      if (dashboard) {
        const firstDashboard: OldInterventionConfig | undefined = head(dashboard);
        if (firstDashboard) {
          history.replace(`/dashboards/${firstDashboard?.id}`);
        }
      }
    }

    navigate();
  }, [dashboard]);

  return <div className="w-100 h-100 column center align-center">Loading...</div>;
}
