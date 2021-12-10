import i18n from "@dhis2/d2-i18n";
import { Button, InputField, SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import { PeriodSelectorModal } from "@hisptz/react-ui";
import { Period, PeriodInterface, PeriodType } from "@iapps/period-utilities";
import { filter, head } from "lodash";
import React, { useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { CalendarTypes } from "../../../../../../constants/calendar";
import { SystemSettingsState } from "../../../../../../core/state/system";
import classes from "../../../../General.module.css";

export default function PeriodSelector({ field, fieldState }: { field: any; fieldState: any }): React.ReactElement {
  const [periodSelectorOpen, setPeriodSelectorOpen] = useState(false);
  const { calendar } = useRecoilValue(SystemSettingsState);
  const period = useMemo(() => {
    if (field?.value?.id) {
      return new Period().setPreferences({ allowFuturePeriods: true }).setCalendar(calendar).getById(field?.value?.id);
    }
  }, [calendar, field.value]);

  const periodTypes = useMemo(() => {
    const periodTypes = new PeriodType().get();
    const relativePeriodTypes = filter(periodTypes, (type) => type.name.includes("Relative"));
    const fixedPeriodTypes = filter(periodTypes, (type) => !type.name.includes("Relative"));

    return {
      relative: relativePeriodTypes,
      fixed: fixedPeriodTypes,
    };
  }, []);

  const onPeriodChange = (periods: Array<PeriodInterface>) => {
    const selectedPeriod: PeriodInterface | undefined = head(periods);
    field.onChange({
      ...field.value,
      id: selectedPeriod?.id,
    });
    setPeriodSelectorOpen(false);
  };
  const excludedPeriodTypes = useMemo(() => {
    const periodTypes = new PeriodType().get();
    return filter(periodTypes, (periodType: { id: string }) => periodType.id !== field.value?.type)?.map((periodType) => periodType.id);
  }, [field.value?.type]);

  // @ts-ignore
  return (
    <div className="column gap w-100">
      <div>
        <SingleSelectField
          error={fieldState?.error}
          validationText={fieldState?.error?.message}
          filterable
          dataTest={"periodType-selection-menu"}
          selected={field?.value?.type}
          name={field.name}
          label={i18n.t("Bottleneck Period Type")}
          onChange={({ selected }: { selected: string }) => field.onChange({ ...field.value, type: selected })}>
          <SingleSelectOption className={classes["single-select-header"]} disabled label={i18n.t("Fixed Periods")} />
          {periodTypes?.fixed?.map(({ id, name }: { id: string; name: string }) => (
            <SingleSelectOption dataTest={"periodType-selection-menu-item"} key={`${id}-option`} value={id} label={`${name}`} />
          ))}
          <SingleSelectOption className={classes["single-select-header"]} disabled label={i18n.t("Relative Periods")} />
          {periodTypes?.relative?.map(({ id, name }: { id: string; name: string }) => (
            <SingleSelectOption dataTest={"periodType-selection-menu-item"} key={`${id}-option`} value={id} label={`${name}`} />
          ))}
        </SingleSelectField>
      </div>
      <div className="row gap w-100 align-end">
        <div className="flex-1">
          <InputField label={i18n.t("Period")} fullWidth error={fieldState?.error} validationText={fieldState?.error?.message} disabled value={period?.name} />
        </div>
        <Button onClick={() => setPeriodSelectorOpen(true)}>{i18n.t("Select Period")}</Button>
        {periodSelectorOpen && (
          <PeriodSelectorModal
            excludedPeriodTypes={excludedPeriodTypes}
            selectedPeriods={period && ([period] as unknown as any)}
            singleSelection
            calendar={calendar === CalendarTypes.ETHIOPIAN ? CalendarTypes.ETHIOPIAN : CalendarTypes.GREGORIAN}
            onClose={() => setPeriodSelectorOpen(false)}
            hide={!periodSelectorOpen}
            onUpdate={onPeriodChange}
          />
        )}
      </div>
    </div>
  );
}
