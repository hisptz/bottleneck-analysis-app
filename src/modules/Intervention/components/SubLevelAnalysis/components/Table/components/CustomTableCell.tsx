import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import classes from "../../../../../../../styles/Table.module.css";
import { InterventionStateSelector } from "../../../../../state/intervention";
import { Cell, flexRender } from "@tanstack/react-table";
import { generateCellColor } from "../../../utils";
import { getTextColorFromBackgroundColor } from "../../../../../../../shared/utils/generators";
import {
	DataItem,
	Group,
} from "../../../../../../../shared/interfaces/interventionConfig";
import { find } from "lodash";

function getDataItem(
	determinants: Group[],
	dataItemId: string
): DataItem | undefined {
	const dataItems = determinants.map(({ items }) => items).flat();
	return find<DataItem>(dataItems, ["id", dataItemId]);
}

export default function CustomTableCell({
	cell,
}: {
	cell: Cell<Record<string, any>, any>;
}): React.ReactElement | null {
	const { id: interventionId } = useParams<{ id: string }>();
	const row = cell.row;

	const rowSpan = cell.column.id === "group" ? row.original?.span : undefined;

	const value = cell.getValue();
	const legendDefinitions = useRecoilValue(
		InterventionStateSelector({
			id: interventionId,
			path: ["dataSelection", "legendDefinitions"],
		})
	);
	const determinants = useRecoilValue(
		InterventionStateSelector({
			id: interventionId,
			path: ["dataSelection", "groups"],
		})
	);

	const dataItem = getDataItem(
		determinants,
		row.original.itemId ?? cell.column.id
	);

	const legends = dataItem?.legends ?? [];

	const backgroundColor = useMemo(
		() => generateCellColor({ value, legends, legendDefinitions }),
		[value, legends, legendDefinitions]
	);

	const color = getTextColorFromBackgroundColor(backgroundColor);

	if (!cell.getValue()) {
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
