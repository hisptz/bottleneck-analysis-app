import { find, last } from "lodash";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Legend } from "../../../../../../../shared/interfaces/interventionConfig";
import { InterventionStateSelector } from "../../../../../state/intervention";
import { generateCellColor } from "../../../utils";
import classes from "../Table.module.css";

export default function TableCell({ id, colId, data, legends }: { id: string; colId: string; data: any; legends: Array<Legend> }) {
  const { id: interventionId } = useParams<{ id: string }>();
  const value: string | undefined = useMemo(() => last(find(data, (value) => value.includes(id) && value.includes(colId))), []);
  const legendDefinitions = useRecoilValue(
    InterventionStateSelector({
      id: interventionId,
      path: ["dataSelection", "legendDefinitions"],
    })
  );
  const color = useMemo(() => generateCellColor({ value, legends, legendDefinitions }), [value, legends]);
  return (
    <td style={{ background: color }} width={"100px"} className={classes["table-cell"]} align="center" key={`${colId}-cell`}>
      {value}
    </td>
  );
}
