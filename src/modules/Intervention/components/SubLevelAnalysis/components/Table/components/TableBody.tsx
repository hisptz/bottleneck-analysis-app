import { DataTableBody, TableRow } from "@dhis2/ui";
import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { TableConfig } from "../../../state/layout";
import CustomTableCell from "./CustomTableCell";
import {
	getCoreRowModel,
	getGroupedRowModel,
	useReactTable,
} from "@tanstack/react-table";

export default function TableBody(): React.ReactElement {
	const { id } = useParams<{ id: string }>();
	const { columns, data, rowState } = useRecoilValue(TableConfig(id)) ?? {};

	const { getGroupedRowModel: getRowModel } = useReactTable<
		Record<string, any>
	>({
		columns: columns ?? [],
		data: data ?? [],
		getCoreRowModel: getCoreRowModel(),
		getGroupedRowModel: getGroupedRowModel(),
		getSubRows: (row) => {
			return row.items;
		},
		initialState: {
			rowState: {
				...rowState,
			},
		} as any,
	});
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
