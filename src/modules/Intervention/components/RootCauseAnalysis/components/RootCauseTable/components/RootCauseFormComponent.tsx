import i18n from "@dhis2/d2-i18n";
import { Button, SingleSelectField, SingleSelectOption, TextArea, Field, Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip } from "@dhis2/ui";
import { Period } from "@iapps/period-utilities";
import { map, find } from "lodash";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { UserOrganisationUnits } from "../../../../../../../core/state/user";
import { InterventionStateSelector } from "../../../../../state/intervention";

type RootCauseFormCProps = {
  onDismissRootCauseForm?: any;
  hideModal: boolean;
};

export default function RootCauseFormComponent({ onDismissRootCauseForm, hideModal }: RootCauseFormCProps) {
  const { id: interventionId } = useParams<{ id: string }>();

  let bottleneckMetadata = useRecoilValue(
    InterventionStateSelector({
      id: interventionId,
      path: ["dataSelection", "groups"],
    })
  );

  const periodSelection = useRecoilValue(
    InterventionStateSelector({
      id: interventionId,
      path: ["periodSelection"],
    })
  );
  const { id: periodId, name: period } = new Period().getById(periodSelection.id);

  const orgUnitSelection = useRecoilValue(
    InterventionStateSelector({
      id: interventionId,
      path: ["orgUnitSelection", "orgUnit"],
    })
  );
  const { id, displayName } = useRecoilValue(UserOrganisationUnits);
  const orgUnitId = orgUnitSelection.type === "USER_ORGANISATION_UNIT" ? id : orgUnitSelection.orgUnit.id;
  const orgUnitName = orgUnitSelection.type === "USER_ORGANISATION_UNIT" ? displayName : orgUnitSelection.orgUnit.id;

  const hiddenFields = {
    // orgunit
    pQtxdfQ6Jum: orgUnitName,
    // orgunitId
    qOvrGMTGBee: orgUnitId,
    // period
    yzYKWac02lm: period,
    // periodId
    skBBrbmML4S: periodId,
    // intervention
    YPfJQu6sCSZ: "Full Immunization",
    // interventionId
    GXqfW1B2McT: interventionId,
  };

  bottleneckMetadata = map(bottleneckMetadata, (group) => ({
    id: group.id,
    name: group.name,
    indicators: map(group?.items, (item) => ({ label: item.label, name: item.name })),
  }));

  const bottleneckOptions = map(bottleneckMetadata, (bottleneck) => ({ label: bottleneck?.name, id: bottleneck?.id }));

  const [rootCauseData, setRootCauseData] = useState(hiddenFields);
  const [interventionOptions, setInterventionOptions] = useState([]);

  function onUpdateBottleneck(e: any) {
    const { selected: bottleneckId } = e;
    const bottleneck: any = find(bottleneckMetadata, (item: any) => item?.id === bottleneckId);
    setRootCauseData({ ...rootCauseData, fZCEB7Euppr: bottleneck?.name, xf7L8ioFiC5: bottleneckId, gE2BDDC0e0V: "" });
    setInterventionOptions(bottleneck?.indicators);
  }

  function onUpdateIndicator(e: any) {
    const { selected: indicator } = e;
    setRootCauseData({ ...rootCauseData, gE2BDDC0e0V: indicator });
  }

  function saveRootCause() {
    // todo add method for uploading root cause data
    setRootCauseData({});
    onDismissRootCauseForm();
  }

  function onValueChange(e: any) {
    const { name, value } = e;
    if (name) {
      setRootCauseData({ ...rootCauseData, [name]: value });
    }
  }

  return (
    <Modal large={true} hide={!hideModal} onClose={saveRootCause} position="middle" small>
      <ModalTitle>{i18n.t("Root Cause form")}</ModalTitle>
      <ModalContent>
        <div>
          <SingleSelectField
            selected={rootCauseData["xf7L8ioFiC5"] || ""}
            label={i18n.t("Bottleneck")}
            name="bottleneck"
            className="select"
            onChange={onUpdateBottleneck}>
            {bottleneckOptions.map((option, index) => (
              <SingleSelectOption label={option?.label} value={option?.id} key={index} />
            ))}
          </SingleSelectField>
          <SingleSelectField
            selected={rootCauseData["gE2BDDC0e0V"] || ""}
            name="intevention"
            label={i18n.t("Intervention")}
            className="select"
            onChange={onUpdateIndicator}>
            {interventionOptions.map((option: any, index) => (
              <SingleSelectOption label={option?.label} value={option?.name} key={index} />
            ))}
          </SingleSelectField>

          <Field label={i18n.t("Possible root cause")}>
            <TextArea name="HwElwZJ9Oyc" rows="2" resize="vertical" onBlur={onValueChange} />
          </Field>
          <Field label={i18n.t("Possible solution")}>
            <TextArea name="PS29TQkElZL" rows="2" resize="vertical" onBlur={onValueChange} />
          </Field>
        </div>
      </ModalContent>
      <ModalActions>
        <ButtonStrip end>
          <Button secondary onClick={onDismissRootCauseForm}>
            Cancel
          </Button>
          <Button primary onClick={saveRootCause}>
            Save
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}
