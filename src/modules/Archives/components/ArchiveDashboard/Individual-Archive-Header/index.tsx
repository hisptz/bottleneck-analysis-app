import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, IconDelete24 } from "@dhis2/ui";
import { Period } from "@iapps/period-utilities";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./index.css";
import { useRecoilValue } from "recoil";
import { OrgUnit } from "../../../../../core/state/orgUnit";
import { SystemSettingsState } from "../../../../../core/state/system";
import { OrgUnit as OrgUnitType } from "../../../../../shared/interfaces/orgUnit";
import { Archive } from "../../../state/data";
import DeleteConfirmModal from "../../ArchiveMenuCell/components/DeleteConfirmModal";

export default function IndividualArchiveHeader(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const archive = useRecoilValue(Archive(id));
  const { calendar } = useRecoilValue(SystemSettingsState);
  const { config, period: periodId, orgUnit: orgUnitId } = archive ?? {};
  const [deleteOpen, setDeleteOpen] = useState(false);
  const orgUnit: OrgUnitType = useRecoilValue(OrgUnit(orgUnitId));
  const period = new Period().setCalendar(calendar).setPreferences({ allowFuturePeriods: true }).getById(periodId);
  const history = useHistory();
  return (
    <div className="archive-header w-100 row space-between p-16 align-center">
      <div className="column">
        <h2>{config.name}</h2>
        <span>
          {orgUnit.displayName} - {period.name}
        </span>
      </div>
      <div>
        <ButtonStrip end>
          <Button
            onClick={(_: any, e: Event) => {
              history.push("/archives");
            }}>
            {i18n.t("Back to archives")}
          </Button>
          {/*<Button>{i18n.t("Refresh")}</Button>*/}
          <Button onClick={() => setDeleteOpen(true)} icon={<IconDelete24 />}>
            {i18n.t("Delete")}
          </Button>
        </ButtonStrip>
        {deleteOpen && (
          <DeleteConfirmModal onDeleteComplete={() => history.replace("/archives")} archive={archive} hide={!deleteOpen} onClose={() => setDeleteOpen(false)} />
        )}
      </div>
    </div>
  );
}