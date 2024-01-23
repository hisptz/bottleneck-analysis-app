import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import classes from "../../../../../../../styles/Table.module.css";
import { InterventionStateSelector } from "../../../../../state/intervention";
import { Cell, flexRender } from "@tanstack/react-table";
import { get } from "lodash";
import { generateCellColor } from "../../../utils";
import { getTextColorFromBackgroundColor } from "../../../../../../../shared/utils/generators";

export default function CustomTableCell({
	cell,
}: {
	cell: Cell<Record<string, any>, any>;
}): React.ReactElement | null {
	const { id: interventionId } = useParams<{ id: string }>();
	const row = cell.row;

	const state = cell.getContext().table.getState()?.rowState;

	const cellState =
		get(state, [cell.column.id, row.original.itemId]) ??
		get(state, [row.original.itemId, cell.column.id]);

	const legends = cellState?.legends;

	const rowSpan = cell.column.id === "group" ? row.original?.span : undefined;

	const value = cell.getValue();
	const legendDefinitions = useRecoilValue(
		InterventionStateSelector({
			id: interventionId,
			path: ["dataSelection", "legendDefinitions"],
		})
	);
	const displayValue = isNaN(parseFloat(value as string))
		? value
		: parseFloat(value as string);
	const backgroundColor = useMemo(
		() => generateCellColor({ value, legends, legendDefinitions }),
		[value, legends, legendDefinitions]
	);

	const color = getTextColorFromBackgroundColor(backgroundColor);

	if (!cell.getValue()) {
		// console.log(rowSpan);
		return null;
	}

	return (
		<td
			className={classes["table-cell"]}
			align="center"
			key={`${cell.id}-cell`}
			rowSpan={rowSpan}
			style={{ background: backgroundColor, color }}
		>
			{flexRender(cell.column.columnDef.cell, cell.getContext())}
		</td>
	);
}
