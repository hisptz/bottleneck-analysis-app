import { useAlert, useDataEngine } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { BNA_NAMESPACE } from "../../../../../../../../../../../constants/dataStore";
import {
	AllInterventionSummary,
	AuthorizedInterventionSummary,
} from "../../../../../../../../../../../core/state/intervention";
import { UserState } from "../../../../../../../../../../../core/state/user";
import {
	InterventionConfig,
	InterventionSummary as InterventionSummaryType,
} from "../../../../../../../../../../../shared/interfaces/interventionConfig";
import { uid } from "../../../../../../../../../../../shared/utils/generators";
import { createIntervention } from "../../../../../../../../../../InterventionConfiguration/services/save";

const cloneQuery = {
	intervention: {
		resource: `dataStore/${BNA_NAMESPACE}`,
		id: ({ id }: any) => id,
	},
};
export default function useClone(): {
	cloning: boolean;
	onClone: (interventionId: string, name: string) => void;
} {
	const navigate = useNavigate();
	const summaries: Array<InterventionSummaryType> | undefined =
		useRecoilValue(AuthorizedInterventionSummary);
	const resetSummary = useRecoilRefresher_UNSTABLE(AllInterventionSummary);
	const user = useRecoilValue(UserState);
	const engine = useDataEngine();
	const [cloning, setCloning] = useState(false);
	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({ ...type, duration: 3000 }),
	);

	const onClone = useCallback(
		async (interventionId: string, name: string) => {
			setCloning(true);
			try {
				const { intervention } =
					(await engine.query(cloneQuery, {
						variables: { id: interventionId },
					})) ?? {};
				if (!intervention) {
					throw new Error(i18n.t("Intervention not found"));
				}
				const newIntervention = {
					...(intervention as unknown as InterventionConfig),
					id: uid(),
					name,
					user: {
						id: user.id,
					},
				};
				await createIntervention(engine, newIntervention, summaries);
				show({
					message: i18n.t("Intervention duplicated successfully"),
					type: { success: true },
				});
				resetSummary();
				navigate(`/${newIntervention.id}/configuration`);
			} catch (e: any) {
				show({
					message:
						e?.message ??
						i18n.t("Failed to duplicate intervention"),
					type: { info: true },
				});
			}
			setCloning(false);
		},
		[engine, navigate, resetSummary, show, summaries, user.id],
	);

	return {
		cloning,
		onClone,
	};
}
