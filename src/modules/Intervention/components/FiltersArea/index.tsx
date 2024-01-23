import i18n from "@dhis2/d2-i18n";
import { Button, Tag } from "@dhis2/ui";
import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../state/selections";
import { ActiveFilters, FilterActive } from "../Header/components/InterventionHeader/state/filter";

export default function FiltersArea(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const filterActive = useRecoilValue(FilterActive(id));
  const activeFilters = useRecoilValue(ActiveFilters(id));
  const period = useRecoilValue(InterventionPeriodState(id));
  const orgUnit = useRecoilValue(InterventionOrgUnitState(id));

  const onClearFilter = useRecoilCallback(({ reset }) => () => {
    reset(InterventionOrgUnitState(id));
    reset(InterventionPeriodState(id));
    reset(ActiveFilters(id));
  });

  if (!filterActive) return <div />;

  return (
    <div className="row space-between p-16 w-100 align-center">
      <div className="row gap">
        <b>{i18n.t("Active Filters: ")}</b>
        {activeFilters.period && (
          <Tag permanent>
            <b>{`${i18n.t("Period")}: `}</b> {`${period.name}`}
          </Tag>
        )}
        {activeFilters.orgUnit && (
          <Tag permanent>
            <b>{`${i18n.t("Organisation Unit")}: `}</b> {`${orgUnit.displayName}`}
          </Tag>
        )}
      </div>
      <div>
        <Button onClick={onClearFilter} small>
          {i18n.t("Clear all filter")}
        </Button>
      </div>
    </div>
  );
}
