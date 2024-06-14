import { useSetting } from "@dhis2/app-service-datastore";
import { head, isEmpty } from "lodash";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { DATA_MIGRATION_CHECK } from "../../../constants/dataStore";
import { AuthorizedInterventionSummary } from "../../../core/state/intervention";
import { InterventionSummary as InterventionSummaryType } from "../../../shared/interfaces/interventionConfig";

export function useAppInit(): void {
	const navigate = useNavigate();
	const interventionSummary = useRecoilValue(AuthorizedInterventionSummary);
	const [migration] = useSetting(DATA_MIGRATION_CHECK, { global: true });
	useEffect(() => {
		function nav() {
			if (!migration) {
				navigate("/migrate");
				return;
			}
			if (interventionSummary && !isEmpty(interventionSummary)) {
				const firstIntervention: InterventionSummaryType | undefined =
					head(interventionSummary);
				if (firstIntervention) {
					navigate(`/interventions/${firstIntervention?.id}`);
				} else {
					navigate("/no-interventions");
				}
			} else {
				navigate("/no-interventions");
			}
		}

		nav();
	}, [navigate, interventionSummary, migration]);
}
