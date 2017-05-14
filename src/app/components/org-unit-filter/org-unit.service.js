var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs';
export var OrgUnitService = (function () {
    function OrgUnitService(http) {
        this.http = http;
        this.nodes = null;
        this.orgunit_levels = [];
        this.user_orgunits = [];
        this.orgunit_groups = [];
        this.initial_orgunits = [];
    }
    // Get current user information
    OrgUnitService.prototype.getUserInformation = function (priority) {
        if (priority === void 0) { priority = null; }
        if (priority == false) {
            return this.http.get('../../../api/me.json?fields=dataViewOrganisationUnits[id,name,level],organisationUnits[id,name,level]')
                .map(function (response) { return response.json(); })
                .catch(this.handleError);
        }
        else {
            return this.http.get('../../../api/me.json?fields=organisationUnits[id,name,level]')
                .map(function (response) { return response.json(); })
                .catch(this.handleError);
        }
    };
    OrgUnitService.prototype.getuserOrganisationUnitsWithHighestlevel = function (level, userOrgunits) {
        var orgunits = [];
        if (!userOrgunits.hasOwnProperty('dataViewOrganisationUnits')) {
            userOrgunits.organisationUnits.forEach(function (orgunit) {
                if (orgunit.level == level) {
                    orgunits.push(orgunit.id);
                }
            });
        }
        else {
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
        }
        return orgunits;
    };
    /**
     * get the highest level among organisation units that user belongs to
     * @param userOrgunits
     * @returns {any}
     */
    OrgUnitService.prototype.getUserHighestOrgUnitlevel = function (userOrgunits) {
        var level;
        var orgunits = [];
        if (!userOrgunits.hasOwnProperty('dataViewOrganisationUnits')) {
            level = userOrgunits.organisationUnits[0].level;
            userOrgunits.organisationUnits.forEach(function (orgunit) {
                if (orgunit.level <= level) {
                    level = orgunit.level;
                }
            });
        }
        else {
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
        }
        return level;
    };
    /**
     * get the list of user orgunits as an array
     * @param userOrgunits
     * @returns {any}
     */
    OrgUnitService.prototype.getUserOrgUnits = function (userOrgunits) {
        var orgunits = [];
        if (!userOrgunits.hasOwnProperty('dataViewOrganisationUnits')) {
            userOrgunits.organisationUnits.forEach(function (orgunit) {
                orgunits.push(orgunit);
            });
        }
        else {
            if (userOrgunits.dataViewOrganisationUnits.length == 0) {
                userOrgunits.organisationUnits.forEach(function (orgunit) {
                    orgunits.push(orgunit);
                });
            }
            else {
                userOrgunits.dataViewOrganisationUnits.forEach(function (orgunit) {
                    orgunits.push(orgunit);
                });
            }
        }
        return orgunits;
    };
    OrgUnitService.prototype.prepareOrgunits = function (priority) {
        var _this = this;
        if (priority === void 0) { priority = null; }
        this.getOrgunitLevelsInformation()
            .subscribe(function (data) {
            _this.orgunit_levels = data.organisationUnitLevels;
            _this.getUserInformation(priority).subscribe(function (userOrgunit) {
                _this.user_orgunits = _this.getUserOrgUnits(userOrgunit);
                var level = _this.getUserHighestOrgUnitlevel(userOrgunit);
                var all_levels = data.pager.total;
                var orgunits = _this.getuserOrganisationUnitsWithHighestlevel(level, userOrgunit);
                var use_level = parseInt(all_levels) - (parseInt(level) - 1);
                var fields = _this.generateUrlBasedOnLevels(use_level);
                _this.getAllOrgunitsForTree1(fields, orgunits).subscribe(function (items) {
                    //noinspection TypeScriptUnresolvedVariable
                    _this.nodes = items.organisationUnits;
                });
            });
        });
        this.getOrgunitGroups().subscribe(function (groups) {
            _this.orgunit_groups = groups.organisationUnitGroups;
        });
    };
    // Generate Organisation unit url based on the level needed
    OrgUnitService.prototype.generateUrlBasedOnLevels = function (level) {
        var childrenLevels = "[]";
        for (var i = 1; i < level + 1; i++) {
            childrenLevels = childrenLevels.replace("[]", "[id,name,children[]]");
        }
        var new_string = childrenLevels.substring(1);
        new_string = new_string.replace(",children[]]", "");
        return new_string;
    };
    // Get system wide settings
    OrgUnitService.prototype.getOrgunitLevelsInformation = function () {
        var _this = this;
        return Observable.create(function (observer) {
            if (_this.orgunit_levels.length != 0) {
                observer.next(_this.orgunit_levels);
                observer.complete();
            }
            else {
                _this.http.get('../../../api/organisationUnitLevels.json?fields=id,name,level&order=level:asc')
                    .map(function (response) { return response.json(); })
                    .catch(_this.handleError)
                    .subscribe(function (levels) {
                    _this.orgunit_levels = levels;
                    observer.next(_this.orgunit_levels);
                    observer.complete();
                }, function (error) {
                    observer.error("some error occur");
                });
            }
        });
    };
    // Get organisation unit groups information
    OrgUnitService.prototype.getOrgunitGroups = function () {
        var _this = this;
        return Observable.create(function (observer) {
            if (_this.orgunit_groups.length != 0) {
                observer.next(_this.orgunit_groups);
                observer.complete();
            }
            else {
                _this.http.get('../../../api/organisationUnitGroups.json?fields=id,name&paging=false')
                    .map(function (response) { return response.json(); })
                    .catch(_this.handleError)
                    .subscribe(function (groups) {
                    _this.orgunit_groups = groups.organisationUnitGroups;
                    observer.next(_this.orgunit_groups);
                    observer.complete();
                }, function (error) {
                    observer.error("some error occur");
                });
            }
        });
    };
    // Get system wide settings
    OrgUnitService.prototype.getAllOrgunitsForTree = function (fields) {
        return this.http.get('../../../api/organisationUnits.json?filter=level:eq:1&paging=false&fields=' + fields)
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    // Get orgunit for specific
    OrgUnitService.prototype.getAllOrgunitsForTree1 = function (fields, orgunits) {
        var _this = this;
        if (fields === void 0) { fields = null; }
        if (orgunits === void 0) { orgunits = null; }
        return Observable.create(function (observer) {
            if (_this.nodes != null) {
                observer.next(_this.nodes);
                observer.complete();
            }
            else {
                _this.http.get('../../../api/organisationUnits.json?fields=' + fields + '&filter=id:in:[' + orgunits.join(",") + ']&paging=false')
                    .map(function (response) { return response.json(); })
                    .catch(_this.handleError)
                    .subscribe(function (nodes) {
                    _this.nodes = nodes.organisationUnits;
                    observer.next(_this.nodes);
                    observer.complete();
                }, function (error) {
                    observer.error("some error occured");
                });
            }
        });
    };
    // Get initial organisation units to speed up things during loading
    OrgUnitService.prototype.getInitialOrgunitsForTree = function (orgunits) {
        var _this = this;
        return Observable.create(function (observer) {
            if (_this.initial_orgunits != null) {
                observer.next(_this.initial_orgunits);
                observer.complete();
            }
            else {
                _this.http.get('../../../api/organisationUnits.json?fields=id,name,children[id,name]&filter=id:in:[' + orgunits.join(",") + ']&paging=false')
                    .map(function (response) { return response.json(); })
                    .catch(_this.handleError)
                    .subscribe(function (nodes) {
                    _this.initial_orgunits = nodes.organisationUnits;
                    observer.next(_this.initial_orgunits);
                    observer.complete();
                }, function (error) {
                    observer.error("some error occured");
                });
            }
        });
    };
    // Handling error
    OrgUnitService.prototype.handleError = function (error) {
        return Observable.throw(error);
    };
    OrgUnitService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Http])
    ], OrgUnitService);
    return OrgUnitService;
}());
//# sourceMappingURL=org-unit.service.js.map