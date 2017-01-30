import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from "@angular/http";

@Injectable()
export class InterpretationService {

  constructor(private http: Http) { }

  saveInterpreationComment(dashboardItem,interpration,comment) {
    interpration.savingComment = true;
    let headers = new Headers({'Content-Type': 'text/html'});
    let options = new RequestOptions({headers: headers});
    this.http.post('../../../api/interpretations/' + interpration.id + '/comment', comment, options)
      .map((res: Response) => res.json())
      .subscribe(response => {
        $scope.getInterpretations(dashboardItem).then(function (items) {
          interpration.savingComment = false;
          interpration.newComment = '';
          dashboardItem.interpretations = items;
        });
      });
  }

  //save new interpretaion
  saveInterpretation(dashboardItem,type,id,comment){
    dashboardItem.savingInterpretation = true;
    let headers = new Headers({'Content-Type': 'text/html'});
    let options = new RequestOptions({headers: headers});
    this.http.post('../../../api/interpretations/'+type+'/'+id, comment, options)
      .map((res: Response) => res.json())
      .subscribe(response => {
        $scope.getInterpretations(dashboardItem).then(function(items){
          dashboardItem.savingInterpretation = false;
          dashboardItem.new_interpretation = '';
          dashboardItem.interpretations = items;
      });
      })
  }

  $scope.getInterpretations = function(dashboard){
  var name = "";
  var deferred = $q.defer();
  if(dashboard.type == "REPORT_TABLE"){
    $http.get('../../../api/interpretations.json?fields=name,id,user[name],comments[*],*&filter=reportTable.id:eq:' + dashboard.reportTable.id + '&paging=false')
      .success(function(data){
        $http.get('../../../api/reportTables/' + dashboard.reportTable.id +'/data.html').success(function(table){
          data.image = table;
          data.type = 'table';
          data.id = dashboard.reportTable.id;
          deferred.resolve(data);
        });

      })
      .error(function(errorMessageData){
        console.error(errorMessageData);
        deferred.reject();
      });
    return deferred.promise;
  }if(dashboard.type == "CHART"){
    $http.get('../../../api/interpretations.json?fields=name,id,user[name],comments[*],*&filter=chart.id:eq:' + dashboard.chart.id + '&paging=false')
      .success(function(data){
        data.image = '../../../api/charts/' + dashboard.chart.id +'/data';
        data.type = 'chart';
        data.id = dashboard.chart.id;
        deferred.resolve(data);
      })
      .error(function(errorMessageData){
        console.error(errorMessageData);
        deferred.reject();
      });
    return deferred.promise;
  }if(dashboard.type == "MAP"){
    $http.get('../../../api/interpretations.json?fields=name,id,user[name],comments[*],*&filter=map.id:eq:' + dashboard.map.id + '&paging=false')
      .success(function(data){
        data.image = '../../../api/maps/' + dashboard.map.id +'/data';
        data.type = 'map';
        data.id = dashboard.map.id;
        deferred.resolve(data);
      })
      .error(function(errorMessageData){
        console.error(errorMessageData);
        deferred.reject();
      });
    return deferred.promise;
  }if(dashboard.type == "EVENT_REPORT"){
    $http.get('../../../api/interpretations.json?fields=name,id,user[name],comments[*],*&filter=reportTable.id:eq:' + dashboard.eventReport.id + '&paging=false')
      .success(function(data){
        $http.get('../../../api/reportTables/' + dashboard.eventReport.id +'/data.html').success(function(table){
          data.image = table;
          data.type = 'table';
          data.id = dashboard.eventReport.id;
          deferred.resolve(data);
        });
      })
      .error(function(errorMessageData){
        console.error(errorMessageData);
        deferred.reject();
      });
    return deferred.promise;
  }if(dashboard.type == "EVENT_CHART"){
    $http.get('../../../api/interpretations.json?fields=name,id,user[name],comments[*],*&filter=chart.id:eq:' + dashboard.eventChart.id + '&paging=false')
      .success(function(data){
        data.image = '../../../api/charts/' + dashboard.eventChart.id +'/data';
        data.type = 'chart';
        data.id = dashboard.eventChart.id;
        deferred.resolve(data);
      })
      .error(function(errorMessageData){
        console.error(errorMessageData);
        deferred.reject();
      });
    return deferred.promise;
  }
  return name;
};

}
