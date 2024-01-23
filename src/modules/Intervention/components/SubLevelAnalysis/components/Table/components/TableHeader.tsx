import { DataTableColumnHeader, DataTableHead, DataTableRow } from "@dhis2/ui";
import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import classes from "../../../../../../../styles/Table.module.css";
import { TableConfig } from "../../../state/layout";
import {
	flexRender,
	getCoreRowModel,
	getGroupedRowModel,
	useReactTable,
} from "@tanstack/react-table";

export default function TableHeader(): React.ReactElement {
	const { id } = useParams<{ id: string }>();
	const tableConfig = useRecoilValue(TableConfig(id));
	const { getHeaderGroups } = useReactTable<Record<string, any>>({
		columns: tableConfig?.columns ?? [],
		data: tableConfig?.data ?? [],
		getCoreRowModel: getCoreRowModel(),
		getGroupedRowModel: getGroupedRowModel(),
		getSubRows: (row) => {
			return row.items;
		},
		enableGrouping: true,
	});

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
										column.getContext
								  )}
						</DataTableColumnHeader>
					))}
				</DataTableRow>
			))}
		</DataTableHead>
	);
}
