import { Field } from "@dhis2/ui";
import { CustomInput } from "@hisptz/react-ui";
import React from "react";
import "./LegendDefinitionConfig.css";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { InterventionDirtySelector } from "../../../../state/data";
import { cloneDeep } from "lodash";

export function LegendDefinitionConfigDetails(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [legendDefinitions, setLegendDefinitions] = useRecoilState(
    InterventionDirtySelector({
      id,
      path: ["dataSelection", "legendDefinitions"],
    })
  );

  const onChange = (index: number, value: any) => {
    setLegendDefinitions((prevState: any) => {
      const newState = cloneDeep(prevState);
      newState[index] = value;
      return newState;
    });
  };

  return (
    <div className="legend-definition-config">
      <Field>
        {legendDefinitions?.map((legendDefinition: { name: any }, index: number) => (
          <CustomInput
            key={`${legendDefinition.name}-legendDefinitionConfig`}
            input={{
              onChange: (value) => onChange(index, value),
              value: legendDefinition,
              name: legendDefinition.name,
            }}
            valueType={"LEGEND_DEFINITION"}
          />
        ))}
      </Field>
    </div>
  );
}
