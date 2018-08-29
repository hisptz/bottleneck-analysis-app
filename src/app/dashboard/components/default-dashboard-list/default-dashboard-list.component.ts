import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { generateUid } from '../../../helpers/generate-uid.helper';

interface DefaultDashboard {
  id: string;
  name: string;
  showEditForm?: boolean;
  showDeleteDialog?: boolean;
}

const DASHBOARD_ITEMS = [
  {
    shape: 'FULL_WIDTH',
    type: 'CHART'
  },
  {
    shape: 'FULL_WIDTH',
    type: 'REPORT_TABLE'
  },
  {
    shape: 'FULL_WIDTH',
    type: 'APP'
  }
];

@Component({
  selector: 'app-default-dashboard-list',
  templateUrl: './default-dashboard-list.component.html',
  styleUrls: ['./default-dashboard-list.component.scss']
})
export class DefaultDashboardListComponent implements OnInit {
  @Input()
  defaultDashboardList: DefaultDashboard[];
  showDefaultList: boolean;
  showInterventionForm: boolean;
  newInterventionName: string;
  savingIntervention: boolean;
  searchTerm: string;

  @Output()
  create: EventEmitter<any> = new EventEmitter<any>();
  constructor() {
    this.defaultDashboardList = [
      {
        id: generateUid(),
        name: 'Antenatal Care'
      },
      {
        id: generateUid(),
        name: 'Immunization'
      },
      {
        id: generateUid(),
        name: 'Malaria Treatment'
      },
      {
        id: generateUid(),
        name: 'Skilled Birth Delivery'
      }
    ];
  }

  get dashboardList(): DefaultDashboard[] {
    return this.searchTerm
      ? _.filter(this.defaultDashboardList, (dashboard: DefaultDashboard) => {
          return (
            (dashboard.name || '')
              .toLowerCase()
              .indexOf(this.searchTerm.toLowerCase()) !== -1
          );
        })
      : this.defaultDashboardList;
  }
  ngOnInit() {}

  onSearchDashboard(e) {
    e.stopPropagation();
    this.searchTerm = e.target.value.trim();
    this.showDefaultList = true;
  }

  onAddDashboard(dashboard: DefaultDashboard, e?) {
    if (e) {
      e.stopPropagation();
    }
    this.showDefaultList = false;
    this.create.emit({ ...dashboard, dashboardItems: DASHBOARD_ITEMS });
  }

  onToggleInterventionList(e) {
    e.stopPropagation();
    this.showDefaultList = !this.showDefaultList;
  }

  onToggleInterventionForm(e?) {
    if (e) {
      e.stopPropagation();
    }
    this.showInterventionForm = !this.showInterventionForm;
  }

  onToggleInterventionEditForm(intervention, e?) {
    if (e) {
      e.stopPropagation();
    }
    this.defaultDashboardList = _.map(
      this.defaultDashboardList,
      (interventionItem: any) => {
        return intervention.id === interventionItem.id
          ? {
              ...interventionItem,
              showEditForm: !interventionItem.showEditForm
            }
          : interventionItem;
      }
    );
  }

  onToggleInterventionDelete(intervention, e?) {
    if (e) {
      e.stopPropagation();
    }
    this.defaultDashboardList = _.map(
      this.defaultDashboardList,
      (interventionItem: any) => {
        return intervention.id === interventionItem.id
          ? {
              ...interventionItem,
              showDeleteDialog: !interventionItem.showDeleteDialog
            }
          : interventionItem;
      }
    );
  }

  onEnterInterventionName(e) {
    e.stopPropagation();
    this.newInterventionName = e.target.value.trim();
  }

  onAddIntervention(intervention: any) {
    this.showInterventionForm = false;
    this.defaultDashboardList = [...this.defaultDashboardList, intervention];

    // this.onAddDashboard(intervention);
  }

  onUpdateIntervention(intervention: any) {
    this.defaultDashboardList = _.map(
      this.defaultDashboardList,
      (interventionItem: any) => {
        return intervention.id === interventionItem.id
          ? {
              ...interventionItem,
              showEditForm: !interventionItem.showEditForm,
              name: intervention.name
            }
          : interventionItem;
      }
    );
  }

  onDeleteIntervention(intervention, e?) {
    if (e) {
      e.stopPropagation();
    }
    this.defaultDashboardList = _.map(
      this.defaultDashboardList,
      (interventionItem: any) => {
        return intervention.id === interventionItem.id
          ? {
              ...interventionItem,
              showDeleteDialog: !interventionItem.showDeleteDialog,
              deleting: true
            }
          : interventionItem;
      }
    );
  }
}
