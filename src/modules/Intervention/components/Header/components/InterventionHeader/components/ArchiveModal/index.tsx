import i18n from "@dhis2/d2-i18n";
import {
	Button,
	ButtonStrip,
	CircularLoader,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
	NoticeBox,
	TextAreaField,
} from "@dhis2/ui";
import React from "react";
import useArchive from "./hooks/archive";
import { FormProvider, useController } from "react-hook-form";

function RHFTextAreaInput() {
	const { field, fieldState } = useController<
		{ remarks?: string },
		"remarks"
	>({
		name: "remarks",
		rules: {
			required: i18n.t("Description is required"),
		},
	});
	return (
		<TextAreaField
			{...field}
			required
			initialFocus
			error={!!fieldState.error}
			validationText={fieldState.error?.message}
			value={field.value}
			onChange={({ value }: { value?: string }) => {
				console.log(value);
				field.onChange(value);
			}}
			label={i18n.t("Archive Description")}
		/>
	);
}

export default function ArchiveModal({
	hide,
	onClose,
}: {
	hide: boolean;
	onClose: () => void;
}): React.ReactElement {
	const {
		loading,
		intervention,
		orgUnit,
		period,
		archiving,
		onArchiveClick,
		form,
		archiveExists,
	} = useArchive(onClose);

	return (
		<Modal position="middle" onClose={onClose} hide={hide}>
			<ModalTitle>{i18n.t("Archive intervention")}</ModalTitle>
			<ModalContent>
				<FormProvider {...form}>
					{loading ? (
						<div
							className="column w-100 center align-center"
							style={{ height: 300 }}
						>
							<CircularLoader small />
						</div>
					) : archiveExists ? (
						<div>
							<NoticeBox error title={i18n.t("Archive Exists")}>
								{i18n.t(
									"This intervention has already been archived for today",
								)}
							</NoticeBox>
						</div>
					) : (
						<div className="column gap m-8">
							<p>
								{`${i18n.t("Archiving the intervention")}  `}
								<strong> {`${intervention?.name}`}</strong>
								{` ${i18n.t("for the organisation unit")} `}
								<strong>{orgUnit?.displayName}</strong>
								{` ${i18n.t("and period")} `}
								<strong>{period?.name}</strong>
							</p>
							<RHFTextAreaInput />
						</div>
					)}
				</FormProvider>
			</ModalContent>
			<ModalActions>
				<ButtonStrip>
					<Button onClick={onClose}>{i18n.t("Cancel")}</Button>
					<Button
						dataTest="confirm-archive-intervention-button"
						loading={archiving}
						onClick={() => form.handleSubmit(onArchiveClick)()}
						disabled={!form.formState.isValid}
						primary
					>
						{archiving ? i18n.t("Archiving...") : i18n.t("Archive")}
					</Button>
				</ButtonStrip>
			</ModalActions>
		</Modal>
	);
}
