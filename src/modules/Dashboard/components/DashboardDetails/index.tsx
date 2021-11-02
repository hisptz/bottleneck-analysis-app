import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { DashboardConfig } from "../../../../shared/types/dashboardConfig";
import { DashboardState } from "../../state/dashboard";
import DashboardCard from "../DashboardCard";

export default function DashboardDetails() {
  const { id } = useParams<{ id: string }>();
  const dashboard = useRecoilValue<DashboardConfig>(DashboardState(id));

  return (
    <DashboardCard title={<h3 style={{ margin: 2, fontWeight: 500 }}>{dashboard.name}</h3>}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in finibus lacus, non imperdiet nulla. Suspendisse potenti. Nunc mattis finibus arcu, non
        mattis purus dapibus id. Donec eu ultrices lorem, at luctus sem. Etiam interdum dui eu sodales posuere. Nulla facilisi. Donec cursus commodo ex, ut
        sodales erat commodo non.
      </p>
    </DashboardCard>
  );
}
