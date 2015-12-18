var mainController  = angular.module('mainController',[]);

mainController.controller('MenuController',['$scope','$window',function($scope,$window
){
    $scope.back = function(){
        $window.history.back();
    }
}])
    .controller('MainController',['$scope','projectsManager','mapManager',function($scope,
                                                                      projectsManager,
                                                                      mapManager,
                                                                      $modal,
                                                                      $timeout,
                                                                      $translate,
                                                                      $anchorScroll,
                                                                      //storage,
                                                                      Paginator,
                                                                      //OptionSetService,
                                                                      ContextMenuSelectedItem,
                                                                      //DateUtils,
                                                                      $filter,
                                                                      $http,
                                                                      //CalendarService,
                                                                      GridColumnService,
                                                                      CustomFormService,
                                                                      //ErrorMessageService,
                                                                      ModalService,
                                                                      DialogService,
                                                                      DHIS2URL
    ){

        $scope.loading = true;
        projectsManager.loadAllProjects().then(function(projects){
            $scope.projects = projects;
        })
        projectsManager.loadAllLocations().then(function(locations){
            $scope.locations = locations;
        })
        $scope.mapObject = {};
        mapManager.renderMap("m0frOspS7JY",$scope.mapObject,1);

        /*
         *getting project summary by country level
         */
        $scope.countryList = [];
        projectsManager.loadAllProjectByOrganisationUnit().then(function(orgUnits){



            orgUnits.forEach(function(country){

                var projectsList = $scope.getProjects(country.children);
                projectsList.push.apply(projectsList,country.organisationUnitGroups);
                console.log('Projects list : ' + JSON.stringify(projectsList));
                var uniqueProjects = [];
                projectsList.forEach(function(project){

                    if(!isIn(project,uniqueProjects)){
                        uniqueProjects.push(project);
                    }
                });
                //add grant status summary for projects in the country
                country.activeGrants = [];
                country.inactiveGrants = [];
                country.closedGrants = [];
                uniqueProjects.forEach(function(project){

                    var grantStatus = checkingGrantStatus(project);
                    if(grantStatus == 'Inactive'){
                        country.inactiveGrants.push(project);
                    }
                    if(grantStatus == 'Active'){
                        country.activeGrants.push(project);
                    }
                    if(grantStatus == 'Closed'){
                        country.closedGrants.push(project);
                    }
                })
                country.uniqueProjects = uniqueProjects;
                //push country list
                $scope.countryList.push(country);
                $scope.loading = false;
            })
        });

        //function to return projects for lowe level
        $scope.getProjects = function(orgUnits){
            var result = [];
            angular.forEach(orgUnits,function(orgUnit){
                if(orgUnit.organisationUnitGroups){
                    result.push.apply(result,orgUnit.organisationUnitGroups);
                }
                result.push.apply(result,$scope.getProjects(orgUnit.children));
            });
            return result;
        }

        //function to count active, inactive as well as closed projects
        function checkingGrantStatus(project){
            var grantStatus = null;
            project.attributeValues.forEach(function(attributeValue){
                if(attributeValue.attribute.name == 'Grant Status'){
                    grantStatus = attributeValue.value;
                }

            })
            return grantStatus
        }

        //function to checking if project is unique
        function isIn(projectInCheck,projects){
            var isIn = false;
            projects.forEach(function(project){
                if(project.id == projectInCheck.id){
                    isIn = true;
                }
            });
            return isIn;
        }

    }])

    .controller('CountryProjectsController',function($scope,
                                                     $modal,
                                                     $timeout,
                                                     $translate,
                                                     $anchorScroll,
                                                     //storage,
                                                     Paginator,
                                                     //OptionSetService,
                                                     //ProgramFactory,
                                                     //ProgramStageFactory,
                                                     //DHIS2EventFactory,
                                                     //DHIS2EventService,
                                                     ContextMenuSelectedItem,
                                                     //DateUtils,
                                                     $filter,
                                                     $http,
                                                     //CalendarService,
                                                     GridColumnService,
                                                     CustomFormService,
                                                     //ErrorMessageService,
                                                     ModalService,
                                                     DialogService,
                                                     DHIS2URL,
                                                     $routeParams,
                                                     //countriesManager,
                                                     projectsManager) {
        /*projectsManager.loadProjectByLocation($routeParams.id).then(function(projects){
         $scope.projects = projects;
         })
         projectsManager.loadLocation($routeParams.id).then(function(filteredLocation){
         $scope.location = filteredLocation;
         })*/
        $scope.loading = true;
        projectsManager.loadAllProjectByOrganisationUnit($routeParams.id).then(function(country){

            var projectsList = $scope.getProjects(country.children);
            projectsList.push.apply(projectsList,country.organisationUnitGroups);
            var uniqueProjects = [];

            projectsList.forEach(function(project){
                if(!isIn(project,uniqueProjects)){
                    uniqueProjects.push(project);
                }

            });
            country.projects = []
            //push all  necessary data for the country's projects
            uniqueProjects.forEach(function(project){

                var projectData = getProjectAttributesData(project);
                country.projects.push(projectData);
            })
            $scope.countryProjects = country.projects;
            $scope.location = country;
            $scope.loading = false;
        });


        //function to get project data
        function getProjectAttributesData(project){


            project.attributeValues.forEach(function(attributeValue){
                if(attributeValue.attribute.name == 'Project Name'){
                    project.projectName = attributeValue.value;
                }
                if(attributeValue.attribute.name == 'Grant Status'){
                    project.grantStatus = attributeValue.value;
                }
                if(attributeValue.attribute.name == 'Project Donor'){
                    project.donor = attributeValue.value;
                }if(attributeValue.attribute.name == 'Project Start Date'){
                    project.startDate = attributeValue.value;
                }
                if(attributeValue.attribute.name == 'Project End Date'){
                    project.endDate = attributeValue.value;
                }
            });
            return project;
        }

        //function to checking if project is unique
        function isIn(projectInCheck,projects){
            var isIn = false;
            projects.forEach(function(project){
                if(project.id == projectInCheck.id){
                    isIn = true;
                }
            });
            return isIn;
        }
        //function to return projects for lowe level
        //function to return projects for lowe level
        $scope.getProjects = function(orgUnits){
            var result = [];
            angular.forEach(orgUnits,function(orgUnit){
                if(orgUnit.organisationUnitGroups){
                    result.push.apply(result,orgUnit.organisationUnitGroups);
                }
                result.push.apply(result,$scope.getProjects(orgUnit.children));
            });
            return result;
        }

    })
    .controller('ProjectController', function($scope,
                                              $modal,
                                              $timeout,
                                              $translate,
                                              $anchorScroll,
                                              //storage,
                                              Paginator,
                                              //OptionSetService,
                                              //ProgramFactory,
                                              //ProgramStageFactory,
                                              //DHIS2EventFactory,
                                              //DHIS2EventService,
                                              ContextMenuSelectedItem,
                                              //DateUtils,
                                              $filter,
                                              $http,
                                              //CalendarService,
                                              GridColumnService,
                                              CustomFormService,
                                              //ErrorMessageService,
                                              ModalService,
                                              DialogService,
                                              DHIS2URL,
                                              $routeParams,
                                              Project,
                                              projectsManager,
                                              indicatorsManager,toaster,$q,$location,ivhTreeviewMgr,targetsManager) {


        $scope.data = {	};
        $scope.showSelected = function(sel) {
            $scope.selectedNode = sel;
        };
        $scope.options = {
            onSelect: function($event, node, context) {
                if ($event.ctrlKey) {
                    var idx = context.selectedNodes.indexOf(node);
                    if (context.selectedNodes.indexOf(node) === -1) {
                        context.selectedNodes.push(node);

                    } else {
                        context.selectedNodes.splice(idx, 1);
                    }
                } else {
                    context.selectedNodes = [node];
                }
            }
        };
        $scope.getIndicator = function(indicator){
            indicatorsManager.getIndicator(indicator).then(function(value){
                indicator.name = value.name;
            })
        }
        $scope.setNodeSelection = function(rootNodeChildren,orgUnits){

            angular.forEach(rootNodeChildren,function(node){
                node.selected = false;
                angular.forEach(orgUnits,function(orgUnit){
                    if(node.id == orgUnit.id){
                        node.selected = true;
                        ivhTreeviewMgr.expandTo($scope.data.tree, node);
                    }
                });

                $scope.setNodeSelection(node.children,orgUnits);
            });
        }
        $scope.page = 1;
        if($routeParams.page){
            $scope.page = $routeParams.page;
        }
        $scope.next = function(){

            if($scope.page == 1){
                //Check if we have selected orgunits
                if(angular.isUndefined($scope.data.project.organisationUnits) || $scope.data.project.organisationUnits.length<1) {
                    toaster.pop('error', "Missing Location", "Please select atleast one organisationunit");
                }else {
                    $scope.saveProject().then(function () {
                        $location.path('/projects/' + $scope.data.project.id + '/edit/2');
                    });
                }
            }else if($scope.page == 2){
                if(angular.isUndefined($scope.data.project.objectives) || $scope.data.project.objectives.length<1) {
                    toaster.pop('error', "Missing Objectives", "Please enter atleast one objective and click 'SAVE&ADD'");
                }else {
                    $scope.saveProjectObjectives().then(function () {
                        $location.path('/projects/' + $scope.data.project.id + '/edit/3');
                    });
                }
            }else if($scope.page == 3){
                $scope.saveProjectIndicators().then(function(){
                    $location.path('/projects/'+$scope.data.project.id+'/edit/4');
                });
            }

        }
        $scope.outcome = {};
        $scope.result = {};
        $scope.addOutCome = function(){
            $scope.data.project.addObjective($scope.outcome);//.outcomes.push({name:"Outcome " + (parseInt($scope.data.project.outcomes.length) + 1),value:$scope.outcome,indicators:[]});
            $scope.outcome = {};
        }
        $scope.addResult = function(objective){
            objective.addResult(objective.res);//.outcomes.push({name:"Outcome " + (parseInt($scope.data.project.outcomes.length) + 1),value:$scope.outcome,indicators:[]});
            objective.res = {};
        }

        $scope.addIndicator = function(outcome){
            outcome.indicators.push({name:"Indicator " + (parseInt(outcome.indicators.length) + 1),value:"map Indicator",target:""});
        }
        $scope.data.multiSelectEvents = {
            "onItemSelect":$scope.onTargetSelect
        }
        $scope.onTargetSelect = function(item){

        }
        $scope.data.donors = [];
        $scope.data.grantStatusOptions = [];
        $scope.getSelectedNodes = function(orgUnits){
            var result = [];
            angular.forEach(orgUnits,function(orgUnit){
                if(orgUnit.selected){
                    result.push(orgUnit);
                }
                var results2 = $scope.getSelectedNodes(orgUnit.children);
                angular.forEach(results2,function(unit){
                    result.push(unit);
                })

            });
            return result;
        }
        $scope.saveProjectSubmit = function(){
            //Check if we have selected orgunits
            if(angular.isUndefined($scope.data.project.organisationUnits) || $scope.data.project.organisationUnits.length<1) {
                toaster.pop('error', "Missing Location", "Please select atleast one organisationunit");
            }else {
                $scope.saveProject().then(function(){
                    //$location.path('/projects/'+$scope.data.project.id+'/view');
                    $location.path('/projects/'+$scope.data.project.id+'/edit');
                });
            }
        }
        $scope.saveProject = function(){
            var deferred = $q.defer();
            $scope.loading = true;
            if($routeParams.id){
                $scope.data.project.update($scope.data,$scope.getSelectedNodes($scope.data.tree)).then(function(){
                    toaster.pop('success', "Awesome Success", "Project Updated successfully.");
                    $scope.loading = false;
                    deferred.resolve();
                },function(error){
                    toaster.pop('error', "Error on Update", "Failed to update project. Check your connection and try again");
                    $scope.loading = false;
                });
            }else{
                $scope.data.project.save($scope.data,$scope.getSelectedNodes($scope.data.tree)).then(function(){
                    toaster.pop('success', "Awesome Success", "Project Saved successfully.");
                    $scope.loading = false;
                    deferred.resolve();
                },function(error){
                    toaster.pop('error', "Error on Update", "Failed to update project. Check connection and try again");
                    $scope.loading = false;
                });
            }
            return deferred.promise;
        };
        $scope.saveProjectObjectivesSubmit = function(){
            if(angular.isUndefined($scope.data.project.objectives) || $scope.data.project.objectives.length<1) {
                toaster.pop('error', "Missing Objectives", "Please select enter atleast one objective and click 'SAVE&ADD'");
            }else {
                $scope.saveProjectObjectives().then(function () {
                    //$location.path('/projects/'+$scope.data.project.id+'/view');
                });
            }
        }
        $scope.saveProjectObjectives = function(){
            var deferred = $q.defer();
            $scope.loading = true;
            $scope.data.project.update().then(function(){
                $scope.data.project.saveObjectives().then(function(){
                    toaster.pop('success', "Awesome Success", "Objectives Saved successfully.");
                    $scope.loading = false;
                    deferred.resolve();
                },function(error){
                    toaster.pop('error', "Error Saving Objectives", "Failed to save Objectives, Check connection and try again");
                    $scope.loading = false;
                });
            });

            return deferred.promise;
        };
        $scope.saveProjectIndicatorsSubmit = function(){
            $scope.saveProjectIndicators().then(function(){
                //$location.path('/projects/'+$scope.data.project.id+'/view');
            });
        }

        $scope.saveProjectIndicators = function(){
            var deferred = $q.defer();
            $scope.loading = true;
            $scope.data.project.saveIndicators().then(function(){
                toaster.pop('success', "Awesome Success", "Indicators Saved successfully.");
                $scope.loading = false;
                deferred.resolve();
            },function(error){
                toaster.pop('error', "Error Saving Indicators", "Failed to Save Indicators, Check connection and try again");
                $scope.loading = false;
            });
            return deferred.promise;
        };

        $scope.saveProjectTargetsSubmit = function(){
            $scope.saveProjectTargets().then(function(){
                //$location.path('/projects/'+$scope.data.project.id+'/view');
            });
        }
        $scope.saveProjectTargets = function(){
            var deferred = $q.defer();
            $scope.loading = true;
            $scope.data.project.saveTargets().then(function(){
                toaster.pop('success', "Awesome Success", "Targets Saved successfully.");
                $scope.loading = false;
                deferred.resolve();
            },function(error){
                toaster.pop('error', "Error Saving Targets", "Failed to save Targets, Check connection and try again");
                $scope.loading = false;
            });
            return deferred.promise;
        };


        $scope.changeNode = function(ivhNode, ivhIsSelected, ivhTree){
            $scope.setNodeSelection($scope.data.tree,$scope.data.project.organisationUnits);
            ivhNode.selected = ivhIsSelected;
        }
        $scope.loadOrgUnits = function(){
            var defer = $q.defer();
            projectsManager.getOrganisationUnits().then(function(result){
                $scope.data.tree = result;
                $scope.data.tree.selectedNodes = [];
                if($routeParams.id){
                    projectsManager.getProject($routeParams.id).then(function(project){
                        $scope.data.project = project;
                        $scope.setNodeSelection($scope.data.tree,project.organisationUnits);
                        $scope.data.selectedNode = $scope.getSelectedNodes($scope.data.tree);
                        defer.resolve();
                    });

                }else{
                    $scope.data.project = new Project();
                    defer.resolve();
                }
            });
            return defer.promise;
        }
        $scope.loadAllData = function(){
            var defer = $q.defer();
            var promises = [];
            promises.push($scope.loadOrgUnits().then(function(){

            }));
            promises.push(projectsManager.loadAllAttributes().then(function(result){
                $scope.data.attributes = result;
            }));
            promises.push(projectsManager.getOptionSets().then(function(result){
                $scope.data.donors = result.donors;
                $scope.data.grantStatusOptions = result.grantStatusOptions;
            }));
            promises.push(indicatorsManager.loadAllIndicators().then(function(indicators) {
                $scope.data.indicators = indicators;
            }));
            promises.push(targetsManager.loadAllTargets().then(function(targets) {
                $scope.data.targets = targets;
            }));
            $q.all(promises).then(function(){
                defer.resolve();
            });
            return defer.promise;
        }

        $scope.data.getTargetName = function(targetId){
            var targetName = null;
            $.each($scope.data.targets,function(targetIndex,target){
                if(target.id==targetId) {
                    targetName=target.name;
                    return false;
                }
            })
            return targetName;
        }

        $scope.loading = true;
        $scope.loadAllData().then(function(){
            $scope.loading = false;
        });
        $scope.printDiv = function (divName) {

            var printContents = document.getElementById(divName).innerHTML;
            var originalContents = document.body.innerHTML;

            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                var popupWin = window.open('', '_blank', 'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWin.window.focus();
                popupWin.document.write('<!DOCTYPE html><html><head>' +
                '<link rel="stylesheet" type="text/css" href="style.css" />' +
                '</head><body onload="window.print()"><div class="reward-body">' + printContents + '</div></html>');
                popupWin.onbeforeunload = function (event) {
                    popupWin.close();
                    return '.\n';
                };
                popupWin.onabort = function (event) {
                    popupWin.document.close();
                    popupWin.close();
                }
            } else {
                var popupWin = window.open('', '_blank', 'width=800,height=600');
                popupWin.document.open();
                popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
                popupWin.document.close();
            }
            popupWin.document.close();

            return true;
        }
    })
    .controller('ReportController', function($scope,
                                             $modal,
                                             $timeout,
                                             $translate,
                                             $anchorScroll,
                                             Paginator,
                                             ContextMenuSelectedItem,
                                             $filter,
                                             $http,
                                             GridColumnService,
                                             CustomFormService,
                                             ModalService,
                                             DialogService,
                                             DHIS2URL,
                                             $routeParams ,
                                             $q,
                                             $route,
                                             Project,
                                             projectsManager,
                                             reportService,
                                             indicatorsManager,toaster,$location,ivhTreeviewMgr,targetsManager) {


        $scope.data = {	};

        $scope.showSelected = function(sel) {
            $scope.selectedNode = sel;
        };
        $scope.options = {
            onSelect: function($event, node, context) {
                if ($event.ctrlKey) {
                    var idx = context.selectedNodes.indexOf(node);
                    if (context.selectedNodes.indexOf(node) === -1) {
                        context.selectedNodes.push(node);

                    } else {
                        context.selectedNodes.splice(idx, 1);
                    }
                } else {
                    context.selectedNodes = [node];
                }
            }
        };

        $scope.data.setNodeSelection = function(rootNodeChildren,orgUnits){

            angular.forEach(rootNodeChildren,function(node){
                node.selected = false;
                angular.forEach(orgUnits,function(orgUnit){
                    if(node.id == orgUnit.id){
                        node.selected = true;
                    }
                });

                $scope.data.setNodeSelection(node.children,orgUnits);
            });
        }
        $scope.data.getSelectedNodes = function(orgUnits){
            var result = [];
            angular.forEach(orgUnits,function(orgUnit){
                if(orgUnit.selected){
                    result.push(orgUnit);
                }
                var results2 = $scope.data.getSelectedNodes(orgUnit.children);
                angular.forEach(results2,function(unit){
                    result.push(unit);
                })

            });
            return result;
        }

        $scope.changeNode = function(ivhNode, ivhIsSelected, ivhTree){
            $scope.data.setNodeSelection($scope.data.tree,$scope.data.project.organisationUnits);
            ivhNode.selected = ivhIsSelected;
        }
        $scope.loadOrgUnits = function(){
            var defer = $q.defer();
            var promises = [];
            promises.push(projectsManager.getOrganisationUnits().then(function(result){
                $scope.data.tree = result;
                $scope.data.tree.selectedNodes = [];

            }));
            $q.all(promises).then(function(){
                defer.resolve();
            });
            return defer.promise;
        }


        $scope.reloadRoute = function() {
            $route.reload();
        }
        //Load project list
        projectsManager.loadAllProjects().then(function(projects) {
            $scope.data.projects = projects;
        });

        //Set project onselect event
        $scope.onSelect = function ($item) {
            $scope.loading=true;
            //Do everything after project selection
            $scope.data.selectedOrganisationUnits=[];
            $scope.data.selectedOrganisationUnitNames=[];
            $scope.loadAllData($item.id).then(function(){
                $scope.loadOrgUnits().then(function(){
                    if($item.id){
                        projectsManager.getProject($item.id).then(function(project){
                            $scope.data.project = project;
                            $scope.data.setNodeSelection($scope.data.tree,project.organisationUnits);
                            $scope.data.tree.selectedNode = $scope.data.getSelectedNodes($scope.data.tree);
                            //Update selected organisation units
                            $scope.data.project.organisationUnits.forEach(function(orgunit){
                                if( $scope.data.selectedOrganisationUnitNames.indexOf(orgunit.name)==-1) $scope.data.selectedOrganisationUnitNames.push(orgunit.name);
                                if( $scope.data.selectedOrganisationUnitNames.indexOf(orgunit.name)==-1) $scope.data.selectedOrganisationUnits.push(orgunit.id);
                            })
                        });

                    }
                    $scope.loading = false;
                })
                console.log($scope.data.project);
                $scope.showProjectInputs = true;

                $scope.loadIndicatorAndTargetValues().then(function(){
                    $scope.showReport = true;
                })
            });

        };

        $scope.loadIndicatorAndTargetValues = function() {
            //Do everything after project selection
            //$scope.data.selectedOrganisationUnits=[];
            //$scope.data.selectedOrganisationUnitNames=[];
            //Update selected organisation units
            $scope.data.project.organisationUnits.forEach(function(orgunit){
                if( $scope.data.selectedOrganisationUnitNames.indexOf(orgunit.name)==-1) $scope.data.selectedOrganisationUnitNames.push(orgunit.name);
                if( $scope.data.selectedOrganisationUnits.indexOf(orgunit.id)==-1) $scope.data.selectedOrganisationUnits.push(orgunit.id);
            })
            //preparare period for calculating indicator values
            $scope.data.projectPeriod = reportService.getMonths($scope.data.project.startDate,$scope.data.project.endDate).join(';');
            $scope.data.projectPeriodList = reportService.getMonths($scope.data.project.startDate,$scope.data.project.endDate);
            //Go through objectives and results and calculate values.
            var defer = $q.defer();
            var promises = [];
            $scope.data.project.objectives.forEach(function(projectObjective){
                //Go through objective indicator and calculate value
                projectObjective.indicators.forEach(function(objectiveIndicator){
                    promises.push(objectiveIndicator.loadIndicatorValue($scope.data.projectPeriod,$scope.data.selectedOrganisationUnits.join(';')));
                    promises.push(objectiveIndicator.loadTargetValue($scope.data.projectPeriod,$scope.data.selectedOrganisationUnits.join(';')));
                })
                //Go through objective results and calculate valaue
                projectObjective.results.forEach(function(objectiveResult){
                    //Go through result indicators
                    objectiveResult.indicators.forEach(function(resultIndicator){
                        promises.push(resultIndicator.loadIndicatorValue($scope.data.projectPeriod,$scope.data.selectedOrganisationUnits.join(';')));
                        promises.push(resultIndicator.loadTargetValue($scope.data.projectPeriod,$scope.data.selectedOrganisationUnits.join(';')));
                    });
                });
            });
            $q.all(promises).then(function(){
                defer.resolve();
            });
            return defer.promise;
        };

        //Project selection model
        $scope.data.selectedProject={};
        $scope.data.translationTexts = {
            "searchPlaceHolder":"Search for Project",
            "buttonDefaultText":"Select a Project"
        }

        $scope.data.multiSelectEvents={
            "onItemSelect":$scope.onSelect
        }

        $scope.data.projectSelectionSettings = {
            "selectionLimit":1,
            "enableSearch":true,
            "smartButtonMaxItems": 3,
            "displayProp":"name",
            "idProp":"id"
        };



        $scope.showReport = false;
        $scope.generateReport = function(sel) {
            $scope.loading=true;
            //Do everything after project selection
            $scope.data.selectedOrganisationUnits=[];
            $scope.data.selectedOrganisationUnitNames=[];
            $scope.loadAllData($scope.data.project.id).then(function(){
                $scope.loadOrgUnits().then(function(){
                    projectsManager.getProject($scope.data.project.id).then(function(project){
                        $scope.data.project = project;
                        $scope.data.setNodeSelection($scope.data.tree,project.organisationUnits);
                        $scope.data.tree.selectedNode = $scope.data.getSelectedNodes($scope.data.tree);
                        //Update selected organisation units
                        $scope.data.project.organisationUnits.forEach(function(orgunit){
                            if( $scope.data.selectedOrganisationUnitNames.indexOf(orgunit.name)==-1) $scope.data.selectedOrganisationUnitNames.push(orgunit.name);
                            if( $scope.data.selectedOrganisationUnitNames.indexOf(orgunit.name)==-1) $scope.data.selectedOrganisationUnits.push(orgunit.id);
                        })
                    });
                })
                $scope.showProjectInputs = true;

                $scope.loadIndicatorAndTargetValues().then(function(){
                    $scope.showReport = true;
                    $scope.loading=false;
                })
            });
        };

        //Loading organisation unit tree
        $scope.data.tree = null;

        $scope.loadOrgUnits();

        $scope.loadAllData = function(projectId){
            var selectedProjectId=projectId;
            var defer = $q.defer();
            var promises = [];
            promises.push($scope.loadOrgUnits().then(function(){
                projectsManager.getProject(selectedProjectId).then(function(project){
                    $scope.data.project = project;
                    $scope.data.setNodeSelection($scope.data.tree,$scope.data.project.organisationUnits);
                    $scope.data.selectedNode = $scope.data.getSelectedNodes($scope.data.tree);
                });
            }));
            promises.push(projectsManager.loadAllAttributes().then(function(result){
                $scope.data.attributes = result;
            }));
            promises.push(projectsManager.getOptionSets().then(function(result){
                $scope.data.donors = result.donors;
                $scope.data.grantStatusOptions = result.grantStatusOptions;
            }));
            promises.push(indicatorsManager.loadAllIndicators().then(function(indicators) {
                $scope.data.indicators = indicators;
            }));
            promises.push(targetsManager.loadAllTargets().then(function(targets) {
                $scope.data.targets = targets;
            }));
            $q.all(promises).then(function(){
                defer.resolve();
            });
            return defer.promise;
        }

        //Print function
        $scope.printDiv = function (divName) {

            var printContents = document.getElementById(divName).innerHTML;
            var originalContents = document.body.innerHTML;

            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                var popupWin = window.open('', '_blank', 'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWin.window.focus();
                popupWin.document.write('<!DOCTYPE html><html><head><title>Project Management Report</title>' +
                '<link rel="stylesheet" type="text/css" href="style.css" />' +
                '</head><body onload="window.print()">' +
                '<style> .table-bordered {  width: 100%;}table {  display: table;  border-collapse: separate;  border-spacing: 2px;  border-color: grey;}table, th, td { border-collapse: collapse; border: 1px solid black;height:50px;}table tr:nth-child(even) {  background-color: #eee;}table tr:nth-child(odd) {  background-color: #fff;}table th {  color: #000000;  background-color: #F5F5F5;}</style>'+
                '<div class="reward-body">' + printContents + '</div></html>');
                popupWin.onbeforeunload = function (event) {
                    popupWin.close();
                    return '.\n';
                };
                popupWin.onabort = function (event) {
                    popupWin.document.close();
                    popupWin.close();
                }
            } else {
                var popupWin = window.open('', '_blank', 'width=800,height=600');
                popupWin.document.open();
                popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
                popupWin.document.close();
            }
            popupWin.document.close();

            return true;
        }


    })
    .controller('ListProjectController', function($scope,
                                                  $modal,
                                                  $timeout,
                                                  $translate,
                                                  $anchorScroll,
                                                  //storage,
                                                  Paginator,
                                                  //OptionSetService,
                                                  //ProgramFactory,
                                                  //ProgramStageFactory,
                                                  //DHIS2EventFactory,
                                                  //DHIS2EventService,
                                                  ContextMenuSelectedItem,
                                                  //DateUtils,
                                                  $filter,
                                                  $http,
                                                  //CalendarService,
                                                  GridColumnService,
                                                  CustomFormService,
                                                  //ErrorMessageService,
                                                  ModalService,
                                                  DialogService,
                                                  DHIS2URL,
                                                  $routeParams,
                                                  $q,
                                                  projectsManager,
                                                  searchService,NgTableParams) {
        $scope.data = {

        }

        $scope.loadData = function(){
            var defer = $q.defer();
            projectsManager.loadAllProjects().then(function(projects) {
                $scope.data.projects = projects;
                $scope.tableParams = new NgTableParams({}, { dataset: $scope.data.projects});
                defer.resolve();
            });
            return defer.promise;
        };
        $scope.loading = true;
        $scope.loadData().then(function(){
            $scope.loading = false;
        });
        $scope.selected = undefined;
        var canceler = $q.defer();

        $scope.getSearch = function(val) {
            canceler.resolve();
            canceler = $q.defer();
            var projects = [];
            angular.forEach($scope.data.projects,function(project){
                if(project.name.toLowerCase().indexOf(val.toLowerCase()) != -1){
                    projects.push(project);
                }
            });
            return projects;
        };

    })
    .controller('HelpController', function($scope,
                                           $modal,
                                           $timeout,
                                           $translate,
                                           $anchorScroll,
                                           //storage,
                                           Paginator,
                                           //OptionSetService,
                                           //ProgramFactory,
                                           //ProgramStageFactory,
                                           //DHIS2EventFactory,
                                           //DHIS2EventService,
                                           ContextMenuSelectedItem,
                                           //DateUtils,
                                           $filter,
                                           $http,
                                           //CalendarService,
                                           GridColumnService,
                                           CustomFormService,
                                           //ErrorMessageService,
                                           ModalService,
                                           DialogService,
                                           DHIS2URL,
                                           $routeParams,
                                           $q,
                                           projectsManager,
                                           searchService,NgTableParams) {
        $scope.data = {

        }

        $scope.oneAtATime = true;

        $scope.groups = [
            {
                title: 'Dynamic Group Header - 1',
                content: 'Dynamic Group Body - 1'
            },
            {
                title: 'Dynamic Group Header - 2',
                content: 'Dynamic Group Body - 2'
            }
        ];

        $scope.items = ['Item 1', 'Item 2', 'Item 3'];

        $scope.addItem = function() {
            var newItemNo = $scope.items.length + 1;
            $scope.items.push('Item ' + newItemNo);
        };

        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };

    })
