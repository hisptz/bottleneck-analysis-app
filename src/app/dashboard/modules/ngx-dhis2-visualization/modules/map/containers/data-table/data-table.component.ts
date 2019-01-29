import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() mapVisualizationObject;
  public _mapVisualizationObject;
  constructor(private store: Store<fromStore.MapState>) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const { mapVisualizationObject } = changes;
    this._mapVisualizationObject = mapVisualizationObject.currentValue;
  }

  toggleDataTableView(event) {
    event.stopPropagation();
    this.store.dispatch(
      new fromStore.ToggleDataTable(this._mapVisualizationObject.componentId)
    );
  }
}
