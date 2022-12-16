import { useFormContext } from "react-hook-form";
import { useCallback } from "react";
import { resetLegends } from "../utils";
import { LegendDefinition } from "../../../../../../../shared/interfaces/interventionConfig";

export default function useResetLegends() {
  const { watch, setValue } = useFormContext();
  const determinants = watch("dataSelection.groups");

  const shouldVerify = determinants?.length > 0;
  const onResetLegends = useCallback((legendDefinitions: LegendDefinition[]) => {
    const newDeterminants = resetLegends(determinants, legendDefinitions);
    setValue("dataSelection.groups", newDeterminants);
  }, []);

  return {
    onResetLegends,
    shouldVerify,
  };
}
