import { PeriodInterface } from "@iapps/period-utilities";
import {
	compact,
	filter,
	find,
	findIndex,
	flattenDeep,
	fromPairs,
	head,
	isEmpty,
	last,
	mapValues,
	reduce,
	set,
	sum,
} from "lodash";
import { atomFamily, selectorFamily } from "recoil";
import { SystemSettingsState } from "../../../../../core/state/system";
import {
	Group,
	InterventionConfig,
	Legend,
} from "../../../../../shared/interfaces/interventionConfig";
import {
	Dimension,
	TableLayout as Layout,
} from "../../../../../shared/interfaces/layout";
import { InterventionState } from "../../../state/intervention";
import {
	InterventionOrgUnitState,
	InterventionPeriodState,
} from "../../../state/selections";
import { normalTableLayout } from "../constants/tableLayouts";
import { SubLevelAnalyticsData } from "./data";
import { Analytics } from "@hisptz/dhis2-utils";
import { Column, ColumnDef, createColumnHelper } from "@tanstack/react-table";
import i18n from "@dhis2/d2-i18n";
import { OrgUnit as OrgUnitType } from "../../../../../shared/interfaces/orgUnit";

export const TableLayout = atomFamily<Layout, string>({
	key: "sub-level-layout-state",
	default: () => normalTableLayout,
});

interface TableItem {
	id: string;
	name: string;
	children?: Array<TableItem>;
	legend?: Array<Legend>;
}

type TableConfigType = {
	columns: Array<ColumnDef<Record<string, any>>>;
	data: Record<string, any>[];
	rowState: Record<string, any>;
};

function getColumnsFromDimension({
	dimension,
	determinants,
	data,
	orgUnit,
}: {
	dimension: Dimension;
	determinants: Group[];
	data: Analytics;
	orgUnit: OrgUnitType;
}): ColumnDef<Record<string, any>>[] {
	if (dimension === "dx") {
		return compact(
			determinants.map(({ id: groupId, name, items }) => {
				const columnHelper = createColumnHelper<Record<string, any>>();
				if (isEmpty(items)) {
					return undefined;
				}

				const dataColumns = items.map(({ id, label }) => {
					return columnHelper.accessor(
						(originalRow) => originalRow[id],
						{
							id,
							header: label,
							enableGrouping: true,
						},
					);
				});
				return columnHelper.group({
					id: groupId,
					header: name,
					columns: [...dataColumns],
				});
			}),
		);
	} else {
		return (
			data.metaData?.dimensions[dimension]?.map((item) => {
				const itemConfig = (data.metaData?.items as any)?.[item];
				const columnHelper = createColumnHelper<Record<string, any>>();
				return columnHelper.accessor(
					(originalRow) => {
						return originalRow[item];
					},
					{
						id: item,
						header: itemConfig?.name,
					},
				) as Column<Record<string, any>>;
			}) ?? []
		);
	}
}

function getColumns({
	layout,
	data,
	determinants,
	orgUnit,
}: {
	layout: Layout;
	determinants: Group[];
	data: Analytics;
	orgUnit: OrgUnitType;
}): ColumnDef<Record<string, any>>[] {
	const { columns: dimensions, filter: filters, rows } = layout ?? {};
	const columnHelper = createColumnHelper<Record<string, any>>();

	const columns: Column<Record<string, any>>[] = reduce(
		dimensions,
		(acc, dimension) => {
			if (isEmpty(acc)) {
				return getColumnsFromDimension({
					dimension,
					data,
					determinants,
					orgUnit,
				});
			} else {
				return acc.map((column: Column<Record<string, any>>) => {
					const columnHelper =
						createColumnHelper<Record<string, any>>();

					return columnHelper.group({
						...column,
						columns: getColumnsFromDimension({
							dimension,
							data,
							determinants,
							orgUnit,
						}),
					});
				});
			}
		},
		[] as any,
	);

	const headerColumns: ColumnDef<Record<string, any>>[] = flattenDeep(
		rows.map((row) => {
			const itemConfig = (data.metaData?.items as any)?.[row];
			if (row === "dx") {
				//Should generate 2 columns, one for group and one for dataItem
				return [
					columnHelper.accessor(
						(originalRow) => {
							return originalRow?.group;
						},
						{
							id: `group`,
							header: i18n.t("Determinants"),
						},
					),
					columnHelper.accessor(
						(originalRow: any) => {
							return originalRow.dx;
						},
						{
							id: row,
							header: itemConfig?.name ?? "",
						},
					),
				];
			}
			return [
				columnHelper.accessor(
					(originalRow: Record<string, any>) => {
						return originalRow[row];
					},
					{
						id: row,
						header: itemConfig?.name ?? "",
					},
				),
			];
		}),
	);

	const averageColumn = columnHelper.accessor(
		(originalRow) => {
			const numberedColumns = compact(
				Object.values(
					mapValues(originalRow, (value, key) => {
						const numberValue = parseInt(value, 10);
						if (isNaN(numberValue)) {
							return;
						}
						return numberValue;
					}),
				),
			);

			const average = sum(numberedColumns) / numberedColumns.length;

			return Math.floor(average).toString();
		},
		{
			id: "average",
			header: "Average",
		},
	);

	const filterLabel = filters.map((dimension: Dimension) => {
		return data.metaData?.dimensions[dimension]?.map((itemId) => {
			return (data.metaData?.items as any)?.[itemId]?.name;
		});
	});

	return [
		{
			header: filterLabel.join(", "),
			id: filters.join(","),
			columns: [...headerColumns, ...columns, averageColumn] as Column<
				Record<string, any>
			>[],
		},
	];
}

function getData(
	data: Analytics,
	{ layout, determinants }: { layout: Layout; determinants: Group[] },
): {
	data: Record<string, any>[];
	rowState: Record<string, any>;
} {
	const valueIndex = findIndex(data.headers, ["name", "value"]);
	const rowState: Record<string, any> = {};

	if (head(layout.rows) === "dx") {
		//We have determinants as the rows.
		const rowData = determinants
			.map(({ id, items, name: groupName }) => {
				return items.map(({ id: dataItemId, name, legends }, index) => {
					set(rowState, [dataItemId, "legends"], [...legends]);
					const row = fromPairs([
						["id", dataItemId],
						["itemId", dataItemId],
						["dx", name],
						...(data.metaData?.dimensions?.[
							last(layout.columns) ?? "pe"
						]?.map((item: string) => {
							const value = filter(
								data.rows as unknown as string[][],
								(row) =>
									row.includes(dataItemId) &&
									row.includes(item),
							).reduce((acc, value) => {
								return acc + parseFloat(value[valueIndex]);
							}, 0) as number;
							return [item, value.toString()];
						}) ?? []),
					]);

					if (index === 0) {
						set(row, ["group"], groupName);
						set(row, ["span"], items.length);
					} else {
						set(rowState, [dataItemId], {});
					}
					return row;
				});
			})
			.flat();

		return {
			data: rowData,
			rowState,
		};
	} else {
		const rowData =
			(layout.rows
				.map((dimension) =>
					data.metaData?.dimensions?.[dimension]?.map((itemId) => {
						const itemName = (data.metaData?.items as any)?.[itemId]
							?.name;
						return fromPairs([
							["id", itemId],
							[dimension, itemName],
							...(data.metaData?.dimensions?.[
								last(layout.columns) ?? "pe"
							]?.map((item: string) => {
								const legends = find(
									flattenDeep(
										determinants.map(({ items }) => items),
									),
									["id", item],
								)?.legends;

								set(rowState, [itemId, item], { legends });
								const value = filter(
									data.rows as unknown as string[][],
									(row) =>
										row.includes(itemId) &&
										row.includes(item),
								).reduce((acc, value) => {
									return acc + parseFloat(value[valueIndex]);
								}, 0) as number;
								return [item, value.toString()];
							}) ?? []),
						]);
					}),
				)
				.flat() as Record<string, unknown>[]) ?? [];

		return {
			data: rowData,
			rowState,
		};
	}
}

function getTableProps({
	intervention,
	data,
	period,
	layout,
	orgUnit,
}: {
	intervention: InterventionConfig;
	period: PeriodInterface;
	data: Analytics;
	layout: Layout;
	orgUnit: OrgUnitType;
}): TableConfigType {
	const columns =
		getColumns({
			layout,
			data,
			determinants: intervention.dataSelection.groups,
			orgUnit,
		}) ?? [];
	const { data: rowData, rowState } =
		getData(data, {
			layout,
			determinants: intervention.dataSelection.groups,
		}) ?? [];

	return {
		columns,
		data: rowData,
		rowState,
	};
}

export const TableConfig = selectorFamily<
	TableConfigType | undefined,
	string | undefined
>({
	key: "table-config-state",
	get:
		(id?: string) =>
		({ get }): TableConfigType | undefined => {
			if (!id) {
				return undefined;
			}
			const { calendar } = get(SystemSettingsState);
			const layout = get(TableLayout(id));
			const data = get(SubLevelAnalyticsData(id));
			const intervention: InterventionConfig | undefined = get(
				InterventionState(id),
			);

			const period = get(InterventionPeriodState(id));
			const orgUnit = get(InterventionOrgUnitState(id));

			if (intervention) {
				return getTableProps({
					layout,
					intervention,
					period,
					data,
					orgUnit,
				});
			}
		},
});
