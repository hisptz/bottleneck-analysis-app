import {Component, Input, OnInit} from '@angular/core';
import {ApplicationState} from '../../../store/application-state';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import {Dashboard} from '../../../model/dashboard';
import {dashboardsSelector} from '../../../store/selectors/dashboards.selector';
import {dashboardMenuItemsSelector} from '../../../store/selectors/dashboard-menu-items.selector';
import {allDashboardsSelector} from '../../../store/selectors/all-dashboards.selector';
import {DashboardGroupSettingsUpdateAction} from '../../../store/actions';
import {apiRootUrlSelector} from '../../../store/selectors/api-root-url.selector';

@Component({
  selector: 'app-dashboard-group-settings',
  templateUrl: './dashboard-group-settings.component.html',
  styleUrls: ['./dashboard-group-settings.component.css']
})
export class DashboardGroupSettingsComponent implements OnInit {

  dashboards$: Observable<any[]>;
  @Input() dashboardMenuObject: any;
  dashboardGroups$: Observable<any>;
  currentGroupToEdit: string = '';
  groupName: string = '';
  newGroupName: string = '';
  showAddInput: boolean = false;
  currentDashboardSelectionGroup: string = '';
  constructor(private store: Store<ApplicationState>) {
    this.dashboards$ = store.select(allDashboardsSelector);
  }

  ngOnInit() {
  }

  openGroupEditInput(group) {
    this.currentGroupToEdit = group;
    this.groupName = group;
  }

  saveGroupName(currentGroup, newGroupName) {
    const groupIndex = this.dashboardMenuObject.dashboardsMenuItems.groups.indexOf(currentGroup);
    const dashboards = this.dashboardMenuObject.dashboardsMenuItems.dashboards[currentGroup];
    delete this.dashboardMenuObject.dashboardsMenuItems.dashboards[currentGroup];
    this.dashboardMenuObject.dashboardsMenuItems.dashboards[newGroupName] = dashboards;
    if (groupIndex !== -1) {
      this.dashboardMenuObject.dashboardsMenuItems.groups[groupIndex] = newGroupName;
    }
    this.currentGroupToEdit = '';
  }

  getDashboardCounts(group) {
    const dashboards = this.dashboardMenuObject.dashboardsMenuItems.dashboards[group];

    if (dashboards) {
      return dashboards.length;
    }

    return 0;
  }

  addGroup(group) {
    if (group) {
      this.dashboardMenuObject.dashboardsMenuItems.groups.push(group);
      this.dashboardMenuObject.dashboardsMenuItems.dashboards[group] = [];
      this.newGroupName = ''
    }

    this.showAddInput = false;
  }

  deleteGroup(currentGroup) {
    const groupIndex = this.dashboardMenuObject.dashboardsMenuItems.groups.indexOf(currentGroup);
    if (groupIndex !== -1) {
      const dashboards = this.dashboardMenuObject.dashboardsMenuItems.dashboards[currentGroup];
      delete this.dashboardMenuObject.dashboardsMenuItems.dashboards[currentGroup];
      this.dashboardMenuObject.dashboardsMenuItems.groups.splice(groupIndex, 1);
    }
  }

  toggleDashboardSelection(currentGroup) {

    if (this.currentDashboardSelectionGroup === currentGroup) {
      this.currentDashboardSelectionGroup = ''
    } else {
      this.currentDashboardSelectionGroup = currentGroup;
    }
  }


  updateDashboardSelection(dashboard, dashboardGroup) {
    // console.log(JSON.stringify(this.dashboardMenuObject.dashboardsMenuItems.dashboards[dashboardGroup]));
    const groupDashboards = _.clone(this.dashboardMenuObject.dashboardsMenuItems.dashboards[dashboardGroup]);

    const selectedDashboard = _.find(groupDashboards, ['id', dashboard.id]);
    console.log(dashboard.selected);
    if (dashboard.selected) {
      if (!selectedDashboard) {
        groupDashboards.push({
          id: dashboard.id
        })
      }
    } else if (selectedDashboard) {
      const selectedDashboardIndex = _.findIndex(groupDashboards, selectedDashboard);
      groupDashboards.splice(selectedDashboardIndex, 1);
    }

    this.dashboardMenuObject.dashboardsMenuItems.dashboards[dashboardGroup] = groupDashboards;
  }

  updateSettings() {
    const newDashboardGroupSettings = {
      useDashboardGroups: this.dashboardMenuObject.showInGroupFormat,
      dashboardGroups: this.compileDashboardGroups(this.dashboardMenuObject.dashboardsMenuItems)
    };

    this.store.select(apiRootUrlSelector)
      .subscribe(apiRootUrl => {
        if (apiRootUrl !== '') {
          this.store.dispatch(new DashboardGroupSettingsUpdateAction(
            {
              apiRootUrl: apiRootUrl,
              dashboardGroupSettings: newDashboardGroupSettings
            })
          )
        }
      })
  }

  compileDashboardGroups(dashboardsGroupItem) {
    return dashboardsGroupItem.groups.map(group => {
      return {
        name: group,
        dashboards: dashboardsGroupItem.dashboards[group] ? dashboardsGroupItem.dashboards[group].map(dashboard => { return dashboard.id}) : []
      }
    })
  }

}
