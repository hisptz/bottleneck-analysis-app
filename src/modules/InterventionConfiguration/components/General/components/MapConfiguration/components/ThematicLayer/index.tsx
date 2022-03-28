import React, { useCallback, useState } from "react";
import "./styles/thematic-config.css";
import { Button, CheckboxField, colors, Field, IconWarning16, Tag } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import { useRecoilValueLoadable } from "recoil";
import { IndicatorState } from "../../../../../../../../core/state/data";
import { DataItem, ThematicLayerType, ThematicMapLayer } from "../../../../../../../../shared/interfaces/interventionConfig";
import IndicatorSelectorModal from "./components/IndicatorSelectorModal";
import { compact, findIndex, head, isEmpty } from "lodash";

function SingleThematicLayerConfig({
  type,
  value,
  onChange,
  error,
}: {
  type: ThematicLayerType;
  value: ThematicMapLayer;
  error?: FieldError;
  onChange: (newValue: ThematicMapLayer) => void;
}) {
  const [openDataSelector, setOpenDataSelector] = useState(false);
  const indicatorState = useRecoilValueLoadable(IndicatorState(value?.indicator));
  const onUpdate = useCallback(
    (selectedIndicators: Array<DataItem>) => {
      const newValue = { ...value, indicator: head(selectedIndicators)?.id ?? "" };
      onChange(newValue);
      setOpenDataSelector(false);
    },
    [onChange, value]
  );

  const onEnableToggle = useCallback(
    ({ checked }: { checked: boolean }) => {
      onChange({ ...value, enabled: checked });
    },
    [onChange, value]
  );

  return (
    <div className="h-100">
      <Field fullWidth error={!!error} validationText={error?.message}>
        <div style={error ? { borderColor: colors.red600 } : {}} className="thematic-config-card">
          <div className="row space-between align-center">
            <h4 className="thematic-config-card-header">{type === "choropleth" ? i18n.t("Choropleth Layer") : i18n.t("Bubble Layer")}</h4>
            <CheckboxField checked={value?.enabled} onChange={onEnableToggle} />
          </div>
          {value?.enabled && (
            <>
              <div className="row gap-8 space-between align-center">
                <div className="column gap-8">
                  <div className="row gap align-center">
                    <b style={{ fontSize: 14 }}>{i18n.t("Indicator")}: </b>
                    {value?.indicator && <Tag>{indicatorState?.contents?.displayName}</Tag>}
                  </div>
                  {indicatorState.state === "hasValue" && isEmpty(indicatorState.contents?.legendSets) ? (
                    <div style={{ fontSize: 12, color: colors.yellow800, alignItems: "center" }} className="gap-4 row">
                      <IconWarning16 />
                      {i18n.t("This indicator has no configured legends")}
                    </div>
                  ) : null}
                </div>
                <Button onClick={() => setOpenDataSelector(true)}>{value?.indicator ? i18n.t("Update") : i18n.t("Select")}</Button>
              </div>

              {openDataSelector && (
                <IndicatorSelectorModal
                  onUpdate={onUpdate}
                  onClose={() => setOpenDataSelector(false)}
                  hide={!openDataSelector}
                  selected={compact([indicatorState?.contents])}
                />
              )}
            </>
          )}
        </div>
      </Field>
    </div>
  );
}

export default function ThematicLayerConfig() {
  const { getValues } = useFormContext();
  const thematicLayers = getValues("map.coreLayers.thematicLayers") as Array<ThematicMapLayer>;
  const choroplethIndex = findIndex(thematicLayers, { type: "choropleth" });
  const bubbleIndex = findIndex(thematicLayers, { type: "bubble" });

  return (
    <Field label={i18n.t("Thematic Layers")}>
      <div style={{ whiteSpace: "normal" }} className="row wrap gap h-100">
        <Controller
          rules={{
            validate: (value) => {
              if (value.enabled && !value.indicator) {
                return i18n.t("Please select an indicator");
              }
              return true;
            },
          }}
          render={({ field, fieldState }) => {
            return <SingleThematicLayerConfig {...field} {...fieldState} error={fieldState.error} type={"choropleth"} />;
          }}
          name={`map.coreLayers.thematicLayers.${choroplethIndex}`}
        />
        <Controller
          rules={{
            validate: (value) => {
              if (value.enabled && !value.indicator) {
                return i18n.t("Please select an indicator");
              }
              return true;
            },
          }}
          render={({ field, fieldState }) => {
            return <SingleThematicLayerConfig {...field} {...fieldState} type={"bubble"} />;
          }}
          name={`map.coreLayers.thematicLayers.${bubbleIndex}`}
        />
      </div>
    </Field>
  );
}
