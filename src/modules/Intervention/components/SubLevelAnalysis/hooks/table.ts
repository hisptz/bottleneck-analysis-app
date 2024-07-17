import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { TableConfig } from "../state/layout";
import {
	getCoreRowModel,
	getGroupedRowModel,
	useReactTable,
} from "@tanstack/react-table";

export function useSubLevelAnalysisTable() {
	const { id } = useParams<{ id: string }>();
	const { columns, data, rowState } = useRecoilValue(TableConfig(id)) ?? {};

	return useReactTable<Record<string, any>>({
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
}
