import { DataTableColumnHeader, DataTableHead, DataTableRow } from "@dhis2/ui";
import React from "react";
import classes from "../../../../../../../styles/Table.module.css";
import { flexRender } from "@tanstack/react-table";
import { useSubLevelAnalysisTable } from "../../../hooks/table";

export default function TableHeader(): React.ReactElement {
	const { getHeaderGroups } = useSubLevelAnalysisTable();

	const headerGroups = getHeaderGroups();

	return (
		<DataTableHead>
			{headerGroups.map((headerGroup) => (
				<DataTableRow>
					{headerGroup.headers.map((column) => (
						<DataTableColumnHeader
							key={column.id}
							className={classes["table-data-header-cell"]}
							colSpan={`${column.colSpan}`}
						>
							{column.isPlaceholder
								? null
								: flexRender(
										column.column.columnDef.header,
										column.getContext(),
									)}
						</DataTableColumnHeader>
					))}
				</DataTableRow>
			))}
		</DataTableHead>
	);
}
