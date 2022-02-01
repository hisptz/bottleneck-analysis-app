import { useAlert } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { getCenter } from "geolib";
import { flatten, flattenDeep } from "lodash";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { BoundaryData } from "../state/data";
import { convertCoordinates } from "../utils/map";

export default function useMapData() {
  const { id } = useParams<{ id: string }>();
  const data = useRecoilValue(BoundaryData(id));
  const { show } = useAlert(
    ({ message }) => message,
    ({ type }) => ({ ...type, duration: 3000 })
  );

  const sanitizedPoints = useMemo(() => {
    try {
      return data.map((area: { co: string; id: string }) => ({
        id: area.id,
        co: flatten(JSON.parse(area.co)).map((points: any) => {
          if (typeof points[0] === "number") {
            return convertCoordinates(points);
          }
          return points?.map(convertCoordinates);
        }),
      }));
    } catch (e: any) {
      console.error(e);
      show({
        message: i18n.t("Error parsing coordinates" + ": " + e?.message),
        type: { info: true },
      });
    }
  }, [data, show]);

  const center = useMemo(() => {
    const allPoints: Array<{ lat: number; lng: number }> = flattenDeep(sanitizedPoints.map((area: { co: any }) => area.co));
    const center = getCenter(allPoints) ?? {};
    if (center) {
      return { lat: center.latitude, lng: center.longitude };
    }
  }, [sanitizedPoints]);

  return {
    center,
    data: sanitizedPoints,
  };
}
