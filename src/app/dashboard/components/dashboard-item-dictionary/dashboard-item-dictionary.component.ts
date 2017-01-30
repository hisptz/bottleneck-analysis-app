import {Component, OnInit, Input} from '@angular/core';
import {Response, Http} from "@angular/http";
import {DashboardItemService} from "../../providers/dashboard-item.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-dashboard-item-dictionary',
  templateUrl: './dashboard-item-dictionary.component.html',
  styleUrls: ['./dashboard-item-dictionary.component.css']
})
export class DashboardItemDictionaryComponent implements OnInit {

  private indicators=[];
  private dataelements=[];
  private datasets=[];
  private isIndicator: boolean = false;
  private isDataelements: boolean = false;
  private isDataset: boolean = false;
  public loadingDictionary: boolean;
  public dictionaryError: boolean;
  public index: number;
  @Input() itemData: any;

  constructor(
    private http:Http,
    private dashboardItemService: DashboardItemService,
    private route: ActivatedRoute
  ) {
    this.indicators=[];
    this.dataelements=[];
    this.datasets=[];
    this.loadingDictionary = true;
    this.dictionaryError = false;
    this.index = 0;
  }

  ngOnInit() {
    this.dashboardItemService.getDashboardItemAnalyticsObject(this.itemData).subscribe(analyticObject => {
      this.displayDetail(this.dashboardItemService.getDashboardItemMetadataIdentifiers(analyticObject.dashboardObject));
      this.loadingDictionary = false;
    }, error => {
      this.loadingDictionary = false;
      this.dictionaryError = true;
    })

  }

  toggleDictionaryBody(index) {
    this.index = this.index == index ? -1 : index;
  }

  displayDetail(uid){
    this.metadataFromAnalyticsLink(uid).forEach(value => {
      this.http.get('../../../api/identifiableObjects/'+value+'.json')
        .map((response:Response)=>response.json())
        .subscribe(data=>{
          const metadataLink=data.href;
          if (metadataLink.indexOf("indicators")>=1){

            const indicatorUrl=metadataLink+'.json?fields=displayName,id,name,numeratorDescription,denominatorDescription,denominator,numerator,indicatorType[id,name],dataSets[id,name,periodType]';
            this.http.get(indicatorUrl)
              .subscribe((data:Response)=>{
                  let indicatorObject=data.json();
                  this.http.get('../../../api/expressions/description?expression='+encodeURIComponent(data.json().numerator))
                    .subscribe((numExp:Response)=>{
                        let  numerator=numExp.json().description;
                        this.http.get('../../../api/expressions/description?expression='+encodeURIComponent(data.json().denominator))
                          .subscribe((denoExp:Response)=>{
                            let denominator=denoExp.json().description;
                            this.indicators.push({name:indicatorObject.name,uid:indicatorObject.id,denominatorDescription:indicatorObject.denominatorDescription,numeratorDescription:indicatorObject.numeratorDescription,numerator:numerator,denominator:denominator,indicatorType:indicatorObject.indicatorType,dataSets:indicatorObject.dataSets,numeratorForm:indicatorObject.numerator,demonitorForm:indicatorObject.denominator});
                            //=indicators
                            console.log(this.indicators)// It brings undefined
                          })
                        //Here you do yor stuff.
                        //console.log(numExp.json())
                      }
                    )

                }

              )
            this.isIndicator=true
          }else if(metadataLink.indexOf("dataElements")>=1){
            const dataelementUrl=metadataLink+'.json?fields=id,name,aggregationType,displayName,categoryCombo[id,name,categories[id,name,categoryOptions[id,name]]],dataSets[id,name,periodType]'
            this.http.get(dataelementUrl)
              .subscribe((dataelement:Response)=>{
                this.dataelements.push(dataelement.json());
                console.log(this.dataelements)// It brings undefined
              })
            this.isDataelements=true;
          }else if(metadataLink.indexOf("dataSets")>=1){
            const datasetUrl=metadataLink+'.json?fields=id,name,periodType,shortName,categoryCombo[id,name,categories[id,name,categoryOptions[id,name]]]'
            this.http.get(datasetUrl)
              .subscribe((dataset:Response)=>{
                this.datasets.push(dataset.json())
                console.log(this.datasets)// It brings undefined
              })
            this.isDataset=true;
          }

        })
    })
  }
  metadataFromAnalyticsLink(dx){
    var separatedx=[]
    if(dx.indexOf(';')>=1){
      separatedx=dx.split(';')
    }else{
      separatedx.push(dx);
    }
    return separatedx;

  }
}
