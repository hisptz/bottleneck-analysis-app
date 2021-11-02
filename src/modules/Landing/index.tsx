import { head } from "lodash";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { DashboardConfig } from "../../shared/types/dashboardConfig";
import { DashboardsState } from "../Dashboard/state/dashboard";

export default function Landing() {
  const history = useHistory();
  const dashboard = useRecoilValue(DashboardsState);

  useEffect(() => {
    function navigate() {
      if (dashboard) {
        const firstDashboard: DashboardConfig | undefined = head(dashboard);
        if (firstDashboard) {
          history.replace(`/dashboards/${firstDashboard?.id}`);
        }
      }
    }
    navigate();
  }, [dashboard]);

  return <div className="w-100 h-100 column center align-center">Loading...</div>;
}
