import React, { useMemo } from "react";
import { Map as CustomMap } from "@hisptz/react-ui";
import useInterventionConfig from "../../../../../../shared/hooks/useInterventionConfig";
import CardError from "../../../../../../shared/components/errors/CardError";
import i18n from "@dhis2/d2-i18n";
import {  CustomThematicPrimitiveLayer } from "@hisptz/react-ui/build/types/components/Map/components/MapLayer/interfaces";
import { useRecoilValue } from "recoil";
import { SubLevelOrgUnit } from "../../state/dimensions";
import { useParams } from "react-router-dom";
import { InterventionPeriodState } from "../../../../state/selections";
import { getOrgUnitSelectionFromOrgUnitList } from "./utils/map";


export default function Map() {
  const { id } = useParams<{ id: string }>();
  const { map } = useInterventionConfig();
  const periodSelection = useRecoilValue(InterventionPeriodState(id));

  const subLevelOrgUnit = useRecoilValue(SubLevelOrgUnit(id));

  const orgUnitSelection = useMemo(() => getOrgUnitSelectionFromOrgUnitList(subLevelOrgUnit), [subLevelOrgUnit]);

  if (!map?.enabled) {
    return (
      <div>
        <CardError error={{ message: i18n.t("Map is disabled for this intervention") }} />
      </div>
    );
  }

  const { coreLayers } = map ?? {};
  const thematicLayers: CustomThematicPrimitiveLayer[] = coreLayers.thematicLayers.map(layer => {
    return {
      id: layer.indicator,
      type: layer.type,
      enabled: layer.enabled,
      control: {
        enabled: true,
        position: "topright"
      },
      dataItem: {
        id: layer.indicator,
        type: "indicator",
        displayName: layer.indicator,
        legendConfig: {
          scale: 5,
          colorClass: "YlGn"
        }
      }
    };
  });

  const facilityLayer = {
    ...coreLayers.facilityLayer,
  }

  return <CustomMap
    legends={{
      enabled: true,
      position: "topright",
      collapsible: false
    }}
    orgUnitSelection={orgUnitSelection}
    thematicLayers={thematicLayers}
    boundaryLayer={coreLayers.boundaryLayer}
    pointLayer={coreLayers.facilityLayer}
    periodSelection={{
      periods: [periodSelection]
    }}
  />;
}
