import i18n from "@dhis2/d2-i18n";
import {
	Divider,
	FlyoutMenu,
	IconArchive24,
	IconDownload24,
	MenuItem,
} from "@dhis2/ui";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { UserAuthority } from "../../../../../../../core/state/user";

export default function MoreMenu({
	onClose,
	onArchive,
	onZipDownload,
	zipDisabled,
}: {
	onClose: () => void;
	onArchive: () => void;
	onZipDownload: () => void;
	zipDisabled: boolean;
}): React.ReactElement {
	const navigate = useNavigate();
	const { archive } = useRecoilValue(UserAuthority);

	function onToArchivesList() {
		navigate("/archives");
	}

	return (
		<>
			<FlyoutMenu>
				<MenuItem
					icon={<IconDownload24 />}
					disabled={zipDisabled}
					onClick={() => {
						onZipDownload();
						onClose();
					}}
					label={i18n.t("Download intervention data")}
				/>
				{archive.create && (
					<MenuItem
						dataTest={"archive-intervention-button"}
						icon={<IconArchive24 />}
						onClick={() => {
							onArchive();
							onClose();
						}}
						label={i18n.t("Archive intervention")}
					/>
				)}
				<Divider />
				<MenuItem
					dataTest="view-archives-list-button"
					onClick={() => {
						onToArchivesList();
						onClose();
					}}
					label={i18n.t("View Archives")}
				/>
			</FlyoutMenu>
		</>
	);
}
