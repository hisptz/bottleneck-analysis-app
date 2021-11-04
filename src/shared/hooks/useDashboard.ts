import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { DashboardState } from "../../modules/Intervention/state/dashboard";
import { OldInterventionConfig } from "../interfaces/oldInterventionConfig";

export default function useDashboardConfig(): OldInterventionConfig {
  const { id } = useParams<{ id: string }>();
  return useRecoilValue<OldInterventionConfig>(DashboardState(id));
}
