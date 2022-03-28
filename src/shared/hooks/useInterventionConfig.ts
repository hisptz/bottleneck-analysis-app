import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { InterventionState } from "../../modules/Intervention/state/intervention";
import { InterventionConfig } from "../interfaces/interventionConfig";

export default function useInterventionConfig(): InterventionConfig {
  const { id } = useParams<{ id: string }>();
  return <InterventionConfig>useRecoilValue<InterventionConfig | undefined>(InterventionState(id));
}
