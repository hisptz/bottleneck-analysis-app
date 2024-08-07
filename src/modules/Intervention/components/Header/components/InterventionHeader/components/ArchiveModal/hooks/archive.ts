import { useAlert, useDataEngine } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	useRecoilCallback,
	useRecoilRefresher_UNSTABLE,
	useRecoilValue,
	useRecoilValueLoadable,
} from "recoil";
import { UserState } from "../../../../../../../../../core/state/user";
import {
	createArchive,
	uploadArchive,
} from "../../../../../../../../../shared/services/archives";
import { Archives } from "../../../../../../../../Archives/state/data";
import { InterventionArchiveIds } from "../../../../../../../state/archiving";
import { InterventionState } from "../../../../../../../state/intervention";
import {
	InterventionOrgUnitState,
	InterventionPeriodState,
} from "../../../../../../../state/selections";
import { ChartRef } from "../../../../../../AnalysisChart/state/chart";
import { ChartData } from "../../../../../../AnalysisChart/state/data";
import { RootCauseData } from "../../../../../../RootCauseAnalysis/state/data";
import { SubLevelAnalyticsData } from "../../../../../../SubLevelAnalysis/state/data";
import { useForm } from "react-hook-form";

export default function useArchive(onClose: () => void) {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const engine = useDataEngine();
	const [archiving, setArchiving] = useState(false);
	const orgUnit = useRecoilValue(InterventionOrgUnitState(id));
	const period = useRecoilValue(InterventionPeriodState(id));
	const form = useForm<{ remarks?: string }>({
		mode: "all",
		reValidateMode: "onBlur",
	});
	const intervention = useRecoilValue(InterventionState(id));
	const interventionArchivesState = useRecoilValueLoadable(
		InterventionArchiveIds(id),
	);
	const resetInterventionArchives = useRecoilRefresher_UNSTABLE(
		InterventionArchiveIds(id),
	);
	const resetArchives = useRecoilRefresher_UNSTABLE(Archives);
	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({ ...type, duration: 3000 }),
	);

	const archiveExists = useMemo(() => {
		if (interventionArchivesState.state !== "hasValue") {
			return;
		}
		const dateCreated = new Date()
			.toLocaleDateString("en-GB")
			.replaceAll("/", "-");
		return interventionArchivesState.contents.includes(
			`${id}_${orgUnit.id}_${period.id}_${dateCreated}`,
		);
	}, [
		id,
		interventionArchivesState.contents,
		interventionArchivesState.state,
		orgUnit.id,
		period.id,
	]);

	const onArchiveClick = useRecoilCallback(
		({ snapshot }) =>
			async ({ remarks }: { remarks?: string }) => {
				if (remarks) {
					try {
						setArchiving(true);
						const intervention = await snapshot.getPromise(
							InterventionState(id),
						);
						const user = await snapshot.getPromise(UserState);
						const chartAnalytics = await snapshot.getPromise(
							ChartData(id),
						);
						const subLevelAnalytics = await snapshot.getPromise(
							SubLevelAnalyticsData(id),
						);
						const rootCauseData = await snapshot.getPromise(
							RootCauseData(id),
						);
						const chartRef = await snapshot.getPromise(
							ChartRef(id),
						);
						const selectedIndicators: Array<string> = (
							chartRef?.chart?.getSelectedPoints() ?? []
						).map(({ id }: { id: string }) => id);
						if (intervention) {
							const archive = createArchive({
								intervention,
								chartAnalytics,
								subLevelAnalytics,
								user,
								orgUnit: orgUnit.id,
								period: period.id,
								remarks,
								rootCauseData,
								selectedIndicators,
							});
							await uploadArchive(engine, archive);
							show({
								message: i18n.t(
									"Intervention successfully archived",
								),
								type: { success: true },
							});
							setArchiving(false);
							resetArchives();
							resetInterventionArchives();
							navigate(`/archives/${archive?.id}`);
						} else {
							show({
								message: i18n.t("Intervention not found"),
								type: { info: true },
							});
						}
						onClose();
					} catch (e: any) {
						show({
							message: e.message,
							type: { info: true },
						});
						setArchiving(false);
					}
				}
			},
		[
			engine,
			id,
			onClose,
			orgUnit.id,
			period.id,
			resetArchives,
			resetInterventionArchives,
			navigate,
			show,
		],
	);
	return {
		archiveExists,
		onArchiveClick,
		archiving,
		intervention,
		orgUnit,
		period,
		form,
		loading: interventionArchivesState.state === "loading",
	};
}
