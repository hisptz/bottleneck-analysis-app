import { Period, PeriodInterface, PeriodType } from "@iapps/period-utilities";
import { filter, head, isEmpty } from "lodash";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilRefresher_UNSTABLE, useRecoilState, useSetRecoilState } from "recoil";
import { OrgUnit } from "../../../../../../../shared/interfaces/orgUnit";
import { InterventionState } from "../../../../../state/intervention";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../../../../state/selections";
import { ActiveFilters } from "../state/filter";

export default function useFilter(): {
  selectedPeriod: PeriodInterface | Period;
  excludedPeriodTypes: string[];
  periodSelectorOpen: boolean;
  setPeriodSelectorOpen: (open: boolean) => void;
  orgUnitSelectorOpen: boolean;
  orgUnitSelection: OrgUnit;
  setOrgUnitSelectorOpen: (open: boolean) => void;
  onPeriodSelect: (period: any) => void;
  onOrgUnitSelect: ({ orgUnits }: any) => void;
} {
  const { id } = useParams<{ id: string }>();
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

  const onPeriodSelect = (periods: Array<PeriodInterface>) => {
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
  };

  const onOrgUnitSelect = ({ orgUnits }: { orgUnits?: Array<any> }) => {
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
  };

  return {
    selectedPeriod,
    excludedPeriodTypes,
    periodSelectorOpen,
    setPeriodSelectorOpen,
    orgUnitSelectorOpen,
    setOrgUnitSelectorOpen,
    orgUnitSelection,
    onPeriodSelect,
    onOrgUnitSelect,
  };
}
