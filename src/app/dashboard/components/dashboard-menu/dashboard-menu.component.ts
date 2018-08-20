import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  SimpleChanges
} from '@angular/core';
import { Dashboard, DashboardGroups } from '../../models';

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardMenuComponent implements OnChanges {
  @Input()
  dashboardMenuList: Dashboard[];
  @Input()
  currentDashboardId: string;
  @Input()
  dashboardGroups: DashboardGroups[];

  @Input()
  activeDashboardGroupId: string;

  @Output()
  setCurrentDashboard: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  setActiveDashboardGroup: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  createDashboard: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  toggleDashboardBookmark: EventEmitter<{
    id: string;
    bookmarked: boolean;
    supportBookmark;
  }> = new EventEmitter();
  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    const { activeDashboardGroupId } = changes;
    if (activeDashboardGroupId) {
      const { dashboards } = this.dashboardGroups.find(({ id }) => id === activeDashboardGroupId.currentValue);
      if (!dashboards.includes(this.currentDashboardId)) {
        const [firstDashboard, ...rest] = dashboards;
        this.onSetCurrentDashboard(firstDashboard);
      }
    }
  }

  onSetCurrentDashboard(dashboardId: string) {
    this.setCurrentDashboard.emit(dashboardId);
  }

  onSetActiveDashboardGroup(groupId: string) {
    this.setActiveDashboardGroup.emit(groupId);
  }

  onToggleDashboardMenuItemBookmark(dashboardMenuDetails: any) {
    this.toggleDashboardBookmark.emit(dashboardMenuDetails);
  }

  onCreateDashboard(dashboardName: string) {
    this.createDashboard.emit(dashboardName);
  }
}
