import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, of } from 'rxjs';

import * as fromPeriodFilterModel from './period-filter.model';
import { PeriodService } from './period.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-period-filter',
  templateUrl: './period-filter.component.html',
  styleUrls: ['./period-filter.component.css']
})
export class PeriodFilterComponent implements OnInit, OnChanges {
  periodTypes: any[];
  @Input()
  selectedPeriodType = '';
  @Input()
  selectedPeriods: any[] = [];
  @Input()
  periodConfig: any = {
    resetOnPeriodTypeChange: false,
    emitOnSelection: false,
    singleSelection: true
  };
  @Output()
  periodFilterUpdate = new EventEmitter();
  @Output()
  periodFilterClose = new EventEmitter();
  availablePeriods: any[];
  periods$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  selectedPeriods$: Observable<any>;
  private _periods: any[];
  selectedYear: number;
  currentYear: number;

  constructor(private periodService: PeriodService) {
    const date = new Date();
    this.selectedYear = date.getFullYear();
    this.currentYear = date.getFullYear();
    this.periodTypes = fromPeriodFilterModel.PERIOD_TYPES;
    this._periods = [];
    this.periods$.asObservable().subscribe((periods: any) => {
      this.selectedPeriods = periods.filter((period: any) => period.selected);
      this.selectedPeriods$ = of(this.selectedPeriods);
      this.availablePeriods = periods.filter((period: any) => !period.selected);
    });
  }

  ngOnChanges() {
    if (!this.selectedPeriodType || this.selectedPeriodType === '') {
      this.selectedPeriodType = this.periodService.deduceSelectedPeriodType(this.selectedPeriods);
    }

    this._periods = this.getPeriods(this.selectedPeriodType, this.selectedYear, this.selectedPeriods);
    this.periods$.next(this._periods);
  }

  ngOnInit() {}

  getPeriods(selectedPeriodType: string, year: number, selectedPeriods: any[]) {
    return this.updatePeriodsWithSelected(
      this.periodService.getPeriodsBasedOnType(selectedPeriodType, year),
      selectedPeriods
    );
  }

  updatePeriodsWithSelected(periods: any[], selectedPeriods: any[]) {
    let newPeriods = [...periods];
    selectedPeriods.forEach((selectedPeriod: any) => {
      const availablePeriod = _.find(newPeriods, ['id', selectedPeriod.id]);
      if (availablePeriod) {
        const periodIndex = _.findIndex(newPeriods, availablePeriod);

        newPeriods = [
          ..._.slice(newPeriods, 0, periodIndex),
          { ...availablePeriod, selected: true },
          ..._.slice(newPeriods, periodIndex + 1)
        ];
      } else {
        newPeriods = [...newPeriods, { ...selectedPeriod, selected: true }];
      }
    });

    return newPeriods;
  }

  togglePeriod(period, e) {
    e.stopPropagation();
    if (this.periodConfig.singleSelection) {
      this.deselectAllPeriods();
    }

    const periodIndex = _.findIndex(this._periods, _.find(this._periods, ['id', period.id]));

    if (periodIndex !== -1) {
      if (period.selected) {
        if (period.type === this.selectedPeriodType) {
          /**
           * Check if corresponding period is in the list of selected period type
           */
          period.selected = !period.selected;
          this._periods = [...this._periods.slice(0, periodIndex), period, ...this._periods.slice(periodIndex + 1)];
        } else {
          this._periods = [...this._periods.slice(0, periodIndex), ...this._periods.slice(periodIndex + 1)];
        }
      } else {
        period.selected = !period.selected;
        this._periods = [...this._periods.slice(0, periodIndex), period, ...this._periods.slice(periodIndex + 1)];
      }

      this.periods$.next(this._periods);

      if (this.periodConfig.emitOnSelection) {
        this.getPeriodOutput();
      }
    }
  }

  updatePeriodType(periodType: string, e) {
    e.stopPropagation();
    const selectedPeriods = this.periodConfig.resetOnPeriodTypeChange
      ? []
      : this._periods.filter(period => period.selected);

    this._periods = this.getPeriods(periodType, this.selectedYear, selectedPeriods);
    this.periods$.next(this._periods);
  }

  pushPeriodBackward(e) {
    e.stopPropagation();
    this.selectedYear--;
    this._periods = this.getPeriods(
      this.selectedPeriodType,
      this.selectedYear,
      this._periods.filter(period => period.selected)
    );
    this.periods$.next(this._periods);
  }

  pushPeriodForward(e) {
    e.stopPropagation();
    this.selectedYear++;
    this._periods = this.getPeriods(
      this.selectedPeriodType,
      this.selectedYear,
      this._periods.filter(period => period.selected)
    );
    this.periods$.next(this._periods);
  }

  selectAllPeriods(e) {
    e.stopPropagation();
    this._periods = this._periods.map((period: any) => {
      const newPeriod = { ...period };
      newPeriod.selected = true;
      return newPeriod;
    });
    this.periods$.next(this._periods);

    if (this.periodConfig.emitOnSelection) {
      this.getPeriodOutput();
    }
  }

  deselectAllPeriods(e?) {
    if (e) {
      e.stopPropagation();
    }
    this._periods = this._periods
      .map((period: any) => {
        const newPeriod = { ...period };
        newPeriod.selected = false;
        return newPeriod;
      })
      .filter((period: any) => period.type === this.selectedPeriodType);
    this.periods$.next(this._periods);

    if (this.periodConfig.emitOnSelection) {
      this.getPeriodOutput();
    }
  }

  updatePeriod(e) {
    e.stopPropagation();
    this.getPeriodOutput();
  }

  getPeriodOutput() {
    this.periodFilterUpdate.emit({
      items: this.getSelectedPeriods(),
      dimension: 'pe'
    });
  }

  getSelectedPeriods() {
    return this._periods.filter((period: any) => period.selected);
  }

  closePeriodFilter(e) {
    e.stopPropagation();
    this.periodFilterClose.emit({
      items: this.getSelectedPeriods(),
      dimension: 'pe'
    });
  }
}
