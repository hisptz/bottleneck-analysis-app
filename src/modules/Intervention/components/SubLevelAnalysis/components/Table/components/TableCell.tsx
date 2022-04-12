import { find, last } from "lodash";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Legend } from "../../../../../../../shared/interfaces/interventionConfig";
import classes from "../../../../../../../styles/Table.module.css";
import { InterventionStateSelector } from "../../../../../state/intervention";
import { generateCellColor } from "../../../utils";

export default function TableCell({ id, colId, data, legends }: { id: string; colId: string; data: any; legends: Array<Legend> }): React.ReactElement {
  const { id: interventionId } = useParams<{ id: string }>();
  const value: string | undefined = useMemo(() => last(find(data, (value) => value.includes(id) && value.includes(colId))), [colId, data, id]);
  const legendDefinitions = useRecoilValue(
    InterventionStateSelector({
      id: interventionId,
      path: ["dataSelection", "legendDefinitions"],
    })
  );

  const displayValue = isNaN(parseInt(value as string)) ? value : parseInt(value as string);
  const color = useMemo(() => generateCellColor({ value, legends, legendDefinitions }), [value, legends, legendDefinitions]);
  return (
    <td style={{ background: color }} width={"100px"} className={classes["table-cell"]} align="center" key={`${colId}-cell`}>
      {displayValue}
    </td>
  );
}
