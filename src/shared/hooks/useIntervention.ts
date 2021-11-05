import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { InterventionState } from "../../modules/Intervention/state/intervention";
import { InterventionConfig } from "../interfaces/interventionConfig";

export default function useIntervention(): InterventionConfig {
  const { id } = useParams<{ id: string }>();
  return useRecoilValue<InterventionConfig>(InterventionState(id));
}
