import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Dashboard, DashboardGroups } from '../../models';

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardMenuComponent {
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
  setActiveDashboardGroup: EventEmitter<DashboardGroups> = new EventEmitter<DashboardGroups>();

  @Output()
  createDashboard: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  toggleDashboardBookmark: EventEmitter<{
    id: string;
    bookmarked: boolean;
    supportBookmark;
  }> = new EventEmitter();
  constructor() {}

  onSetCurrentDashboard(dashboardId: string) {
    this.setCurrentDashboard.emit(dashboardId);
  }

  onSetActiveDashboardGroup(group: DashboardGroups) {
    this.setActiveDashboardGroup.emit(group);
  }

  onToggleDashboardMenuItemBookmark(dashboardMenuDetails: any) {
    this.toggleDashboardBookmark.emit(dashboardMenuDetails);
  }

  onCreateDashboard(dashboardName: string) {
    this.createDashboard.emit(dashboardName);
  }
}
