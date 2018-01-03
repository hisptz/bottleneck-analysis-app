import {Component, Input, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {OrgUnitModel} from './models/orgunit.model';
import {INITIAL_ORG_UNIT_MODEL} from './constants/orgunit-model.constant';
import {OrgUnitTemplateOptions} from './models/orunit-template-options.model';
import {INITIAL_ORG_UNIT_TEMPLATE_OPTIONS} from './constants/orgunit-template-options.constant';
import {OrgUnitTreeConfiguration} from './models/orgunit-tree-configuration.model';
import {INITIAL_ORG_UNIT_TREE_CONFIGURATION} from './constants/orgunit-tree-configuration.constant';
import {OrgUnitService} from './orgunit.service-new';
import {TreeComponent} from 'angular-tree-component';

@Component({
  selector: 'app-org-unit-filter',
  templateUrl: './org-unit-filter.component.html',
  styleUrls: ['./org-unit-filter.component.css']
})
export class OrgUnitFilterComponent implements OnInit {

  /**
   * Get org unit model from supplied value on component calling
   */
  @Input() orgUnitModel: OrgUnitModel = INITIAL_ORG_UNIT_MODEL;

  /**
   * Get org unit tree template options from supplied value on component calling
   */
  @Input() orgUnitTemplateOptions: OrgUnitTemplateOptions = INITIAL_ORG_UNIT_TEMPLATE_OPTIONS;

  /**
   * Get org unit tree configuration from supplied value on component calling
   */
  @Input() orgUnitTreeConfiguration: OrgUnitTreeConfiguration = INITIAL_ORG_UNIT_TREE_CONFIGURATION;

  @ViewChild('orgUnitTree')
  orgUnitTree: TreeComponent;


  public loading: boolean;

  private _maximumItemsToShow: number;

  private _canShowAllSelectedOrgUnits: boolean;

  showOrgUnitSettings: boolean;

  nodes: any[];

  constructor(private orgUnitFilterService: OrgUnitService) {
    this.loading = true;
    this._maximumItemsToShow = this.orgUnitTemplateOptions.maximumItemsToShow;
    this.nodes = [];
  }

  get moreItemsCount(): number {
    return this.orgUnitModel.selectedOrgUnits.length - this._maximumItemsToShow;
  }

  get selectionMode(): string {
    return this.orgUnitModel.selectionMode;
  }

  get loadingMessage(): string {
    return this.orgUnitTemplateOptions.loadingMessage;
  }

  get orgUnitPlaceholder(): string {
    return this.orgUnitTemplateOptions.orgUnitPlaceholder;
  }

  get orgUnitTreeOptions(): any {
    return this.orgUnitTreeConfiguration.orgUnitTreeOptions;
  }

  get showClearAllButton(): boolean {
    return this.orgUnitModel.selectedOrgUnits.length > 0;
  }

  get showOrgUnitPlaceholder(): boolean {
    return !this.loading && this.orgUnitModel.selectedOrgUnits.length === 0 && this.orgUnitModel.selectionMode !== 'USER_ORG_UNIT';
  }

  get enableShowMoreButton(): boolean {
    return this.orgUnitModel.selectedOrgUnits.length > this._maximumItemsToShow &&
      !this._canShowAllSelectedOrgUnits;
  }

  get enableShowLessButton(): boolean {
    return this.orgUnitModel.selectedOrgUnits.length === this._maximumItemsToShow &&
      this._maximumItemsToShow !== this.orgUnitTemplateOptions.maximumItemsToShow &&
      this._canShowAllSelectedOrgUnits;
  }

  get selectedOrgUnitToDisplay() {

    if (this._canShowAllSelectedOrgUnits) {
      this._maximumItemsToShow = this.orgUnitModel.selectedOrgUnits.length;
    }
    return _.filter(this.orgUnitModel.selectedOrgUnits, (orgUnit: any, orgUnitIndex: number) => orgUnitIndex < this._maximumItemsToShow);
  }

  ngOnInit() {

    /**
     * Update org unit configuration tree configuration
     */
    this.orgUnitTreeConfiguration = this.orgUnitFilterService
      .getSanitizedOrgUnitTreeConfiguration(this.orgUnitTreeConfiguration);

    this.orgUnitFilterService.getSanitizedOrgUnitModel(this.orgUnitModel)
      .subscribe((orgUnitModel) => {
        this.orgUnitModel = {...orgUnitModel};

        this.nodes = this.orgUnitModel.orgUnits.length > 0 ? this._prepareTreeNodes(this.orgUnitModel.orgUnits) : [];

        this.loading = false;
      });
  }

  updateOrgUnit(e) {
    e.stopPropagation();
    console.log(this.orgUnitModel);
  }

  setType(type: string) {
    this.orgUnitModel.selectionMode = type;
    if (type !== 'orgUnit') {
      this.orgUnitModel.selectedUserOrgUnits = [];
    }
    if (type !== 'Level') {
      this.orgUnitModel.selectedLevels = [];
    }
    if (type !== 'Group') {
      this.orgUnitModel.selectedGroups = [];
    }
  }

  toggleSelectedOrgUnitCount(e) {
    e.stopPropagation();

    if (this._maximumItemsToShow !== this.orgUnitTemplateOptions.maximumItemsToShow) {
      this._canShowAllSelectedOrgUnits = false;
      this._maximumItemsToShow = this.orgUnitTemplateOptions.maximumItemsToShow;
    } else {
      this._canShowAllSelectedOrgUnits = true;
      this._maximumItemsToShow = this.orgUnitModel.selectedOrgUnits.length;
    }
  }

  clearAllSelected(e) {
    e.stopPropagation();
    for (const selectedOrgUnit of this.orgUnitModel.selectedOrgUnits) {
      // this.deActivateNode(selectedOrgUnit.id, this.orgUnitTree, null);
    }
  }

  private _prepareTreeNodes(orgUnits: any[]) {
    const newOrgUnits = [...orgUnits];

    /**
     * Make parent org unit to be expanded by default
     */
    if (newOrgUnits.length > 0) {
      newOrgUnits[0].expanded = true;
    }

    /**
     * Sort nodes
     */
    return this._getSortedNodes(newOrgUnits);
  }

  private _getSortedNodes(nodes: any[]) {
    let newNodes: any[] = nodes.slice(0);

    if (newNodes) {
      newNodes = _.sortBy(newNodes, ['name']);
      newNodes.forEach((node: any) => {
        if (node.children) {
          node.children = this._getSortedNodes(node.children);
        }
      });
    }
    return newNodes;
  }

  activateNode(nodeId: string, nodes: any, first: any) {
    setTimeout(() => {
      const node = nodes.treeModel.getNodeById(nodeId);
      if (node) {
        node.setIsActive(true, true);
      }

      if (first && node) {
        node.toggleExpanded();
      }
    }, 0);
  }

  deActivateNode(nodeId: any, nodes, event) {
    setTimeout(() => {
      const node = nodes.treeModel.getNodeById(nodeId);
      if (node) {
        node.setIsActive(false, true);
      }
    }, 0);
    if (event != null) {
      event.stopPropagation();
    }
  }

  activateOrgUnit($event) {
    if (this.orgUnitModel.selectionMode === 'USER_ORG_UNIT') {
      this.orgUnitModel.selectionMode = 'ORG_UNIT';
    }

    if (!this._isOrgUnitAvailable($event.node.data, this.orgUnitModel.selectedOrgUnits)) {

      this.orgUnitModel.selectedOrgUnits = [...this.orgUnitModel.selectedOrgUnits, $event.node.data];
    }
  }

  deactivateOrgUnit($event) {
    if (this.orgUnitModel.selectionMode === 'USER_ORG_UNIT') {
      this.orgUnitModel.selectionMode = 'ORG_UNIT';
    }
    const orgUnitIndex = _.findIndex(this.orgUnitModel.selectedOrgUnits,
      _.find(this.orgUnitModel.selectedOrgUnits, ['id', $event.node.data.id]));

    if (orgUnitIndex !== -1) {
      this.orgUnitModel.selectedOrgUnits = [
        ..._.slice(this.orgUnitModel.selectedOrgUnits, 0, orgUnitIndex),
        ..._.slice(this.orgUnitModel.selectedOrgUnits, orgUnitIndex + 1)];
    }

  }

  private _isOrgUnitAvailable(orgUnit: any, orgUnitArray: any[]): boolean {
    return _.find(orgUnitArray, ['id', orgUnit.id]) ? true : false;
  }

}
