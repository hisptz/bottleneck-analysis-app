import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { InterventionStateSelector } from "../../../../../../../state/intervention";
import { FacilityMapData } from "../state/config";

export default function useFacilityData() {
  const { id } = useParams();
  const data = useRecoilValue(FacilityMapData(id));
  const config = useRecoilValue(InterventionStateSelector({ id, path: ["map", "coreLayers", "facilityLayer"] })) ?? {};

  return { data, config };
}
