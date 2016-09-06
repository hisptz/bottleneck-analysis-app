/**
 * Created by rajab on 9/2/16.
 */
var searchController  = angular.module('searchController',[]);

searchController.controller('SearchController', function($scope, $http) {

    $scope.search = '';
    $scope.isShown = false;

    $scope.searchData = function(search) {
        $scope.isShown = true;
        $http.get('/api/dashboards/q/'+ search + '.json').then(function(response) {
            var searchData = response.data;
            $scope.data = searchData;
            console.log($scope.data)
        });
    };

});
