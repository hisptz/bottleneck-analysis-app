import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit
} from '@angular/core';
import { Dashboard, DashboardGroups } from '../../models';
import { User, SystemInfo } from '../../../models';
import { DataGroup } from '../../modules/ngx-dhis2-data-selection-filter/modules/data-filter/store/models/data-group.model';

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardMenuComponent implements OnInit {
  @Input()
  dashboardMenuList: Dashboard[];
  @Input()
  currentDashboardId: string;
  @Input()
  dashboardGroups: DashboardGroups[];

  @Input()
  currentUser: User;

  @Input()
  systemInfo: SystemInfo;

  @Input()
  activeDashboardGroupId: string;

  @Input()
  dataGroups: DataGroup[];

  @Output()
  setCurrentDashboard: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  setActiveDashboardGroup: EventEmitter<DashboardGroups> = new EventEmitter<
    DashboardGroups
  >();

  @Output()
  createDashboard: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  toggleDashboardBookmark: EventEmitter<{
    id: string;
    bookmarked: boolean;
    supportBookmark;
  }> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  onSetCurrentDashboard(dashboardId: string) {
    this.setCurrentDashboard.emit(dashboardId);
  }

  onSetActiveDashboardGroup(group: DashboardGroups) {
    this.setActiveDashboardGroup.emit(group);
  }

  onToggleDashboardMenuItemBookmark(dashboardMenuDetails: any) {
    this.toggleDashboardBookmark.emit(dashboardMenuDetails);
  }

  onCreateDashboard(dashboard: any) {
    this.createDashboard.emit({
      dashboard,
      currentUser: this.currentUser,
      systemInfo: this.systemInfo,
      dataGroups: this.dataGroups
    });
  }
}
