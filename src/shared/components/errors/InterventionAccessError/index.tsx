import i18n from "@dhis2/d2-i18n";
import { Button, colors, IconBlock24 } from "@dhis2/ui";
import React from "react";
import { useNavigate } from "react-router-dom";
import { InterventionAccess } from "../../../interfaces/access";

export default function InterventionAccessError({
	access,
}: {
	access: InterventionAccess;
}): React.ReactElement {
	const navigate = useNavigate();
	return (
		<div className=" h-100 w-100 center align-center column gap">
			<span className="icon-72">
				<IconBlock24 color={colors.grey700} />
			</span>
			<h2 style={{ margin: 0, color: colors.grey900 }}>
				{i18n.t("Access Denied")}
			</h2>
			<p
				style={{ color: colors.grey700, fontSize: 18, margin: 0 }}
				className="error-text"
			>
				{i18n.t("You do not have access to ")}
				{!access.read && !access.write && `${i18n.t("view or edit")}`}
				{access.read && !access.write && `${i18n.t("edit")}`}
				{` ${i18n.t("this intervention")}`}
			</p>
			<Button primary onClick={() => navigate("/")}>
				{i18n.t("Back to Interventions")}
			</Button>
		</div>
	);
}
