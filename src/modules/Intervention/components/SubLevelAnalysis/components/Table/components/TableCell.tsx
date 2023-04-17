import { find, last } from "lodash";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Legend } from "../../../../../../../shared/interfaces/interventionConfig";
import classes from "../../../../../../../styles/Table.module.css";
import { InterventionStateSelector } from "../../../../../state/intervention";
import { generateCellColor } from "../../../utils";

export default function TableCell({
  colId,
  value,
  legends,
  rowSpan,
}: {
  colId: string;
  value: any;
  legends: Array<Legend>;
  rowSpan: number;
}): React.ReactElement {
  const { id: interventionId } = useParams<{ id: string }>();
  const legendDefinitions = useRecoilValue(
    InterventionStateSelector({
      id: interventionId,
      path: ["dataSelection", "legendDefinitions"],
    })
  );

  const displayValue = isNaN(parseFloat(value as string)) ? value : parseFloat(value as string);
  const color = useMemo(() => generateCellColor({ value, legends, legendDefinitions }), [value, legends, legendDefinitions]);
  return (
    <td rowSpan={rowSpan} style={{ background: color }} width={"100px"} className={classes["table-cell"]} align="center" key={`${colId}-cell`}>
      {displayValue}
    </td>
  );
}
