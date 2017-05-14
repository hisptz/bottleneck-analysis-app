var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { TreeComponent, TREE_ACTIONS } from "angular2-tree-component";
import { Observable } from "rxjs";
import { OrgUnitService } from "./org-unit.service";
export var OrgUnitFilterComponent = (function () {
    function OrgUnitFilterComponent(http, orgunitService) {
        var _this = this;
        this.http = http;
        this.orgunitService = orgunitService;
        // the object that will carry the output value you can send one from outside to config start values
        this.orgunit_model = {
            selection_mode: "Usr_orgUnit",
            selected_level: "",
            show_update_button: true,
            selected_group: "",
            orgunit_levels: [],
            orgunit_groups: [],
            selected_orgunits: [],
            user_orgunits: [],
            type: "report",
            selected_user_orgunit: "USER_ORGUNIT"
        };
        // The organisation unit configuration object This will have to come from outside.
        this.orgunit_tree_config = {
            show_search: true,
            search_text: 'Search',
            level: null,
            loading: true,
            loading_message: 'Loading Organisation units...',
            multiple: false,
            multiple_key: "none",
            placeholder: "Select Organisation Unit"
        };
        this.disabled = false;
        this.onOrgUnitUpdate = new EventEmitter();
        this.onOrgUnitInit = new EventEmitter();
        this.orgUnit = {};
        this.root_url = '../../../';
        this.nodes = null;
        this.orgunit_levels = [];
        this.organisationunits = [];
        this.selected_orgunits = [];
        // this variable controls the visibility of of the tree
        this.showOrgTree = true;
        // add item to array of selected items when item is selected
        this.activateOrg = function ($event) {
            if (_this.orgunit_model.selection_mode == "Usr_orgUnit") {
                _this.orgunit_model.selection_mode = "orgUnit";
            }
            _this.selected_orgunits = [$event.node.data];
            if (!_this.checkOrgunitAvailabilty($event.node.data, _this.orgunit_model.selected_orgunits)) {
                _this.orgunit_model.selected_orgunits.push($event.node.data);
            }
            _this.orgUnit = $event.node.data;
        };
        if (!this.orgunit_tree_config.hasOwnProperty("multiple_key")) {
            this.orgunit_tree_config.multiple_key = "none";
        }
    }
    OrgUnitFilterComponent.prototype.updateModelOnSelect = function (data) {
        var _this = this;
        if (!this.orgunit_model.show_update_button) {
            setTimeout(function (data) {
                console.log("kefsafsa", _this.getOrgUnitsForAnalytics(_this.orgunit_model, false));
                _this.onOrgUnitUpdate.emit({ name: 'ou', value: _this.getOrgUnitsForAnalytics(_this.orgunit_model, false) });
                _this.displayOrgTree();
            }, 0);
        }
    };
    OrgUnitFilterComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.orgunit_tree_config.multiple) {
            if (this.orgunit_tree_config.multiple_key == "none") {
                var actionMapping = {
                    mouse: {
                        dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
                        click: function (node, tree, $event) { return TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event); }
                    }
                };
                this.customTemplateStringOrgunitOptions = { actionMapping: actionMapping };
            }
            else if (this.orgunit_tree_config.multiple_key == "control") {
                var actionMapping = {
                    mouse: {
                        click: function (node, tree, $event) {
                            $event.ctrlKey
                                ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
                                : TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event);
                        }
                    }
                };
                this.customTemplateStringOrgunitOptions = { actionMapping: actionMapping };
            }
            else if (this.orgunit_tree_config.multiple_key == "shift") {
                var actionMapping = {
                    mouse: {
                        click: function (node, tree, $event) {
                            $event.shiftKey
                                ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
                                : TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event);
                        }
                    }
                };
                this.customTemplateStringOrgunitOptions = { actionMapping: actionMapping };
            }
        }
        else {
            var actionMapping = {
                mouse: {
                    dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
                    click: function (node, tree, $event) { return TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event); }
                }
            };
            this.customTemplateStringOrgunitOptions = { actionMapping: actionMapping };
        }
        // if (this.orgunitService.nodes == null) {
        this.orgunitService.getOrgunitLevelsInformation()
            .subscribe(function (data) {
            // assign urgunit levels and groups to variables
            _this.orgunit_model.orgunit_levels = data.organisationUnitLevels;
            // setting organisation groups
            _this.orgunitService.getOrgunitGroups().subscribe(function (groups) {
                _this.orgunit_model.orgunit_groups = groups;
            });
            // identify currently logged in usser
            _this.orgunitService.getUserInformation(_this.orgunit_model.type).subscribe(function (userOrgunit) {
                var level = _this.orgunitService.getUserHighestOrgUnitlevel(userOrgunit);
                _this.orgunit_model.user_orgunits = _this.orgunitService.getUserOrgUnits(userOrgunit);
                _this.orgunitService.user_orgunits = _this.orgunitService.getUserOrgUnits(userOrgunit);
                if (_this.orgunit_model.selection_mode == "Usr_orgUnit") {
                    _this.orgunit_model.selected_orgunits = _this.orgunit_model.user_orgunits;
                }
                var all_levels = data.pager.total;
                var orgunits = _this.orgunitService.getuserOrganisationUnitsWithHighestlevel(level, userOrgunit);
                var use_level = parseInt(all_levels) - (parseInt(level) - 1);
                // this.orgunit_model.user_orgunits = orgunits;
                //load inital orgiunits to speed up loading speed
                _this.orgunitService.getInitialOrgunitsForTree(orgunits).subscribe(function (initial_data) {
                    _this.organisationunits = initial_data;
                    _this.orgunit_tree_config.loading = false;
                    // after done loading initial organisation units now load all organisation units
                    var fields = _this.orgunitService.generateUrlBasedOnLevels(use_level);
                    _this.orgunitService.getAllOrgunitsForTree1(fields, orgunits).subscribe(function (items) {
                        _this.organisationunits = items;
                        //activate organisation units
                        for (var _i = 0, _a = _this.orgunit_model.selected_orgunits; _i < _a.length; _i++) {
                            var active_orgunit = _a[_i];
                            _this.activateNode(active_orgunit.id, _this.orgtree);
                        }
                        _this.prepareOrganisationUnitTree(_this.organisationunits, 'parent');
                    }, function (error) {
                        console.log('something went wrong while fetching Organisation units');
                        _this.orgunit_tree_config.loading = false;
                    });
                }, function (error) {
                    console.log('something went wrong while fetching Organisation units');
                    _this.orgunit_tree_config.loading = false;
                });
            });
        });
        // }
        // else {
        //
        //   this.orgunitService.getAllOrgunitsForTree1().subscribe(
        //     (data) => {
        //       this.organisationunits = data;
        //     }
        //   );
        //
        //   this.orgunit_model.orgunit_levels = this.orgunitService.orgunit_levels;
        //   this.orgunit_model.user_orgunits = this.orgunitService.user_orgunits;
        //   this.orgunit_model.orgunit_groups = this.orgunitService.orgunit_groups;
        //   this.orgunit_tree_config.loading = false;
        //   //activate organisation units
        //   if(this.orgunit_model.selection_mode == "Usr_orgUnit"){
        //     this.orgunit_model.selected_orgunits = this.orgunit_model.user_orgunits;
        //     for( let active_orgunit of this.orgunit_model.selected_orgunits ){
        //       this.activateNode(active_orgunit.id, this.orgtree);
        //     }
        //   }
        //
        //   // this will pass through the tree and sort items
        //   this.prepareOrganisationUnitTree(this.organisationunits, 'parent');
        // }
    };
    // display Orgunit Tree
    OrgUnitFilterComponent.prototype.displayOrgTree = function () {
        if (!this.disabled) {
            this.showOrgTree = !this.showOrgTree;
        }
    };
    OrgUnitFilterComponent.prototype.activateNode = function (nodeId, nodes) {
        setTimeout(function () {
            var node = nodes.treeModel.getNodeById(nodeId);
            if (node)
                node.setIsActive(true, true);
        }, 0);
    };
    // a method to activate the model
    OrgUnitFilterComponent.prototype.deActivateNode = function (nodeId, nodes, event) {
        setTimeout(function () {
            var node = nodes.treeModel.getNodeById(nodeId);
            if (node)
                node.setIsActive(false, true);
        }, 0);
        if (event != null) {
            event.stopPropagation();
        }
    };
    // check if orgunit already exist in the orgunit display list
    OrgUnitFilterComponent.prototype.checkOrgunitAvailabilty = function (orgunit, array) {
        var checker = false;
        array.forEach(function (value) {
            if (value.id == orgunit.id) {
                checker = true;
            }
        });
        return checker;
    };
    // action to be called when a tree item is deselected(Remove item in array of selected items
    OrgUnitFilterComponent.prototype.deactivateOrg = function ($event) {
        var _this = this;
        if (this.orgunit_model.selection_mode == "Usr_orgUnit") {
            this.orgunit_model.selection_mode = "orgUnit";
        }
        this.orgunit_model.selected_orgunits.forEach(function (item, index) {
            if ($event.node.data.id == item.id) {
                _this.orgunit_model.selected_orgunits.splice(index, 1);
            }
        });
    };
    ;
    OrgUnitFilterComponent.prototype.prepareOrganisationUnitTree = function (organisationUnit, type) {
        var _this = this;
        if (type === void 0) { type = 'top'; }
        if (type == "top") {
            if (organisationUnit.children) {
                organisationUnit.children.sort(function (a, b) {
                    if (a.name > b.name) {
                        return 1;
                    }
                    if (a.name < b.name) {
                        return -1;
                    }
                    // a must be equal to b
                    return 0;
                });
                organisationUnit.children.forEach(function (child) {
                    _this.prepareOrganisationUnitTree(child, 'top');
                });
            }
        }
        else {
            organisationUnit.forEach(function (orgunit) {
                if (orgunit.children) {
                    orgunit.children.sort(function (a, b) {
                        if (a.name > b.name) {
                            return 1;
                        }
                        if (a.name < b.name) {
                            return -1;
                        }
                        // a must be equal to b
                        return 0;
                    });
                    orgunit.children.forEach(function (child) {
                        _this.prepareOrganisationUnitTree(child, 'top');
                    });
                }
            });
        }
    };
    OrgUnitFilterComponent.prototype.updateOrgUnitModel = function () {
        this.displayOrgTree();
        this.onOrgUnitUpdate.emit({ name: 'ou', value: this.getOrgUnitsForAnalytics(this.orgunit_model, false) });
    };
    // prepare a proper name for updating the organisation unit display area.
    OrgUnitFilterComponent.prototype.getProperPreOrgunitName = function () {
        var name = "";
        if (this.orgunit_model.selection_mode == "Group") {
            var use_value = this.orgunit_model.selected_group.split("-");
            for (var _i = 0, _a = this.orgunit_model.orgunit_groups; _i < _a.length; _i++) {
                var single_group = _a[_i];
                if (single_group.id == use_value[1]) {
                    name = single_group.name + " in";
                }
            }
        }
        else if (this.orgunit_model.selection_mode == "Usr_orgUnit") {
            if (this.orgunit_model.selected_user_orgunit == "USER_ORGUNIT") {
                name = this.orgunit_model.user_orgunits[0].name;
            }
            if (this.orgunit_model.selected_user_orgunit == "USER_ORGUNIT_CHILDREN") {
                name = this.getOrgUnitName(this.orgunit_model.user_orgunits[0].id) + " sub-units";
            }
            if (this.orgunit_model.selected_user_orgunit == "USER_ORGUNIT_GRANDCHILDREN") {
                name = this.getOrgUnitName(this.orgunit_model.user_orgunits[0].id) + " sub-x2-units";
            }
        }
        else if (this.orgunit_model.selection_mode == "Level") {
            var use_level = this.orgunit_model.selected_level.split("-");
            for (var _b = 0, _c = this.orgunit_model.orgunit_levels; _b < _c.length; _b++) {
                var single_level = _c[_b];
                if (single_level.level == use_level[1]) {
                    name = single_level.name + " in";
                }
            }
        }
        else {
            name = "";
        }
        return name;
    };
    // get user organisationunit name
    OrgUnitFilterComponent.prototype.getOrgUnitName = function (id) {
        var orgunit = this.orgtree.treeModel.getNodeById(id);
        return orgunit.name;
    };
    // a function to prepare a list of organisation units for analytics
    OrgUnitFilterComponent.prototype.getOrgUnitsForAnalytics = function (orgunit_model, with_children) {
        var orgUnits = [];
        var organisation_unit_analytics_string = "";
        // if the selected orgunit is user org unit
        if (orgunit_model.selection_mode == "Usr_orgUnit") {
            if (orgunit_model.user_orgunits.length == 1) {
                var user_orgunit = this.orgtree.treeModel.getNodeById(orgunit_model.user_orgunits[0].id);
                orgUnits.push(user_orgunit.id);
                if (user_orgunit.hasOwnProperty('children') && with_children) {
                    for (var _i = 0, _a = user_orgunit.children; _i < _a.length; _i++) {
                        var orgunit = _a[_i];
                        orgUnits.push(orgunit.id);
                    }
                }
            }
            else {
                organisation_unit_analytics_string += orgunit_model.selected_user_orgunit;
            }
        }
        else {
            // if there is only one organisation unit selected
            if (orgunit_model.selected_orgunits.length == 1) {
                var detailed_orgunit = this.orgtree.treeModel.getNodeById(orgunit_model.selected_orgunits[0].id);
                orgUnits.push(detailed_orgunit.id);
                if (detailed_orgunit.hasOwnProperty('children') && with_children) {
                    for (var _b = 0, _c = detailed_orgunit.children; _b < _c.length; _b++) {
                        var orgunit = _c[_b];
                        orgUnits.push(orgunit.id);
                    }
                }
            }
            else {
                orgunit_model.selected_orgunits.forEach(function (orgunit) {
                    orgUnits.push(orgunit.id);
                });
            }
            if (orgunit_model.selection_mode == "orgUnit") {
            }
            if (orgunit_model.selection_mode == "Level") {
                organisation_unit_analytics_string += orgunit_model.selected_level + ";";
            }
            if (orgunit_model.selection_mode == "Group") {
                organisation_unit_analytics_string += orgunit_model.selected_group + ";";
            }
        }
        return organisation_unit_analytics_string + orgUnits.join(";");
    };
    // Get system wide settings
    OrgUnitFilterComponent.prototype.getOrgunitLevelsInformation = function () {
        return this.http.get(this.root_url + 'api/organisationUnitLevels.json?fields=id,name,level&order=level:asc')
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    // Get organisation unit groups information
    OrgUnitFilterComponent.prototype.getOrgunitGroups = function () {
        return this.http.get(this.root_url + 'api/organisationUnitGroups.json?fields=id,name&paging=false')
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    OrgUnitFilterComponent.prototype.handleError = function (error) {
        return Observable.throw(error);
    };
    // Get current user information
    OrgUnitFilterComponent.prototype.getUserInformation = function () {
        return this.http.get(this.root_url + 'api/me.json?fields=dataViewOrganisationUnits[id,level],organisationUnits[id,level]')
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    OrgUnitFilterComponent.prototype.getUserHighestOrgUnitlevel = function (userOrgunits) {
        var level;
        var orgunits = [];
        if (userOrgunits.dataViewOrganisationUnits.length == 0) {
            level = userOrgunits.organisationUnits[0].level;
            userOrgunits.organisationUnits.forEach(function (orgunit) {
                if (orgunit.level <= level) {
                    level = orgunit.level;
                }
            });
        }
        else {
            level = userOrgunits.dataViewOrganisationUnits[0].level;
            userOrgunits.dataViewOrganisationUnits.forEach(function (orgunit) {
                if (orgunit.level <= level) {
                    level = orgunit.level;
                }
            });
        }
        return level;
    };
    OrgUnitFilterComponent.prototype.getuserOrganisationUnitsWithHighestlevel = function (level, userOrgunits) {
        var orgunits = [];
        if (userOrgunits.dataViewOrganisationUnits.length == 0) {
            userOrgunits.organisationUnits.forEach(function (orgunit) {
                if (orgunit.level == level) {
                    orgunits.push(orgunit.id);
                }
            });
        }
        else {
            level = userOrgunits.dataViewOrganisationUnits[0].level;
            userOrgunits.dataViewOrganisationUnits.forEach(function (orgunit) {
                if (orgunit.level == level) {
                    orgunits.push(orgunit.id);
                }
            });
        }
        return orgunits;
    };
    OrgUnitFilterComponent.prototype.getInitialOrgunitsForTree = function (orgunits) {
        return this.http.get(this.root_url + 'api/me.json?fields=organisationUnits[id,name,children[id,name]]&filter=id:in:[' + orgunits.join(",") + ']&paging=false')
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    // Generate Organisation unit url based on the level needed
    OrgUnitFilterComponent.prototype.generateUrlBasedOnLevels = function (level) {
        var childrenLevels = "[]";
        for (var i = 1; i < level + 1; i++) {
            childrenLevels = childrenLevels.replace("[]", "[id,name,children[]]");
        }
        var new_string = childrenLevels.substring(1);
        new_string = new_string.replace(",children[]]", "");
        return new_string;
    };
    // Get orgunit for specific
    OrgUnitFilterComponent.prototype.getAllOrgunitsForTree1 = function (fields, orgunits) {
        return this.http.get(this.root_url + 'api/organisationUnits.json?fields=' + fields + '&filter=id:in:[' + orgunits.join(",") + ']&paging=false')
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    OrgUnitFilterComponent.prototype.closeFilter = function () {
        this.showOrgTree = false;
    };
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], OrgUnitFilterComponent.prototype, "orgunit_model", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], OrgUnitFilterComponent.prototype, "orgunit_tree_config", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], OrgUnitFilterComponent.prototype, "disabled", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', EventEmitter)
    ], OrgUnitFilterComponent.prototype, "onOrgUnitUpdate", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', EventEmitter)
    ], OrgUnitFilterComponent.prototype, "onOrgUnitInit", void 0);
    __decorate([
        ViewChild('orgtree'), 
        __metadata('design:type', TreeComponent)
    ], OrgUnitFilterComponent.prototype, "orgtree", void 0);
    OrgUnitFilterComponent = __decorate([
        Component({
            selector: 'app-org-unit-filter',
            templateUrl: './org-unit-filter.component.html',
            styleUrls: ['./org-unit-filter.component.css']
        }), 
        __metadata('design:paramtypes', [Http, OrgUnitService])
    ], OrgUnitFilterComponent);
    return OrgUnitFilterComponent;
}());
//# sourceMappingURL=org-unit-filter.component.js.map