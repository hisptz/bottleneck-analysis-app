import { SegmentedControl } from "@dhis2/ui";
import React from "react";
import {
	normalTableLayout,
	switchedTableLayout,
} from "../../constants/tableLayouts";
import { useRecoilState } from "recoil";
import { TableLayout } from "../../state/layout";
import { useParams } from "react-router-dom";

export function TableLayoutSwitch() {
	const { id } = useParams<{ id: string }>();

	const [layout, switchLayout] = useRecoilState(TableLayout(id));

	const selectedLayoutValue = layout.rows.includes("ou")
		? "org_unit_rows"
		: "determinant_rows";

	const onLayoutChange = () => {
		switchLayout((prevLayout) => {
			if (prevLayout.columns.includes("dx")) {
				return switchedTableLayout;
			} else {
				return normalTableLayout;
			}
		});
	};
	return (
		<SegmentedControl
			className={"sub-level-analysis-table-switch"}
			onChange={onLayoutChange}
			options={[
				{
					label: "Determinant rows",
					value: "determinant_rows",
				},
				{
					label: "Org unit rows",
					value: "org_unit_rows",
				},
			]}
			selected={selectedLayoutValue}
		/>
	);
}
