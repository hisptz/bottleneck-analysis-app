import { DataTableBody, TableRow } from "@dhis2/ui";
import React from "react";
import CustomTableCell from "./CustomTableCell";
import { useSubLevelAnalysisTable } from "../../../hooks/table";

export default function TableBody(): React.ReactElement {
	const { getRowModel } = useSubLevelAnalysisTable();
	const rows = getRowModel().flatRows;

	return (
		<DataTableBody>
			{rows.map((row) => {
				return (
					<TableRow key={row.id}>
						{row.getVisibleCells().map((cell) => {
							return <CustomTableCell cell={cell} />;
						})}
					</TableRow>
				);
			})}
		</DataTableBody>
	);
}
