import React, { useMemo } from "react";
import { Map as CustomMap } from "@hisptz/react-ui";
import useInterventionConfig from "../../../../../../shared/hooks/useInterventionConfig";
import CardError from "../../../../../../shared/components/errors/CardError";
import i18n from "@dhis2/d2-i18n";
import { ThematicLayerConfig } from "@hisptz/react-ui/build/types/components/Map/components/MapLayer/interfaces";
import { useRecoilValue } from "recoil";
import { SubLevelOrgUnit } from "../../state/dimensions";
import { useParams } from "react-router-dom";
import { InterventionPeriodState } from "../../../../state/selections";
import { LastOrgUnitLevel } from "../../../../../../core/state/orgUnit";
import { getOrgUnitSelectionFromOrgUnitList } from "./utils/map";


export default function Map() {
  const { id } = useParams<{ id: string }>();
  const { map } = useInterventionConfig();
  const periodSelection = useRecoilValue(InterventionPeriodState(id));
  const facilityLevel = useRecoilValue(LastOrgUnitLevel);

  const subLevelOrgUnit = useRecoilValue(SubLevelOrgUnit(id));

  const orgUnitSelection = useMemo(() => getOrgUnitSelectionFromOrgUnitList(subLevelOrgUnit), [subLevelOrgUnit]);


  if (!map?.enabled) {
    return (
      <div>
        <CardError error={{ message: i18n.t("Map is disabled for this intervention") }} />
      </div>
    );
  }

  const lastLevelSelected = orgUnitSelection.levels?.includes((facilityLevel?.level.toString() ?? ""));

  const { coreLayers, earthEngineLayers } = map ?? {};
  const thematicLayers: ThematicLayerConfig[] = coreLayers.thematicLayers.map((layer) => ({
    ...layer, control: {
      enabled: true,
      position: "topright"
    }
  }));
  return <CustomMap
    controls={[
      {
        type: "scale",
        position: "bottomleft",
        options: {
          imperial: false,
          metric: true
        }
      }, {
        type: "compass",
        position: "bottomleft"
      }
    ]}
    legends={{
      enabled: true,
      position: "topright",
      collapsible: true
    }}
    orgUnitSelection={lastLevelSelected ? { ...orgUnitSelection, levels: [] } : orgUnitSelection}
    thematicLayers={lastLevelSelected ? [] : thematicLayers}
    earthEngineLayers={earthEngineLayers?.map(layer => ({ ...layer, id: layer.type }))}
    boundaryLayer={coreLayers.boundaryLayer}
    pointLayer={{
      ...coreLayers.facilityLayer,
      label: i18n.t("Facilities"),
      level: facilityLevel?.level
    }}
    periodSelection={{
      periods: [periodSelection.id]
    }}

  />;
}
