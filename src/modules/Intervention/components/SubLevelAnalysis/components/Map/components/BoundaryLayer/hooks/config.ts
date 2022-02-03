import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { BoundaryMapLayer } from "../../../../../../../../../shared/interfaces/interventionConfig";
import { InterventionStateSelector } from "../../../../../../../state/intervention";

export default function useBoundaryConfig(): BoundaryMapLayer {
  const { id } = useParams();
  return useRecoilValue(InterventionStateSelector({ id, path: ["map", "coreLayers", "boundaryLayer"] }));
}
