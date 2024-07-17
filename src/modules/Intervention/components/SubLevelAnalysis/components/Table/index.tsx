import { DataTable } from "@dhis2/ui";
import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import CardLoader from "../../../../../../shared/components/loaders/CardLoader";
import classes from "../../../../../../styles/Table.module.css";
import { FullPageState } from "../../../../state/config";
import TableBody from "./components/TableBody";
import TableHeader from "./components/TableHeader";
import { SubLevelTableRef } from "../../state/table";
import { TableLayoutSwitch } from "./TableLayoutSwitch";
import { AverageColumnSwitch } from "./components/AverageColumnSwitch";

export default function Table(): React.ReactElement {
	const { id } = useParams<{ id: string }>();
	const isFullPage = useRecoilValue(FullPageState("subLevelAnalysis"));
	const tableRef = useSetRecoilState(SubLevelTableRef(id));

	return (
		<Suspense fallback={<CardLoader />}>
			<div className="column sub-level-analysis-table">
				<div className="row end p-8 gap-16 align-center">
					<AverageColumnSwitch />
					<TableLayoutSwitch />
				</div>
				<DataTable
					scrollHeight={isFullPage ? "calc(100vh - 200px)" : "400px"}
					ref={tableRef}
					fixed
					className={classes["table"]}
					bordered
				>
					<TableHeader />
					<TableBody />
				</DataTable>
			</div>
		</Suspense>
	);
}
