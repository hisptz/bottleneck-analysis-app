/**
 * Created by rajab on 9/2/16.
 */
var searchController  = angular.module('searchController',[]);

searchController.controller('SearchController', function($scope, $http, $routeParams, $route, $location, $window) {

    //@todo Code should be well organized
    $scope.search = '';
    $scope.isShown = false;
    $scope.noResult = false;
    $scope.showMessage = false;

    $scope.showSearchBody = function(search) {
        var isShown = $scope.isShown;

        if(isShown == false && search == '') {
            $scope.isShown = false;
        } else {
            $scope.isShown = true;
        }

    }

    $scope.hideSearchBody = function() {
        $scope.isShown = false;
    }

    $scope.searchData = function(search) {

        if((search != '') && (search.match(/^[mM]/) != null)) {
            $scope.isShown = true;
            var messageUrl = '/api/messageConversations.json?fields=none&paging=true&pageSize=1';
            //Search messages
            $http.get(messageUrl).then(function(response) {
                var message = response.data.pager.total
                if(message > 0) {
                    $scope.messageCount = message;
                    $scope.showMessage = true;
                } else {
                    $scope.showMessage = false;
                }

            });

            $http.get('/api/dashboards/q/'+ search + '.json').then(function(response) {
                $scope.data = response.data;
            });

        } else if(search != '') {
            $scope.isShown = true;
            $scope.showMessage = false;
            $http.get('/api/dashboards/q/'+ search + '.json').then(function(response) {
                $scope.data = response.data;
            });
        } else {
            $scope.isShown = false;
        }
    };

    $scope.addItemContent = function(type, id) {
        $scope.isShown = false;
        var data = {
            type: type,
            id: id
        };
        var id = $routeParams.dashboardid;
        console.log(id);
        var url = '/api/dashboards/'+ id + '/items/content';
        var redirectUrl = '/dashboards/'+ id + '/dashboard';

        $http({
            method: 'POST',
            url: url,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: data
        }).then(function(response) {
            $location.path(redirectUrl);
        })
    }


});
