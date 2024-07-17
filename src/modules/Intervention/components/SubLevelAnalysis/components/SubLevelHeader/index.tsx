import i18n from "@dhis2/d2-i18n";
import { Tab, TabBar } from "@dhis2/ui";
import React from "react";
import { useRecoilState } from "recoil";
import { tabs } from "../../constants/tabs";
import { ActiveTab } from "../../state/tabs";
import LegendsDefinition from "./components/LegendsDefinition";
import CardHeader from "../../../CardHeader";

export default function SubLevelHeader({
	activeTab,
}: {
	activeTab: any;
}): React.ReactElement {
	const [activeTabs, setActiveTab] = useRecoilState(ActiveTab);
	return (
		<div className="column pt-8 sub-level-header">
			<div className="row space-between align-items-center">
				<div className="row align-items-center" style={{ gap: 8 }}>
					<h4
						style={{ margin: 0 }}
					>{`${i18n.t("Bottleneck Sub-level Analysis")}:`}</h4>
					<CardHeader />
				</div>
			</div>
			<TabBar fixed={false}>
				{tabs?.map(({ label, icon, key }) => (
					<Tab
						icon={icon}
						key={key}
						onClick={() => setActiveTab(key)}
						selected={activeTabs === key}
					>
						{label}
					</Tab>
				))}
			</TabBar>
			<div style={{ width: "100%", marginBottom: 20 }} />
			<div className="column">
				{activeTab.key === "table" && <LegendsDefinition />}
			</div>
		</div>
	);
}
