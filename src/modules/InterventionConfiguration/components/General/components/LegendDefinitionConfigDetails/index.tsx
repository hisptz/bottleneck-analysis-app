import { Field } from "@dhis2/ui";
import { CustomInput } from "@hisptz/react-ui";
import React from "react";
import "./LegendDefinitionConfig.css";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { InterventionDirtySelector } from "../../../../state/data";

export function LegendDefinitionConfigDetails() {
  const { id } = useParams<{ id: string }>();
  const [legendDefinitions, setLegendDefinitions] = useRecoilState(
    InterventionDirtySelector({
      id,
      path: ["dataSelection", "legendDefinitions"],
    })
  );

  const onChange = (index: number, value: any) => {
    setLegendDefinitions((prevState: any) => {
      const newState = [...prevState];
      newState[index].value = value;
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
              onChange: ({ value }) => onChange(index, value),
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
