import { SwitchField } from "@dhis2/ui";
import { useRecoilState } from "recoil";
import { SubLevelAverageColumnVisible } from "../../../state/table";
import { useParams } from "react-router-dom";
import i18n from "@dhis2/d2-i18n";

export function AverageColumnSwitch() {
	const { id } = useParams<{ id: string }>();
	const [active, setActive] = useRecoilState(
		SubLevelAverageColumnVisible(id),
	);
	return (
		<SwitchField
			label={i18n.t("Show average column")}
			checked={active}
			onChange={({ checked }) => setActive(checked)}
		/>
	);
}
