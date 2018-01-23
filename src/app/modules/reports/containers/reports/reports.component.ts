import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  @Input() reportList: any[];
  tableList: any[];
  constructor() {
    this.tableList = [];
  }

  ngOnInit() {
    if (this.reportList) {
      this.tableList = [
        {
          id: 'reports_title',
          items: [
            {
              value: 'Reports',
              style: {
                'font-weight': 'bold',
                'text-align': 'center',
                'background-color': '#eee'
              },
              colSpan: 2
            }
          ]
        },
        {
          id: 'reports_headers',
          items: [
            {
              value: '#',
              style: {
                'font-weight': 'bold',
                width: '5%',
                'background-color': '#eee'
              }
            },
            { value: 'Name', style: { 'font-weight': 'bold' } }
          ]
        },
        ..._.map(
          this.reportList,
          (reportListItem: any, reportListItemIndex: number) => {
            const itemKeys: any[] = _.filter(
              _.keys(reportListItem),
              (key: string) => key !== 'id'
            );

            return {
              id: reportListItem.id,
              items: [
                {
                  value: reportListItemIndex + 1,
                  style: { width: '5%', 'background-color': '#eee' }
                },
                ..._.map(itemKeys, (key: string) => {
                  return { value: reportListItem[key] };
                })
              ]
            };
          }
        )
      ];
    }
  }
}
