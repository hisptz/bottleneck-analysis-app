import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { InterventionStateSelector } from "../../../../../../../state/intervention";

export default function useThematicLayerConfig() {
  const { id } = useParams();
  return useRecoilValue(InterventionStateSelector({ id, path: ["map", "coreLayers", "thematicLayers"] }));
}