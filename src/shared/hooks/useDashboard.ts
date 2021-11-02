import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { DashboardState } from "../../modules/Dashboard/state/dashboard";
import { DashboardConfig } from "../types/dashboardConfig";

export default function useDashboardConfig(): DashboardConfig {
  const { id } = useParams<{ id: string }>();
  return useRecoilValue<DashboardConfig>(DashboardState(id));
}
