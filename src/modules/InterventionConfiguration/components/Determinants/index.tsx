import { Steps } from "intro.js-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import { INTERVENTION_DETERMINANT_CONFIGURATION_HELP } from "../../../../constants/help/intervention-configuration";
import { STEP_OPTIONS } from "../../../../constants/help/options";
import { SelectedIndicatorIndex } from "../../state/edit";
import HelpState from "./../../../Intervention/state/help";
import DeterminantArea from "./components/DeterminantArea";
import IndicatorConfiguration from "./components/IndicatorConfiguration";
import "./Determinant.css";
import { isEmpty, some } from "lodash";
import i18n from "@dhis2/d2-i18n";
import { useFormContext } from "react-hook-form";
import { RHFCustomInput } from "@hisptz/react-ui";

export default function DeterminantsConfiguration(): React.ReactElement {
	const { id } = useParams<{ id: string }>();
	const selectedIndicator = useRecoilValue(SelectedIndicatorIndex(id));
	const { register } = useFormContext();
	const [helpEnabled, setHelpEnabled] = useRecoilState(HelpState);

	const groupFormName = "dataSelection.groups";

	const onHelpExit = () => {
		setHelpEnabled(false);
	};

	useEffect(() => {
		register(groupFormName, {
			validate: (value) => {
				return (
					some(value, ({ items }) => !isEmpty(items)) ||
					i18n.t(
						"At least one determinant must have at least one indicator"
					)
				);
			},
		});
	}, [register]);

	const reset = useRecoilCallback(({ set }) => () => {
		set(SelectedIndicatorIndex(id), undefined);
	});

	useEffect(() => {
		return () => {
			reset();
		};
	}, []);

	return (
		<div className="determinant-main-container">
			<Steps
				options={STEP_OPTIONS}
				enabled={helpEnabled}
				steps={INTERVENTION_DETERMINANT_CONFIGURATION_HELP}
				onExit={onHelpExit}
				initialStep={0}
			/>
			<div
				className={`determinant-area-container ${
					selectedIndicator === undefined ? "w-100" : ""
				}`}
			>
				<DeterminantArea />
			</div>
			<div className="indicator-configuration-container">
				{selectedIndicator !== undefined && <IndicatorConfiguration />}
			</div>
		</div>
	);
}
