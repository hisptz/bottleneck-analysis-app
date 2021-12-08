import i18n from "@dhis2/d2-i18n";
import { FlyoutMenu, IconClock24, IconDimensionOrgUnit16, MenuItem } from "@dhis2/ui";
import { OrgUnitSelectorModal, PeriodSelectorModal } from "@hisptz/react-ui";
import { Period, PeriodType } from "@iapps/period-utilities";
import { filter } from "lodash";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { PeriodSelection } from "../../../../../../../shared/interfaces/interventionConfig";
import { InterventionStateSelector } from "../../../../../state/intervention";

export default function FilterMenu({ onClose }: { onClose: () => void }): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [periodSelectorOpen, setPeriodSelectorOpen] = React.useState(false);
  const [orgUnitSelectorOpen, setOrgUnitSelectorOpen] = React.useState(false);
  const [periodSelection, setPeriodSelection] = useRecoilState<PeriodSelection>(InterventionStateSelector({ id, path: ["periodSelection"] }));

  const excludedPeriodTypes = useMemo(() => {
    const periodTypes = new PeriodType().get();
    return filter(periodTypes, (periodType: { id: string }) => periodType.id !== periodSelection.type)?.map((periodType) => periodType.id);
  }, [periodSelection.type]);
  const selectedPeriod = useMemo(() => {
    return new Period().setPreferences({ allowFuturePeriods: true })?.getById(periodSelection?.id);
  }, [periodSelection]);

  return (
    <>
      <FlyoutMenu>
        <MenuItem
          onClick={() => {
            onClose();
            setPeriodSelectorOpen(true);
          }}
          icon={<IconClock24 />}
          label={i18n.t("Period")}
        />
        <MenuItem
          onClick={() => {
            onClose();
            setOrgUnitSelectorOpen(true);
          }}
          icon={<IconDimensionOrgUnit16 />}
          label={i18n.t("Organisation Unit")}
        />
      </FlyoutMenu>
      {periodSelectorOpen && (
        <PeriodSelectorModal
          singleSelection
          selectedPeriods={[selectedPeriod] as unknown as any}
          excludedPeriodTypes={excludedPeriodTypes}
          onClose={() => setPeriodSelectorOpen(false)}
          hide={!periodSelectorOpen}
          onUpdate={(periods) => {
            setPeriodSelection((prevPeriodSelection) => {
              const period = periods[0];
              return { ...prevPeriodSelection, id: period.id, type: period.type };
            });
            setPeriodSelectorOpen(false);
          }}
        />
      )}
      {orgUnitSelectorOpen && (
        <OrgUnitSelectorModal
          singleSelection
          onClose={() => setOrgUnitSelectorOpen(false)}
          hide={!orgUnitSelectorOpen}
          onUpdate={() => {
            setOrgUnitSelectorOpen(false);
          }}
        />
      )}
    </>
  );
}
