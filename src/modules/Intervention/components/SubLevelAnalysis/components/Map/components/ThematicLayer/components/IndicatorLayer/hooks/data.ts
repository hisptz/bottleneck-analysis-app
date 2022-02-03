import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { MapIndicatorSelector } from "../../../../../state/config";
import { MapIndicatorData } from "../../../../../state/data";

export default function useMapIndicatorData(indicatorId: string) {
  const { id: interventionId } = useParams();
  const data = useRecoilValue(MapIndicatorData(interventionId));
  const indicator = useRecoilValue(MapIndicatorSelector({ id: interventionId, indicatorId: indicatorId }));
  const indicatorData = data[indicatorId];

  return {
    indicator,
    data: indicatorData,
  };
}
