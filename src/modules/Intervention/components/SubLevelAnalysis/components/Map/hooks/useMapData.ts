import { getBounds, getCenter } from "geolib";
import { LatLngTuple } from "leaflet";
import { flattenDeep } from "lodash";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { BoundaryData } from "../state/data";

export default function useMapData() {
  const { id } = useParams<{ id: string }>();
  const data = useRecoilValue(BoundaryData(id));

  const center = useMemo(() => {
    const allPoints: Array<{ lat: number; lng: number }> = flattenDeep(data?.map((area: { co: any }) => area.co));
    const center = getCenter(allPoints) ?? {};
    if (center) {
      return { lat: center.latitude, lng: center.longitude };
    }
  }, [data]);

  const bounds: Array<LatLngTuple> = useMemo(() => {
    const allPoints: Array<{ lat: number; lng: number }> = flattenDeep(data?.map((area: { co: any }) => area.co));
    const { minLat, maxLat, minLng, maxLng } = getBounds(allPoints);
    return [
      [minLat, minLng],
      [maxLat, maxLng],
    ];
  }, [data]);

  return {
    center,
    data: data,
    bounds,
  };
}
