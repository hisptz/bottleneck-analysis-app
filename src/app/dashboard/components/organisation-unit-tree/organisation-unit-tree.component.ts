import {Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import {IActionMapping, TREE_ACTIONS, TreeComponent} from "angular2-tree-component";
import {OrgUnitService} from "../../providers/org-unit.service";
import {FilterService} from "../../providers/filter.service";
import {Constants} from "../../../shared/constants";

// costants for enabling the organisation unit tree to have
const actionMapping1:IActionMapping = {
  mouse: {
    click: (node, tree, $event) => {
      $event.shiftKey
        ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
        : TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event)
    }
  }
};

const actionMapping:IActionMapping = {
  mouse: {
    dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
    click: (node, tree, $event) => TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
  }
};

@Component({
  selector: 'app-organisation-unit-tree',
  templateUrl: './organisation-unit-tree.component.html',
  styleUrls: ['./organisation-unit-tree.component.css']
})
export class OrganisationUnitTreeComponent implements OnInit {

  customTemplateStringOrgunitOptions: any = {actionMapping};
  // the object that will carry the output value
  @Input() orgunit_model: any = {
    selection_mode: "orgUnit",
    selected_level: "",
    selected_group: "",
    orgunit_levels: [],
    orgunit_groups: [],
    selected_orgunits: [],
    user_orgunits: []
  };

  // The organisation unit configuration object This will have to come from outside.
  @Input() orgunit_tree_config: any = {
    show_search : true,
    search_text : 'Search',
    level: null,
    loading: false,
    loading_message: 'Loading Organisation units...',
    multiple: true,
    placeholder: "Select Organisation Unit"
  };

  @Output() onOrgUnitUpdate : EventEmitter<any> = new EventEmitter<any>();

  orgUnit: any = {};

  @ViewChild('orgtree')
  orgtree: TreeComponent;

  organisationunits: any[] = [];
  selected_orgunits: any[] = [];

  // this variable controls the visibility of of the tree
  showOrgTree:boolean = true;
  constructor(
              private filterService: FilterService,
              private costant: Constants,
              private orgunitService: OrgUnitService) {

  }

  ngOnInit() {
    this.orgunitService.getOrgunitLevelsInformation()
      .subscribe(
        (data: any) => {
          // assign urgunit levels and groups to variables
          this.orgunit_model.orgunit_levels = data.organisationUnitLevels;
          this.orgunitService.getOrgunitGroups().subscribe( groups => {//noinspection TypeScriptUnresolvedVariable
            this.orgunit_model.orgunit_groups = groups.organisationUnitGroups
          });
          if (this.orgunitService.nodes == null) {
            this.orgunitService.getUserInformation().subscribe(
              userOrgunit => {
                let level = this.orgunitService.getUserHighestOrgUnitlevel(userOrgunit);
                let all_levels = data.pager.total;
                let orgunits = this.orgunitService.getuserOrganisationUnitsWithHighestlevel(level,userOrgunit);
                let use_level = parseInt(all_levels) - (parseInt(level) - 1);
                this.orgunit_model.user_orgunits = orgunits;

                //load inital orgiunits to speed up loading speed
                this.orgunitService.getInitialOrgunitsForTree(orgunits).subscribe(
                  (initial_data) => {
                    //noinspection TypeScriptUnresolvedVariable
                    this.orgUnit = {
                      id: initial_data.organisationUnits[0].id,
                      name: initial_data.organisationUnits[0].name,
                      children: initial_data.organisationUnits[0].children
                    };
                    this.orgunit_model.selected_orgunits = [this.orgUnit];
                    // this.orgUnitlength = this.orgUnit.children.length+1;
                    // this.metadata_ready = true;
                    //noinspection TypeScriptUnresolvedVariable
                    this.organisationunits = initial_data.organisationUnits;
                    this.activateNode(this.orgUnit.id, this.orgtree);
                    this.orgunit_tree_config.loading = false;
                    // after done loading initial organisation units now load all organisation units
                    let fields = this.orgunitService.generateUrlBasedOnLevels(use_level);
                    this.orgunitService.getAllOrgunitsForTree1(fields, orgunits).subscribe(
                      items => {
                        //noinspection TypeScriptUnresolvedVariable
                        this.organisationunits = items.organisationUnits;
                        //noinspection TypeScriptUnresolvedVariable
                        this.orgunitService.nodes = items.organisationUnits;
                        this.prepareOrganisationUnitTree(this.organisationunits, 'parent');
                      },
                      error => {
                        console.log('something went wrong while fetching Organisation units');
                        this.orgunit_tree_config.loading = false;
                      }
                    )
                  },
                  error => {
                    console.log('something went wrong while fetching Organisation units');
                    this.orgunit_tree_config.loading = false;
                  }
                )

              }
            )
          }
          else {
            this.orgunit_tree_config.loading = false;
            // this.default_orgUnit = [this.orgunitService.nodes[0].id];
            this.orgUnit = {
              id: this.orgunitService.nodes[0].id,
              name: this.orgunitService.nodes[0].name,
              children: this.orgunitService.nodes[0].children
            };
            this.orgunit_model.selected_orgunits = [this.orgUnit];
            // this.orgUnitlength = this.orgUnit.children.length+1;
            this.organisationunits = this.orgunitService.nodes;
            this.orgunit_model.orgunit_levels = this.orgunitService.orgunit_levels;
            this.orgunitService.getOrgunitGroups().subscribe( groups => {//noinspection TypeScriptUnresolvedVariable
              this.orgunit_model.orgunit_groups = groups.organisationUnitGroups
            });
            this.activateNode(this.orgUnit.id, this.orgtree);
            this.prepareOrganisationUnitTree(this.organisationunits, 'parent');
          }

        }
      );
  }

  // display Orgunit Tree
  displayOrgTree(){
    this.showOrgTree = !this.showOrgTree;
  }

  activateNode(nodeId:any, nodes){
    setTimeout(() => {
      let node = nodes.treeModel.getNodeById(nodeId);
      if (node)
        node.toggleActivated();
    }, 0);
  }

  // check if orgunit already exist in the orgunit display list
  checkOrgunitAvailabilty(orgunit, array): boolean{
    let checker = false;
    array.forEach((value) => {
      if( value.id == orgunit.id ){
        checker = true;
      }
    });
    return checker;
  }

  // action to be called when a tree item is deselected(Remove item in array of selected items
  deactivateOrg ( $event ) {
    this.orgunit_model.selected_orgunits.forEach((item,index) => {
      if( $event.node.data.id == item.id ) {
        this.orgunit_model.selected_orgunits.splice(index, 1);
      }
    });
  };

  // add item to array of selected items when item is selected
  activateOrg = ($event) => {
    this.selected_orgunits = [$event.node.data];
    if(!this.checkOrgunitAvailabilty($event.node.data, this.orgunit_model.selected_orgunits)){
      this.orgunit_model.selected_orgunits.push($event.node.data);
    }
    this.orgUnit = $event.node.data;
  };

  prepareOrganisationUnitTree(organisationUnit,type:string='top') {
    if (type == "top"){
      if (organisationUnit.children) {
        organisationUnit.children.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        organisationUnit.children.forEach((child) => {
          this.prepareOrganisationUnitTree(child,'top');
        })
      }
    }else{
      organisationUnit.forEach((orgunit) => {
        if (orgunit.children) {
          orgunit.children.sort((a, b) => {
            if (a.name > b.name) {
              return 1;
            }
            if (a.name < b.name) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });
          orgunit.children.forEach((child) => {
            this.prepareOrganisationUnitTree(child,'top');
          })
        }
      });
    }
  }

  updateOrgUnitModel() {
    this.displayOrgTree();
    this.onOrgUnitUpdate.emit({name: 'ou', value: this.getOrgUnitsForAnalytics(this.orgunit_model,true)});
  }

  // a function to prepare a list of organisation units for analytics
  getOrgUnitsForAnalytics(orgunit_model:any, with_children:boolean): string{
    let orgUnits = [];
    let organisation_unit_analytics_string = "";
    // if the selected orgunit is user org unit
    if(orgunit_model.selection_mode == "Usr_orgUnit"){
      if(orgunit_model.user_orgunits.length == 1){
        let user_orgunit = this.orgtree.treeModel.getNodeById(orgunit_model.user_orgunits[0]);
        orgUnits.push(user_orgunit.id);
        if(user_orgunit.hasOwnProperty('children') && with_children){
          for( let orgunit of user_orgunit.children ){
            orgUnits.push(orgunit.id);
          }
        }
      }else{
        organisation_unit_analytics_string += orgunit_model.selected_user_orgunit
      }
    }

    else{
      // if there is only one organisation unit selected
      if ( orgunit_model.selected_orgunits.length == 1 ){
        let detailed_orgunit = this.orgtree.treeModel.getNodeById(orgunit_model.selected_orgunits[0].id);
        orgUnits.push(detailed_orgunit.id);
        if(detailed_orgunit.hasOwnProperty('children') && with_children){
          for( let orgunit of detailed_orgunit.children ){
            orgUnits.push(orgunit.id);
          }
        }

      }
      // If there is more than one organisation unit selected
      else{
        orgunit_model.selected_orgunits.forEach((orgunit) => {
          orgUnits.push(orgunit.id);
        })
      }
      if(orgunit_model.selection_mode == "orgUnit"){

      }if(orgunit_model.selection_mode == "Level"){
        organisation_unit_analytics_string += orgunit_model.selected_level+";";
      }if(orgunit_model.selection_mode == "Group"){
        organisation_unit_analytics_string += orgunit_model.selected_group+";";
      }
    }

    return organisation_unit_analytics_string+orgUnits.join(";");
  }
}
