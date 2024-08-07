import { useAlert } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import {
	Button,
	ButtonStrip,
	colors,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
} from "@dhis2/ui";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilRefresher_UNSTABLE } from "recoil";
import { AllInterventionSummary } from "../../../../core/state/intervention";

export default function ConfirmDeleteDialog({
	hide,
	onClose,
	onConfirm,
	name,
}: {
	hide: boolean;
	name?: string;
	onClose: () => void;
	onConfirm: () => Promise<void>;
}): React.ReactElement {
	const navigate = useNavigate();
	const [deleting, setDeleting] = useState(false);
	const resetSummary = useRecoilRefresher_UNSTABLE(AllInterventionSummary);
	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({ ...type, duration: 3000 }),
	);

	const refresh = resetSummary;

	const onDeleteConfirm = async () => {
		setDeleting(true);
		try {
			await onConfirm();
			show({
				message: i18n.t("Intervention deleted successfully"),
				type: { success: true },
			});
			refresh();
			navigate("/");
		} catch (e) {
			show({
				message: i18n.t(
					"An error occurred while deleting the configuration",
				),
				type: { info: true },
			});
			console.error(e);
		} finally {
			setDeleting(false);
		}
		onClose();
	};

	return (
		<Modal position="middle" hide={hide} onClose={onClose}>
			<ModalTitle>{i18n.t("Confirm Delete")}</ModalTitle>
			<ModalContent>
				<div className="column gap align-left">
					<span>{`${i18n.t("Are you sure you want to delete the intervention:")} `}</span>
					<b
						style={{ fontSize: 18, color: colors.grey900 }}
					>{`${name}`}</b>
					<span style={{ color: colors.grey700 }}>
						{i18n.t("Deleting an intervention can’t be undone")}
					</span>
				</div>
			</ModalContent>
			<ModalActions>
				<ButtonStrip>
					<Button onClick={onClose}>{i18n.t("Cancel")}</Button>
					<Button
						loading={deleting}
						disabled={deleting}
						destructive
						onClick={onDeleteConfirm}
					>
						{deleting
							? `${i18n.t("Deleting")}...`
							: i18n.t("Delete")}
					</Button>
				</ButtonStrip>
			</ModalActions>
		</Modal>
	);
}
