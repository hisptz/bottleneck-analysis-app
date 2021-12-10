import { Period, PeriodInterface } from "@iapps/period-utilities";

export function getCurrentPeriod(periodType: string, calendar: string): PeriodInterface {
  return new Period().setCalendar(calendar).setPreferences({ allowFuturePeriods: true }).getById(`${new Date().getFullYear()}`);
}
