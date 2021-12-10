import i18n from "@dhis2/d2-i18n";
import { FlyoutMenu, IconClock24, IconCross24, IconDimensionOrgUnit16, MenuItem } from "@dhis2/ui";
import { OrgUnitSelectorModal, PeriodSelectorModal } from "@hisptz/react-ui";
import { Period, PeriodInterface, PeriodType } from "@iapps/period-utilities";
import { filter, head, isEmpty } from "lodash";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilCallback, useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { OrgUnit } from "../../../../../../../shared/interfaces/orgUnit";
import { InterventionState } from "../../../../../state/intervention";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../../../../state/selections";
import { ActiveFilters, FilterActive } from "../state/filter";

export default function FilterMenu({ onClose }: { onClose: () => void }): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const filterActive = useRecoilValue(FilterActive(id));
  const setFilterActiveState = useSetRecoilState(ActiveFilters(id));
  const [periodSelectorOpen, setPeriodSelectorOpen] = React.useState(false);
  const [orgUnitSelectorOpen, setOrgUnitSelectorOpen] = React.useState(false);
  const [periodSelection, setPeriodSelection] = useRecoilState<PeriodInterface>(InterventionPeriodState(id));

  const [orgUnitSelection, setOrgUnitSelection] = useRecoilState<OrgUnit>(InterventionOrgUnitState(id));
  const refreshIntervention = useRecoilRefresher_UNSTABLE(InterventionState(id));

  const excludedPeriodTypes = useMemo(() => {
    const periodTypes = new PeriodType().get();
    return filter(periodTypes, (periodType: { id: string }) => periodType.id !== periodSelection?.type)?.map((periodType) => periodType.id);
  }, [periodSelection?.type]);
  const selectedPeriod = useMemo(() => {
    if (periodSelection) {
      return new Period().setPreferences({ allowFuturePeriods: true })?.getById(periodSelection?.id);
    }
    return new Period().setPreferences({ allowFuturePeriods: true });
  }, [periodSelection]);

  const onClearFilter = useRecoilCallback(({ reset }) => () => {
    reset(InterventionOrgUnitState(id));
    reset(InterventionPeriodState(id));
    reset(ActiveFilters(id));
  });

  return (
    <div>
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
        {filterActive && (
          <MenuItem
            onClick={() => {
              onClose();
              onClearFilter();
              refreshIntervention();
            }}
            icon={<IconCross24 />}
            label={i18n.t("Clear Filters")}
          />
        )}
      </FlyoutMenu>
      {periodSelectorOpen && (
        <PeriodSelectorModal
          singleSelection
          selectedPeriods={[selectedPeriod] as unknown as any}
          excludedPeriodTypes={excludedPeriodTypes}
          onClose={() => setPeriodSelectorOpen(false)}
          hide={!periodSelectorOpen}
          onUpdate={(periods: Array<PeriodInterface>) => {
            const selectedPeriod = head(periods);
            if (selectedPeriod) {
              if (selectedPeriod?.id === periodSelection?.id) {
                setPeriodSelectorOpen(false);
                return;
              }
              setPeriodSelection(selectedPeriod);
              setFilterActiveState((prevState) => ({ ...prevState, period: true }));
              refreshIntervention();
              setPeriodSelectorOpen(false);
            }
          }}
        />
      )}
      {orgUnitSelectorOpen && (
        <OrgUnitSelectorModal
          value={{ orgUnits: [orgUnitSelection] }}
          singleSelection
          onClose={() => setOrgUnitSelectorOpen(false)}
          hide={!orgUnitSelectorOpen}
          onUpdate={({ orgUnits }: { orgUnits?: Array<any> }) => {
            if (orgUnits && !isEmpty(orgUnits)) {
              const orgUnit = head(orgUnits);
              if (orgUnit?.id === orgUnitSelection?.id) {
                setOrgUnitSelectorOpen(false);
                return;
              }
              const level = orgUnit.path.split("/").length - 1;
              setOrgUnitSelection({ ...orgUnit, level });
              setFilterActiveState((prevState) => ({ ...prevState, orgUnit: true }));
              refreshIntervention();
            }
            setOrgUnitSelectorOpen(false);
          }}
        />
      )}
    </div>
  );
}
